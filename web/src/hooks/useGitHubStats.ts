import { useEffect, useState } from "react";
import config from "@/data/config";
import { createRequestCache } from "@/lib/requestCache";

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
  const [data, setData] = useState<GitHubStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGitHubStats()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao buscar stats do GitHub");
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
