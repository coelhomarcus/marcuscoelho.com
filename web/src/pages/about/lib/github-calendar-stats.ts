import type { ContributionWeek } from "../hooks/use-github-calendar";

export type CalendarBestDay = {
  count: number;
  date: string;
};

export type CalendarStats = {
  total: number;
  currentStreak: number;
  longestStreak: number;
  busiestWeekday: string | null;
  bestDay: CalendarBestDay | null;
};

function todayUtc(): string {
  return new Date().toISOString().split("T")[0];
}

function addUtcDays(date: string, amount: number) {
  const next = new Date(`${date}T12:00:00.000Z`);
  next.setUTCDate(next.getUTCDate() + amount);
  return next.toISOString().split("T")[0];
}

function weekdayLong(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00.000Z`));
}

export function formatBestDayDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00.000Z`));
}

export function formatDayCount(count: number) {
  return `${count} ${count === 1 ? "dia" : "dias"}`;
}

export function computeCalendarStats(
  weeks: ContributionWeek[],
  total: number,
  today = todayUtc(),
): CalendarStats {
  const days = weeks
    .flatMap((week) => week.contributionDays)
    .filter((day) => day.date <= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let run = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      run += 1;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }

  const descending = days.slice().reverse();
  let expected = today;
  if (
    descending[0]?.date === today &&
    descending[0].contributionCount === 0
  ) {
    expected = addUtcDays(today, -1);
  }

  let currentStreak = 0;
  for (const day of descending) {
    if (day.date > expected) continue;
    if (day.date < expected) break;
    if (day.contributionCount === 0) break;
    currentStreak += 1;
    expected = addUtcDays(expected, -1);
  }

  const weekdayTotals = new Map<number, { date: string; total: number }>();
  let bestDay: CalendarBestDay | null = null;

  for (const day of days) {
    if (day.contributionCount <= 0) continue;

    const weekday = new Date(`${day.date}T12:00:00.000Z`).getUTCDay();
    const bucket = weekdayTotals.get(weekday);
    if (bucket) bucket.total += day.contributionCount;
    else weekdayTotals.set(weekday, { date: day.date, total: day.contributionCount });

    if (!bestDay || day.contributionCount >= bestDay.count) {
      bestDay = { count: day.contributionCount, date: day.date };
    }
  }

  const busiest = [...weekdayTotals.values()].sort((a, b) => b.total - a.total)[0];

  return {
    total,
    currentStreak,
    longestStreak,
    busiestWeekday: busiest ? weekdayLong(busiest.date) : null,
    bestDay,
  };
}
