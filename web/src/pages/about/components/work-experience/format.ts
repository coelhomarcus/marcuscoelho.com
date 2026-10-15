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

export function formatDuration(start: string, end?: string) {
  const from = parseDate(start);
  const now = new Date();
  const to = end
    ? parseDate(end)
    : { year: now.getFullYear(), month: now.getMonth() + 1 };

  const months =
    (to.year - from.year) * 12 + ((to.month ?? 12) - (from.month ?? 1)) + 1;
  if (months < 1) return "";

  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [
    years && `${years} ${years === 1 ? "ano" : "anos"}`,
    rest && `${rest} ${rest === 1 ? "mês" : "meses"}`,
  ]
    .filter(Boolean)
    .join(" e ");
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
