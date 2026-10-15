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

export function Period({ start, end }: { start: string; end?: string }) {
  return end ? (
    <Range from={formatMonth(start)} to={formatMonth(end)} />
  ) : (
    <>desde {formatMonth(start)}</>
  );
}
