import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { RxChevronDown, RxStar } from "react-icons/rx";
import {
  useGitHubCalendar,
  type ContributionDay,
} from "@/hooks/useGitHubCalendar";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { formatCompactNumber } from "@/lib/utils";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const MAX_MONTHS = 12;
const MAX_REPOSITORIES = 5;
const MONTH_NAMES = [
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

type ActivityDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type Repository = {
  name: string;
  url: string;
  stars: number;
};

const COLORS = ["transparent", "#0e4429", "#006d32", "#26a641", "#39d353"];

function toLevel(day: ContributionDay): ActivityDay["level"] {
  switch (day.contributionLevel) {
    case "FIRST_QUARTILE":
      return 1;
    case "SECOND_QUARTILE":
      return 2;
    case "THIRD_QUARTILE":
      return 3;
    case "FOURTH_QUARTILE":
      return 4;
    default:
      return 0;
  }
}

function monthLabels(weeks: ActivityDay[][]) {
  const labels: (string | null)[] = weeks.map(() => null);
  let start = 0;

  for (let index = 1; index <= weeks.length; index += 1) {
    const currentMonth = weeks[index]?.[0]?.date.slice(5, 7);
    const startMonth = weeks[start]?.[0]?.date.slice(5, 7);
    if (index < weeks.length && currentMonth === startMonth) continue;

    if (index - start >= 3 && startMonth) {
      labels[start] = MONTH_NAMES[Number(startMonth) - 1] ?? null;
    }
    start = index;
  }

  return labels;
}

function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-[3px] overflow-hidden animate-pulse">
      {Array.from({ length: 26 * 7 }, (_, index) => (
        <div
          key={index}
          className="aspect-square rounded-[3px] bg-zinc-700/50"
        />
      ))}
    </div>
  );
}

function ActivityTooltip({
  day,
  reduceMotion,
}: {
  day: { value: ActivityDay; x: number; y: number };
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(day.x);
  const date = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${day.value.date}T12:00:00`));
  const contributions = `${day.value.count} contribuição${day.value.count === 1 ? "" : "ões"}`;

  useLayoutEffect(() => {
    const half = (ref.current?.offsetWidth ?? 0) / 2;
    const edge = 8 + half;
    setLeft(Math.min(Math.max(day.x, edge), window.innerWidth - edge));
  }, [day]);

  return createPortal(
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left,
        top: day.y,
        transform: "translate(-50%, calc(-100% - 8px))",
      }}
    >
      <motion.div
        ref={ref}
        className="whitespace-nowrap rounded-[6px] border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-200 shadow-lg"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        transition={{ duration: reduceMotion ? 0 : 0.14, ease: "easeOut" }}
      >
        {contributions} em {date}
      </motion.div>
    </div>,
    document.body,
  );
}

function ActivityGrid({ weeks }: { weeks: ActivityDay[][] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [hovered, setHovered] = useState<{
    value: ActivityDay;
    x: number;
    y: number;
  }>();
  const reduceMotion = useReducedMotion() ?? false;
  const maxColumns = Math.ceil((MAX_MONTHS * 365.25) / 12 / 7);
  const visibleWeeks = weeks.slice(-Math.min(columns, maxColumns));

  useLayoutEffect(() => {
    const element = gridRef.current;
    if (!element) return;

    const measure = () =>
      setColumns(
        Math.max(
          1,
          Math.floor(
            (element.clientWidth + CELL_GAP) / (CELL_SIZE + CELL_GAP),
          ),
        ),
      );
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={gridRef} className="relative">
      <div
        className="mb-1 flex justify-center overflow-hidden"
        style={{ gap: CELL_GAP }}
      >
        {monthLabels(visibleWeeks).map((month, index) => (
          <div
            key={index}
            className="relative h-3 shrink-0"
            style={{ width: CELL_SIZE }}
          >
            {month && (
              <span className="absolute left-0 top-0 text-[10px] leading-none text-zinc-500">
                {month}
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        className="flex justify-center overflow-hidden"
        style={{ gap: CELL_GAP }}
        onPointerLeave={() => setHovered(undefined)}
      >
        {visibleWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex shrink-0 flex-col" style={{ gap: CELL_GAP }}>
            {week.map((day) => (
              <motion.div
                key={day.date}
                className="shrink-0 rounded-[3px] bg-zinc-700/40"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                onPointerEnter={(event) => {
                  const cell = event.currentTarget.getBoundingClientRect();
                  setHovered({
                    value: day,
                    x: cell.left + cell.width / 2,
                    y: cell.top,
                  });
                }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  delay: reduceMotion ? 0 : weekIndex * 0.012,
                }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={{
                    backgroundColor: COLORS[day.level],
                  }}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered && (
          <ActivityTooltip key="tooltip" day={hovered} reduceMotion={reduceMotion} />
        )}
      </AnimatePresence>
    </div>
  );
}

function RepositoryAvatar({ name }: { name: string }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-800 text-[11px] font-medium uppercase text-zinc-300 ring-2 ring-zinc-950">
      {name.charAt(0)}
    </span>
  );
}

function GitHubActivity() {
  const { data: calendarData, isLoading: calendarLoading } = useGitHubCalendar();
  const { data: statsData } = useGitHubStats();
  const [open, setOpen] = useState(false);
  const uid = useId();
  const reduceMotion = useReducedMotion() ?? false;

  const weeks = useMemo(
    () =>
      calendarData?.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: toLevel(day),
        })),
      ) ?? [],
    [calendarData],
  );
  const repositories = useMemo<Repository[]>(
    () =>
      (statsData?.repositories ?? [])
        .filter((repo) => repo.stargazerCount > 0)
        .sort((a, b) => b.stargazerCount - a.stargazerCount)
        .slice(0, MAX_REPOSITORIES)
        .map((repo) => ({
          name: repo.name,
          url: repo.url,
          stars: repo.stargazerCount,
        })),
    [statsData?.repositories],
  );
  const total = calendarData?.totalContributions ?? 0;
  const year = weeks.at(-1)?.at(-1)?.date.slice(0, 4);
  const panelId = `${uid}-repositories`;
  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, bounce: 0.2, duration: 0.62 };

  return (
    <div
      data-slot="github-activity"
      className={`relative max-w-full overflow-hidden rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 p-4 ${repositories.length > 0 ? "pb-[76px]" : ""}`}
    >
      <p className="mb-4 px-1.5 text-base font-medium text-zinc-200">
        {calendarLoading
          ? "Carregando contribuições..."
          : `${total} contribuições${year ? ` em ${year}` : ""}`}
      </p>

      {calendarLoading || !weeks.length ? (
        <ActivitySkeleton />
      ) : (
        <ActivityGrid weeks={weeks} />
      )}

      {repositories.length > 0 && (
        <motion.div
          layout
          id={panelId}
          data-state={open ? "open" : "closed"}
          className={`absolute inset-x-3 bottom-3 overflow-hidden border border-zinc-700/70 bg-zinc-950/90 backdrop-blur-xl ${open ? "top-3" : ""}`}
          style={{ borderRadius: 8 }}
          transition={transition}
        >
          <motion.div
            layout="position"
            className="flex items-center justify-between gap-3 px-4 py-3"
            transition={transition}
          >
            <span className="truncate text-sm text-zinc-300">
              Repositórios mais estrelados
            </span>
            <div className="flex items-center gap-3">
              {!open && (
                <div className="flex items-center">
                  {repositories.slice(0, 3).map((repo) => (
                    <RepositoryAvatar key={repo.url} name={repo.name} />
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={panelId}
                aria-label={open ? "Ocultar repositórios" : "Mostrar repositórios"}
                className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={transition}
                  className="grid place-items-center"
                >
                  <RxChevronDown className="size-5" aria-hidden="true" />
                </motion.span>
              </button>
            </div>
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {open && (
              <motion.ul
                key="list"
                initial={reduceMotion ? false : { opacity: 0, x: 16, y: 16 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 16, y: 16 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.38, ease: "easeOut" }}
                className="px-0.5 pb-1"
              >
                {repositories.map((repo) => (
                  <li key={repo.url}>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mx-2 flex items-center gap-3 rounded-[6px] px-2 py-2 text-zinc-200 transition-colors hover:bg-zinc-800/70"
                    >
                      <RepositoryAvatar name={repo.name} />
                      <span className="flex-1 truncate text-sm">{repo.name}</span>
                      <span className="inline-flex items-center gap-1 text-sm tabular-nums text-zinc-400">
                        <RxStar className="size-3.5" aria-hidden="true" />
                        {formatCompactNumber(repo.stars)}
                      </span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default GitHubActivity;
