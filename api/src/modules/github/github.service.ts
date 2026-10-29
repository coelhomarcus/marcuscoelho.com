import { db } from "../../config/database";
import { env } from "../../config/env";
import { githubContributions, githubPullRequests, githubStats } from "./github.schema";
import { contributionsDataSchema, parseGitHubResponse, pullRequestsDataSchema, statsDataSchema, type ContributionsData, type PullRequestsData, type StatsData } from "./github.validation";
import { AppError } from "../../shared/errors";
import { eq } from "drizzle-orm";
import type { ZodType } from "zod";
import type { PgInsertValue, PgUpdateSetSource } from "drizzle-orm/pg-core";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_USERNAME = "coelhomarcus";
const GITHUB_REQUEST_TIMEOUT_MS = 10_000;

const CONTRIBUTIONS_QUERY = `
  query {
    user(login: "${GITHUB_USERNAME}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const STATS_QUERY = `
  query {
    user(login: "${GITHUB_USERNAME}") {
      pullRequests(states: MERGED) {
        totalCount
      }
      issues(states: CLOSED) {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes {
          name
          nameWithOwner
          url
          isPrivate
          stargazerCount
          createdAt
          pushedAt
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
          releases(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) {
            nodes {
              releaseAssets(first: 20) {
                nodes {
                  downloadCount
                }
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

const PULL_REQUESTS_PER_STATE = 5;
const pullRequestSearch = (alias: string, filter: string) => `
    ${alias}: search(
      query: "author:${GITHUB_USERNAME} type:pr is:public ${filter} sort:updated-desc"
      type: ISSUE
      first: ${PULL_REQUESTS_PER_STATE}
    ) {
      issueCount
      nodes {
        ... on PullRequest {
          title
          url
          createdAt
          repository {
            nameWithOwner
          }
        }
      }
    }`;

const PULL_REQUESTS_QUERY = `
  query {
    ${pullRequestSearch("merged", "is:merged")}
    ${pullRequestSearch("open", "is:open")}
    ${pullRequestSearch("closed", "is:closed is:unmerged")}
  }
`;

const CACHE_ROW_ID = 1;
const REFRESH_RETRY_AFTER_MS = 60_000;

function dedupeRefresh<T>(refresh: () => Promise<T>) {
  let pending: Promise<T> | null = null;
  let failedAt = 0;
  let lastError: unknown;

  return () => {
    if (pending) return pending;
    if (Date.now() - failedAt < REFRESH_RETRY_AFTER_MS) {
      return Promise.reject(lastError);
    }

    pending = refresh()
      .catch((error: unknown) => {
        failedAt = Date.now();
        lastError = error;
        throw error;
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  };
}

type CacheTable =
  | typeof githubContributions
  | typeof githubStats
  | typeof githubPullRequests;

async function saveCacheRow<T extends CacheTable>(
  table: T,
  values: Omit<T["$inferInsert"], "id" | "cachedAt">,
): Promise<T["$inferSelect"]> {
  const row = { ...values, id: CACHE_ROW_ID, cachedAt: new Date() };
  const [saved] = await db
    .insert(table)
    .values(row as PgInsertValue<T>)
    .onConflictDoUpdate({ target: table.id, set: row as PgUpdateSetSource<T> })
    .returning();
  return saved as T["$inferSelect"];
}

async function getCacheRow<T extends CacheTable>(
  table: T,
): Promise<T["$inferSelect"] | null> {
  const [row] = await db
    .select()
    .from(table as CacheTable)
    .where(eq(table.id, CACHE_ROW_ID));
  return (row as T["$inferSelect"] | undefined) ?? null;
}

function calculateStreak(
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[],
): number {
  const allDays = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => b.date.localeCompare(a.date));

  const today = new Date().toISOString().split("T")[0];

  let streak = 0;
  let expectedDate = new Date(today + "T12:00:00");

  const firstDay = allDays[0];
  if (firstDay && firstDay.date === today && firstDay.contributionCount === 0) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const day of allDays) {
    const expected = expectedDate.toISOString().split("T")[0];

    if (day.date > expected) continue;
    if (day.date < expected) break;

    if (day.contributionCount > 0) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function errorDetails(error: unknown) {
  return error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { error };
}

async function fetchGitHub(operation: string, query: string): Promise<unknown> {
  if (!env.GITHUB_TOKEN) {
    throw new AppError(
      503,
      "GITHUB_NOT_CONFIGURED",
      "GitHub integration is not configured",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    GITHUB_REQUEST_TIMEOUT_MS,
  );
  const startedAt = Date.now();

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    const durationMs = Date.now() - startedAt;

    if (!response.ok) {
      const responseBody = await response.text().catch(() => "");
      console.error(`[GitHub] ${operation} request failed`, {
        status: response.status,
        statusText: response.statusText,
        durationMs,
        responseBody: responseBody.slice(0, 300),
      });
      throw new AppError(
        502,
        "GITHUB_UNAVAILABLE",
        "Could not reach GitHub",
      );
    }

    const payload: unknown = await response.json();
    console.info(`[GitHub] ${operation} request succeeded`, {
      status: response.status,
      durationMs,
    });
    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;

    const durationMs = Date.now() - startedAt;
    if (controller.signal.aborted) {
      console.error(`[GitHub] ${operation} request timed out`, {
        timeoutMs: GITHUB_REQUEST_TIMEOUT_MS,
        durationMs,
      });
      throw new AppError(
        504,
        "GITHUB_TIMEOUT",
        "GitHub took too long to respond",
      );
    }

    console.error(`[GitHub] ${operation} request threw`, {
      durationMs,
      ...errorDetails(error),
    });
    throw new AppError(
      502,
      "GITHUB_UNAVAILABLE",
      "Could not reach GitHub",
    );
  } finally {
    clearTimeout(timeout);
  }
}

function parseGitHubData<T>(
  payload: unknown,
  schema: ZodType<T>,
  operation: string,
): T {
  try {
    return parseGitHubResponse(payload, schema, operation);
  } catch (error) {
    console.error(`[GitHub] ${operation} returned invalid data`, {
      ...errorDetails(error),
    });
    throw new AppError(
      502,
      "GITHUB_INVALID_RESPONSE",
      "GitHub returned an invalid response",
    );
  }
}

async function cacheGitHubContributions() {
  const payload = await fetchGitHub("contributions", CONTRIBUTIONS_QUERY);
  const data = parseGitHubData<ContributionsData>(
    payload,
    contributionsDataSchema,
    "contributions",
  );
  const calendar = data.user.contributionsCollection.contributionCalendar;
  const saved = await saveCacheRow(githubContributions, {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
  });

  console.log(
    `[GitHub] Contributions cache updated: ${calendar.totalContributions} contributions`,
  );

  return saved;
}

async function cacheGitHubStats() {
  const payload = await fetchGitHub("stats", STATS_QUERY);
  const data = parseGitHubData<StatsData>(payload, statsDataSchema, "stats");
  const user = data.user;

  const totalStars = user.repositories.nodes.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0,
  );

  const mergedPRs = user.pullRequests.totalCount;
  const closedIssues = user.issues.totalCount;

  const lastRepo = user.repositories.nodes[0];
  const lastCommitDate = lastRepo?.pushedAt ?? new Date().toISOString();
  const lastCommitRepo = lastRepo?.isPrivate ? "" : (lastRepo?.name ?? "");

  const langMap = new Map<string, { size: number; color: string }>();
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages.edges) {
      const name = edge.node.name;
      const existing = langMap.get(name);
      if (existing) {
        existing.size += edge.size;
      } else {
        langMap.set(name, {
          size: edge.size,
          color: edge.node.color ?? "#8b8b8b",
        });
      }
    }
  }

  const totalSize = Array.from(langMap.values()).reduce(
    (a, b) => a + b.size,
    0,
  );
  const languages =
    totalSize === 0
      ? []
      : Array.from(langMap.entries())
          .sort((a, b) => b[1].size - a[1].size)
          .slice(0, 8)
          .map(([name, { size, color }]) => ({
            name,
            percentage: Math.round((size / totalSize) * 1000) / 10,
            color,
          }));

  const repositories = user.repositories.nodes
    .filter((repo) => !repo.isPrivate)
    .map((repo) => ({
      name: repo.name,
      nameWithOwner: repo.nameWithOwner,
      url: repo.url,
      stargazerCount: repo.stargazerCount,
      downloads: repo.releases.nodes.reduce(
        (total, release) =>
          total +
          release.releaseAssets.nodes.reduce(
            (sum, asset) => sum + asset.downloadCount,
            0,
          ),
        0,
      ),
      createdAt: repo.createdAt,
    }));

  const calendarWeeks = user.contributionsCollection.contributionCalendar.weeks;
  const currentStreak = calculateStreak(calendarWeeks);

  const stats = {
    totalStars,
    mergedPRs,
    closedIssues,
    currentStreak,
    lastCommitDate,
    lastCommitRepo,
    languages,
    repositories,
  };

  const saved = await saveCacheRow(githubStats, stats);

  console.log(
    `[GitHub] Stats cache atualizado: ${totalStars} stars, ${mergedPRs} PRs, ${closedIssues} issues, ${currentStreak} streak`,
  );

  return saved;
}

function toPullRequestGroup(search: PullRequestsData["merged"]) {
  return {
    totalCount: search.issueCount,
    items: search.nodes.filter((pr) => pr !== null).map((pr) => ({
      title: pr.title,
      url: pr.url,
      repository: pr.repository.nameWithOwner,
      createdAt: pr.createdAt,
    })),
  };
}

async function cacheGitHubPullRequests() {
  const payload = await fetchGitHub("pull requests", PULL_REQUESTS_QUERY);
  const data = parseGitHubData<PullRequestsData>(
    payload,
    pullRequestsDataSchema,
    "pull requests",
  );
  const pullRequests = {
    merged: toPullRequestGroup(data.merged),
    open: toPullRequestGroup(data.open),
    closed: toPullRequestGroup(data.closed),
  };

  const saved = await saveCacheRow(githubPullRequests, pullRequests);

  console.log(
    `[GitHub] Pull requests cache updated: ${pullRequests.merged.totalCount} merged, ${pullRequests.open.totalCount} open, ${pullRequests.closed.totalCount} closed`,
  );

  return saved;
}

export const refreshGitHubContributions = dedupeRefresh(cacheGitHubContributions);
export const refreshGitHubStats = dedupeRefresh(cacheGitHubStats);
export const refreshGitHubPullRequests = dedupeRefresh(cacheGitHubPullRequests);

export function getCachedContributions() {
  return getCacheRow(githubContributions);
}

export function getCachedStats() {
  return getCacheRow(githubStats);
}

export function getCachedPullRequests() {
  return getCacheRow(githubPullRequests);
}
