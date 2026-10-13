import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { experience } from "@/data/experience";
import type { Work } from "@/types";
import { Badge } from "@/components/ui/badge";
import WorkModal from "./work-modal";
import { Years } from "./period";
import { formatDuration, getWorkRange } from "./format";

function WorkExperience() {
  const [selected, setSelected] = useState<number | null>(null);
  const total = experience.length;

  const step = (delta: number) =>
    setSelected((i) => (i === null ? i : (i + delta + total) % total));

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-300">Experiência</h2>

      <ul className="flex flex-col gap-2">
        {experience.map((work, index) => (
          <li key={work.company}>
            <WorkRow work={work} onSelect={() => setSelected(index)} />
          </li>
        ))}
      </ul>

      <WorkModal
        work={selected === null ? null : experience[selected]}
        index={selected ?? 0}
        total={total}
        onClose={() => setSelected(null)}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
      />
    </div>
  );
}

function WorkRow({ work, onSelect }: { work: Work; onSelect: () => void }) {
  const chevron = useAnimatedIcon();
  const { start, end, isCurrent } = getWorkRange(work);
  const latest = work.positions[work.positions.length - 1];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-haspopup="dialog"
      {...chevron.hoverProps}
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
            <Years start={start} end={end!} />
          </Badge>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatDuration(start, end)}
        </span>
      </div>

      <ChevronRightIcon
        ref={chevron.ref}
        size={16}
        className="shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400"
      />
    </button>
  );
}

export default WorkExperience;
