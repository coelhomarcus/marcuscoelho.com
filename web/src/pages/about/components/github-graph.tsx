import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
  type Ref,
} from "react";
import { SectionAction, SectionHeading } from "@/components/section-heading";
import {
  useGitHubCalendar,
  type ContributionLevel,
} from "../hooks/use-github-calendar";
import {
  computeCalendarStats,
  formatBestDayDate,
  formatDayCount,
} from "../lib/github-calendar-stats";
import { Tooltip } from "@/components/ui/tooltip";
import config from "@/data/config";

const GAP = 3;
const MIN_CELL = 10;
const WEEKS_TOTAL = 53;
const STATS_GRID_CLASS =
  "mt-3 grid grid-cols-2 gap-x-4 gap-y-3 @sm:grid-cols-3 @xl:grid-cols-5";

const COLORS: Record<ContributionLevel, string> = {
  NONE: "var(--color-zinc-900)",
  FIRST_QUARTILE: "var(--color-zinc-700)",
  SECOND_QUARTILE: "var(--color-zinc-500)",
  THIRD_QUARTILE: "var(--color-zinc-300)",
  FOURTH_QUARTILE: "var(--color-zinc-100)",
};

const SKELETON_STATS = [
  { label: "12 meses", value: "0.000" },
  { label: "Maior streak", value: "00 dias" },
  { label: "Streak atual", value: "00 dias" },
  { label: "Mais ativo", value: "quarta-feira" },
  { label: "Melhor dia", value: "000 contribuições", hint: "sáb., 00 de out." },
] as const;

function calendarPad(cellSize: number) {
  return cellSize * 0.4;
}

function CalendarFrame({
  cellSize,
  children,
  scrollRef,
  pulse,
}: {
  cellSize: number;
  children: ReactNode;
  scrollRef?: Ref<HTMLDivElement>;
  pulse?: boolean;
}) {
  const pad = calendarPad(cellSize);

  return (
    <div
      className={`flex flex-col select-none${pulse ? " animate-pulse" : ""}`}
      style={{ gap: GAP }}
    >
      <div
        ref={scrollRef}
        className="github-calendar-scroll"
        style={{
          overflowX: pulse ? "hidden" : "auto",
          overflowY: "hidden",
          padding: pad,
          margin: -pad,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CalendarSkeleton({
  cellSize,
  colors,
}: {
  cellSize: number;
  colors: Record<ContributionLevel, string>;
}) {
  const skeletonGridWidth = WEEKS_TOTAL * (cellSize + GAP) - GAP;

  return (
    <div aria-busy="true" aria-label="Carregando contribuições do GitHub">
      <CalendarFrame cellSize={cellSize} pulse>
        <div style={{ display: "flex", gap: GAP, width: skeletonGridWidth }}>
          {Array.from({ length: WEEKS_TOTAL }, (_, wi) => (
            <div
              key={wi}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: GAP,
                flexShrink: 0,
              }}
            >
              {Array.from({ length: 7 }, (_, di) => (
                <div
                  key={di}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: Math.max(2, cellSize * 0.15),
                    backgroundColor: colors.NONE,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </CalendarFrame>

      <dl className={STATS_GRID_CLASS}>
        {SKELETON_STATS.map((stat) => (
          <Stat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            hint={"hint" in stat ? stat.hint : undefined}
            skeleton
          />
        ))}
      </dl>
    </div>
  );
}

function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(12);
  const { data, isLoading, error } = useGitHubCalendar();

  const colors = COLORS;

  const weeksCount = data ? data.weeks.length : WEEKS_TOTAL;

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const ideal = (width - (weeksCount - 1) * GAP) / weeksCount;
      setCellSize(Math.max(MIN_CELL, ideal));
      requestAnimationFrame(scrollToEnd);
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [scrollToEnd, weeksCount]);

  useEffect(() => {
    if (data) requestAnimationFrame(scrollToEnd);
  }, [data, scrollToEnd]);

  const gridWidth = data ? data.weeks.length * (cellSize + GAP) - GAP : 0;
  const stats = useMemo(
    () =>
      data
        ? computeCalendarStats(data.weeks, data.totalContributions)
        : null,
    [data],
  );

  return (
    <div className="flex flex-col gap-4">
      <SectionHeading
        title="GitHub"
        action={
          <SectionAction href={`https://github.com/${config.GITHUB_USERNAME}`}>
            @{config.GITHUB_USERNAME}
          </SectionAction>
        }
      />

      <div ref={containerRef}>
        {isLoading && <CalendarSkeleton cellSize={cellSize} colors={colors} />}

        {error && !isLoading && (
          <CalendarSkeleton cellSize={cellSize} colors={colors} />
        )}

        {data && !isLoading && (
          <CalendarFrame cellSize={cellSize} scrollRef={scrollRef}>
            <div
              style={{
                display: "flex",
                gap: GAP,
                width: gridWidth,
              }}
            >
              {data.weeks.map((week, wi) => (
                <div
                  key={wi}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: GAP,
                    flexShrink: 0,
                  }}
                >
                  {week.contributionDays.map((day, di) => {
                    const cell = (
                      <div
                        key={di}
                        className="gh-cell"
                        style={{
                          width: cellSize,
                          height: cellSize,
                          borderRadius: Math.max(2, cellSize * 0.15),
                          backgroundColor: colors[day.contributionLevel],
                          flexShrink: 0,
                        }}
                      />
                    );

                    if (day.contributionCount === 0) return cell;

                    return (
                      <Tooltip
                        key={di}
                        content={`${day.contributionCount} contribuição${day.contributionCount !== 1 ? "s" : ""} em ${new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}`}
                      >
                        {cell}
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </CalendarFrame>
        )}

        {stats && !isLoading && (
          <dl className={STATS_GRID_CLASS}>
            <Stat label="12 meses" value={stats.total.toLocaleString("pt-BR")} />
            <Stat label="Maior streak" value={formatDayCount(stats.longestStreak)} />
            <Stat label="Streak atual" value={formatDayCount(stats.currentStreak)} />
            <Stat
              label="Mais ativo"
              value={stats.busiestWeekday ?? "—"}
            />
            <Stat
              label="Melhor dia"
              value={
                stats.bestDay
                  ? `${stats.bestDay.count.toLocaleString("pt-BR")} ${stats.bestDay.count === 1 ? "contribuição" : "contribuições"}`
                  : "—"
              }
              hint={
                stats.bestDay ? formatBestDayDate(stats.bestDay.date) : undefined
              }
            />
          </dl>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  skeleton,
}: {
  label: string;
  value: string;
  hint?: string;
  skeleton?: boolean;
}) {
  return (
    <div>
      <dt className="text-[11px] text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-200">
        {skeleton ? <PulseText>{value}</PulseText> : value}
      </dd>
      {hint && (
        <p className="text-[11px] text-zinc-500">
          {skeleton ? <PulseText>{hint}</PulseText> : hint}
        </p>
      )}
    </div>
  );
}

function PulseText({ children }: { children: string }) {
  return (
    <span className="inline-block animate-pulse rounded bg-zinc-900 text-transparent">
      {children}
    </span>
  );
}

export default GitHubGraph;
