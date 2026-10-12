import { useEffect, useState } from "react";
import config from "@/data/config";
import { getMockGitHubCalendar } from "@/data/mockGitHubCalendar";
import { createRequestCache } from "@/lib/requestCache";

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

const calendarCache = createRequestCache<GitHubCalendarData>();

function loadGitHubCalendar() {
  return calendarCache.load(async () => {
    if (config.isDev) return getMockGitHubCalendar();

    const res = await fetch(`${config.API_URL}/github/contributions`);
    if (!res.ok) throw new Error("Falha ao buscar dados do GitHub");
    return (await res.json()) as GitHubCalendarData;
  });
}

export function useGitHubCalendar() {
  const [data, setData] = useState<GitHubCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGitHubCalendar()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Falha ao buscar dados do GitHub");
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
