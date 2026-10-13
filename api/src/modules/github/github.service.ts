import { db } from "../../config/database";
import { env } from "../../config/env";
import { githubContributions, githubStats } from "./github.schema";
import { contributionsDataSchema, parseGitHubResponse, statsDataSchema, type ContributionsData, type StatsData } from "./github.validation";
import { AppError } from "../../shared/errors";
import { desc, eq } from "drizzle-orm";
import type { ZodType } from "zod";

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

function calculateStreak(
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[],
): number {
  const allDays = weeks
    .flatMap((w) => w.contributionDays)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  let streak = 0;
  let expectedDate = new Date(today + "T12:00:00");

  // If today has no contributions yet, start checking from yesterday
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

export async function refreshGitHubContributions() {
  const payload = await fetchGitHub("contributions", CONTRIBUTIONS_QUERY);
  const data = parseGitHubData<ContributionsData>(
    payload,
    contributionsDataSchema,
    "contributions",
  );
  const calendar = data.user.contributionsCollection.contributionCalendar;
  const values = {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
    cachedAt: new Date(),
  };

  const [latest] = await db
    .select({ id: githubContributions.id })
    .from(githubContributions)
    .orderBy(desc(githubContributions.id))
    .limit(1);

  if (latest) {
    await db
      .update(githubContributions)
      .set(values)
      .where(eq(githubContributions.id, latest.id));
  } else {
    await db.insert(githubContributions).values(values);
  }

  console.log(
    `[GitHub] Contributions cache updated: ${calendar.totalContributions} contributions`,
  );

  return calendar;
}

export async function refreshGitHubStats() {
  const payload = await fetchGitHub("stats", STATS_QUERY);
  const data = parseGitHubData<StatsData>(payload, statsDataSchema, "stats");
  const user = data.user;

  // Total stars
  const totalStars = user.repositories.nodes.reduce(
    (acc, repo) => acc + repo.stargazerCount,
    0,
  );

  // PRs & Issues
  const mergedPRs = user.pullRequests.totalCount;
  const closedIssues = user.issues.totalCount;

  // Last commit (most recently pushed repo)
  const lastRepo = user.repositories.nodes[0];
  const lastCommitDate = lastRepo?.pushedAt ?? new Date().toISOString();
  const lastCommitRepo = lastRepo?.isPrivate ? "" : (lastRepo?.name ?? "");

  // Languages aggregated by size
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
      createdAt: repo.createdAt,
    }));

  // Streak
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

  const [latest] = await db
    .select({ id: githubStats.id })
    .from(githubStats)
    .orderBy(desc(githubStats.id))
    .limit(1);

  if (latest) {
    await db
      .update(githubStats)
      .set({ ...stats, cachedAt: new Date() })
      .where(eq(githubStats.id, latest.id));
  } else {
    await db.insert(githubStats).values(stats);
  }

  console.log(
    `[GitHub] Stats cache atualizado: ${totalStars} stars, ${mergedPRs} PRs, ${closedIssues} issues, ${currentStreak} streak`,
  );

  return stats;
}

export async function getCachedContributions() {
  const [latest] = await db
    .select()
    .from(githubContributions)
    .orderBy(desc(githubContributions.id))
    .limit(1);

  return latest ?? null;
}

export async function getCachedStats() {
  const [latest] = await db
    .select()
    .from(githubStats)
    .orderBy(desc(githubStats.id))
    .limit(1);

  return latest ?? null;
}
