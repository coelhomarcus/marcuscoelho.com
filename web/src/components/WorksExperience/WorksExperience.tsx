import { useState } from "react";
import { RxChevronRight as ChevronRightIcon } from "react-icons/rx";
import { arrWorks } from "@/data/works";
import type { Work } from "@/types";
import { Badge } from "@/components/ui/badge";
import WorkModal from "./WorkModal";
import { formatDuration, formatYears, getWorkRange } from "./format";

function WorksExperience() {
  const [selected, setSelected] = useState<number | null>(null);
  const total = arrWorks.length;

  const step = (delta: number) =>
    setSelected((i) => (i === null ? i : (i + delta + total) % total));

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-300">Experiência</h2>

      <ul className="flex flex-col gap-2">
        {arrWorks.map((work, index) => (
          <li key={work.company}>
            <WorkRow work={work} onSelect={() => setSelected(index)} />
          </li>
        ))}
      </ul>

      <WorkModal
        work={selected === null ? null : arrWorks[selected]}
        index={selected ?? 0}
        total={total}
        prevName={arrWorks[((selected ?? 0) - 1 + total) % total].company}
        nextName={arrWorks[((selected ?? 0) + 1) % total].company}
        onClose={() => setSelected(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </div>
  );
}

function WorkRow({ work, onSelect }: { work: Work; onSelect: () => void }) {
  const { start, end, isCurrent } = getWorkRange(work);
  const latest = work.positions[work.positions.length - 1];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      className="group card-surface flex w-full cursor-pointer items-center gap-3 p-3 text-left hover:bg-zinc-900 hover:ring-foreground/20"
    >
      <img
        src={work.logo}
        alt=""
        className="size-10 shrink-0 rounded-sm object-cover"
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

      <div className="flex shrink-0 flex-col items-end gap-1">
        {isCurrent ? (
          <Badge variant="success">
            <span className="size-1.5 rounded-full bg-green-400" aria-hidden />
            Atual
          </Badge>
        ) : (
          <Badge variant="outline" className="tabular-nums">
            {formatYears(start, end!)}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDuration(start, end)}
        </span>
      </div>

      <ChevronRightIcon
        className="size-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
        aria-hidden
      />
    </button>
  );
}

export default WorksExperience;
