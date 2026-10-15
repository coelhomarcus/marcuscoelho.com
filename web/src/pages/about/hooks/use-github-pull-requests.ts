import { useEffect, useState } from "react";
import config from "@/data/config";
import { createRequestCache } from "@/lib/request-cache";

export type PullRequestState = "merged" | "open" | "closed";

export interface PullRequest {
  title: string;
  url: string;
  /** "owner/name" */
  repository: string;
  createdAt: string;
}

export interface PullRequestGroup {
  totalCount: number;
  /** The most recent ones, newest first */
  items: PullRequest[];
}

export type GitHubPullRequestsData = Record<PullRequestState, PullRequestGroup> & {
  cachedAt: string;
};

/** True when there is at least one pull request to show in any state. */
export function hasPullRequests(data: GitHubPullRequestsData | null) {
  return (
    !!data &&
    (["merged", "open", "closed"] as const).some(
      (state) => data[state].items.length > 0,
    )
  );
}

const pullRequestsCache = createRequestCache<GitHubPullRequestsData>();

function loadGitHubPullRequests() {
  return pullRequestsCache.load(async () => {
    const res = await fetch(`${config.API_URL}/github/pull-requests`);
    if (!res.ok) throw new Error("Falha ao buscar pull requests do GitHub");
    return (await res.json()) as GitHubPullRequestsData;
  });
}

export function useGitHubPullRequests() {
  const [data, setData] = useState<GitHubPullRequestsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGitHubPullRequests()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao buscar pull requests do GitHub");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
