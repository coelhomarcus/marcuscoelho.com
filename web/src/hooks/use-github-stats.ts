import config from "@/data/config";
import { createRequestCache } from "@/lib/request-cache";
import { useCachedRequest } from "@/hooks/use-cached-request";

export interface Language {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubRepository {
  name: string;
  nameWithOwner: string;
  url: string;
  stargazerCount: number;
  createdAt: string;
}

export interface GitHubStatsData {
  totalStars: number;
  mergedPRs: number;
  closedIssues: number;
  lastCommitDate: string;
  lastCommitRepo: string;
  languages: Language[];
  repositories?: GitHubRepository[];
  cachedAt: string;
}

const statsCache = createRequestCache<GitHubStatsData>();

function loadGitHubStats() {
  return statsCache.load(async () => {
    const res = await fetch(`${config.API_URL}/github/stats`);
    if (!res.ok) throw new Error("Falha ao buscar stats do GitHub");
    return (await res.json()) as GitHubStatsData;
  });
}

export function useGitHubStats() {
  return useCachedRequest(loadGitHubStats);
}
