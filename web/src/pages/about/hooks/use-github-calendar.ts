import { apiPath } from "@/lib/api";
import { createRequestCache } from "@/lib/request-cache";
import { useCachedRequest } from "@/hooks/use-cached-request";

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
    const res = await fetch(apiPath("/github/contributions"));
    if (!res.ok) throw new Error("Falha ao buscar dados do GitHub");
    return (await res.json()) as GitHubCalendarData;
  });
}

export function useGitHubCalendar() {
  return useCachedRequest(loadGitHubCalendar);
}
