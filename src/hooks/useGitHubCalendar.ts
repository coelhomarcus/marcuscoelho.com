import { useEffect, useState } from "react";
import config from "@/data/config";

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubCalendarData {
  totalContributions: number;
  weeks: ContributionWeek[];
  cachedAt: string;
}

export function useGitHubCalendar() {
  const [data, setData] = useState<GitHubCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchContributions() {
      try {
        const res = await fetch(`${config.API_URL}/github/contributions`);
        if (!res.ok) throw new Error("Falha ao buscar dados do GitHub");
        const json = (await res.json()) as GitHubCalendarData;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchContributions();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
