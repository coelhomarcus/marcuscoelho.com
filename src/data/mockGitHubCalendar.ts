import type {
  ContributionLevel,
  GitHubCalendarData,
} from "@/hooks/useGitHubCalendar";

const WEEKS = 53;

function levelFor(count: number): ContributionLevel {
  if (count === 0) return "NONE";
  if (count < 3) return "FIRST_QUARTILE";
  if (count < 6) return "SECOND_QUARTILE";
  if (count < 10) return "THIRD_QUARTILE";
  return "FOURTH_QUARTILE";
}

// Gera um calendário fake (53 semanas até hoje) para usar em ambiente DEV
export function getMockGitHubCalendar(): GitHubCalendarData {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - ((WEEKS - 1) * 7 + today.getDay()));

  const weeks: GitHubCalendarData["weeks"] = [];
  let total = 0;

  for (let w = 0; w < WEEKS; w++) {
    const contributionDays = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) break;

      const weekendPenalty = d === 0 || d === 6 ? 0.4 : 1;
      const count = Math.floor(Math.random() * 13 * weekendPenalty);

      total += count;
      contributionDays.push({
        date: date.toISOString().slice(0, 10),
        contributionCount: count,
        contributionLevel: levelFor(count),
      });
    }
    weeks.push({ contributionDays });
  }

  return {
    totalContributions: total,
    weeks,
    cachedAt: new Date().toISOString(),
  };
}
