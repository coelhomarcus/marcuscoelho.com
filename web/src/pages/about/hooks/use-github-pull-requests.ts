import { apiPath } from "@/lib/api";
import { createRequestCache } from "@/lib/request-cache";
import { useCachedRequest } from "@/hooks/use-cached-request";

export type PullRequestState = "merged" | "open" | "closed";

export interface PullRequest {
  title: string;
  url: string;
  repository: string;
  createdAt: string;
}

export interface PullRequestGroup {
  totalCount: number;
  items: PullRequest[];
}

export type GitHubPullRequestsData = Record<PullRequestState, PullRequestGroup> & {
  cachedAt: string;
};

const pullRequestsCache = createRequestCache<GitHubPullRequestsData>();

function loadGitHubPullRequests() {
  return pullRequestsCache.load(async () => {
    const res = await fetch(apiPath("/github/pull-requests"));
    if (!res.ok) throw new Error("Falha ao buscar pull requests do GitHub");
    return (await res.json()) as GitHubPullRequestsData;
  });
}

export function useGitHubPullRequests() {
  return useCachedRequest(loadGitHubPullRequests);
}
