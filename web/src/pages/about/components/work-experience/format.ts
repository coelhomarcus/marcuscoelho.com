import type { Work } from "@/types";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function parseDate(date: string) {
  const [year, month] = date.split("-");
  return { year: Number(year), month: month ? Number(month) : undefined };
}

export function formatMonth(date: string) {
  const { year, month } = parseDate(date);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

export function getWorkRange(work: Work) {
  const first = work.positions[0];
  const last = work.positions[work.positions.length - 1];
  const isCurrent = work.positions.some((position) => !position.period.end);

  return {
    start: first.period.start,
    end: isCurrent ? undefined : last.period.end,
    isCurrent,
  };
}
