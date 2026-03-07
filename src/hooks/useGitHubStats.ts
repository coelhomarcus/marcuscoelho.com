import { useEffect, useState } from "react";
import config from "@/data/config";

export interface Language {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubStatsData {
  totalStars: number;
  mergedPRs: number;
  closedIssues: number;
  lastCommitDate: string;
  lastCommitRepo: string;
  languages: Language[];
  cachedAt: string;
}

export function useGitHubStats() {
  const [data, setData] = useState<GitHubStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch(`${config.API_URL}/github/stats`);
        if (!res.ok) throw new Error("Falha ao buscar stats do GitHub");
        const json = (await res.json()) as GitHubStatsData;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
