import { useState } from "react";
import { arrWorks } from "@/data/works";
import type { Work } from "@/types";
import WorkModal from "./WorkModal";
import { formatDuration, formatMonth, getWorkRange } from "./format";

function WorksExperience() {
  const [selected, setSelected] = useState<Work | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-300">Experiência</h2>

      <ul className="flex flex-col gap-0.5">
        {arrWorks.map((work) => (
          <li key={work.company}>
            <WorkRow work={work} onSelect={setSelected} />
          </li>
        ))}
      </ul>

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function WorkRow({
  work,
  onSelect,
}: {
  work: Work;
  onSelect: (work: Work) => void;
}) {
  const { start, end, isCurrent } = getWorkRange(work);
  const latest = work.positions[work.positions.length - 1];

  return (
    <button
      type="button"
      onClick={() => onSelect(work)}
      aria-haspopup="dialog"
      className="-mx-3 flex w-[calc(100%+1.5rem)] cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-zinc-900"
    >
      <img
        src={work.logo}
        alt=""
        className="size-8 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-zinc-100 text-balance">
          {work.company}
        </p>
        <p className="text-xs text-muted-foreground">
          {latest.title}
          {latest.employmentType && ` · ${latest.employmentType}`}
        </p>
      </div>

      <div className="shrink-0 text-right text-xs text-muted-foreground tabular-nums">
        <p>
          {isCurrent && (
            <span
              className="mr-1.5 inline-block size-1.5 rounded-full bg-green-400 align-middle"
              aria-hidden
            />
          )}
          {formatMonth(start)} — {isCurrent ? "Atual" : formatMonth(end!)}
        </p>
        <p>{formatDuration(start, end)}</p>
      </div>
    </button>
  );
}

export default WorksExperience;
