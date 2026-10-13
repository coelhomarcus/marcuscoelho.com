import { ArrowRightIcon } from "lucide-react";
import { formatMonth } from "./format";

function Range({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {from}
      <ArrowRightIcon className="size-3 shrink-0 opacity-60" aria-hidden />
      {to}
    </span>
  );
}

/** "set 2025 → out 2026" with an icon arrow, or "desde out 2026" while ongoing. */
export function Period({ start, end }: { start: string; end?: string }) {
  return end ? (
    <Range from={formatMonth(start)} to={formatMonth(end)} />
  ) : (
    <>desde {formatMonth(start)}</>
  );
}

/** "2025 → 2026", or just "2025" when both ends fall in the same year. */
export function Years({ start, end }: { start: string; end: string }) {
  const from = start.slice(0, 4);
  const to = end.slice(0, 4);
  return from === to ? <>{from}</> : <Range from={from} to={to} />;
}
