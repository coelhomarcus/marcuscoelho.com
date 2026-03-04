import { useRef, useState, useEffect, useCallback } from "react";
import { GithubIcon } from "@/lib/icons";
import { useTheme } from "next-themes";
import {
  useGitHubCalendar,
  type ContributionLevel,
  type ContributionWeek,
} from "@/hooks/useGitHubCalendar";

const GAP = 3;
const MONTH_LABEL_HEIGHT = 16;
const MIN_CELL = 10;
const MAX_CELL = 14;
const WEEKS_TOTAL = 53;

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const COLORS: Record<"light" | "dark", Record<ContributionLevel, string>> = {
  light: {
    NONE: "#ebedf0",
    FIRST_QUARTILE: "#9be9a8",
    SECOND_QUARTILE: "#40c463",
    THIRD_QUARTILE: "#30a14e",
    FOURTH_QUARTILE: "#216e39",
  },
  dark: {
    NONE: "#181818",
    FIRST_QUARTILE: "#0e4429",
    SECOND_QUARTILE: "#006d32",
    THIRD_QUARTILE: "#26a641",
    FOURTH_QUARTILE: "#39d353",
  },
};

function getMonthLabels(weeks: ContributionWeek[], cellSize: number) {
  const labels: { month: string; left: number }[] = [];
  let prevMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const firstDay = week.contributionDays[0];
    if (!firstDay) return;
    const month = new Date(firstDay.date + "T12:00:00").getMonth();
    if (month !== prevMonth) {
      labels.push({
        month: MONTHS[month],
        left: weekIdx * (cellSize + GAP),
      });
      prevMonth = month;
    }
  });
  return labels;
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
    <div
      className="flex flex-col select-none animate-pulse"
      style={{ gap: GAP }}
    >
      {/* Grid skeleton */}
      <div
        className="github-calendar-scroll"
        style={{ flex: 1, overflowX: "hidden", overflowY: "hidden" }}
      >
        <div style={{ height: MONTH_LABEL_HEIGHT }} />
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
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between mt-1 gap-1">
        <div className="h-3 w-40 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

function GitHubGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(12);
  const { resolvedTheme } = useTheme();
  const { data, isLoading, error } = useGitHubCalendar();

  const theme = (resolvedTheme === "dark" ? "dark" : "light") as
    | "light"
    | "dark";
  const colors = COLORS[theme];

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const ideal = (width - (WEEKS_TOTAL + 1) * GAP) / WEEKS_TOTAL;
      setCellSize(Math.max(MIN_CELL, Math.min(MAX_CELL, ideal)));
      requestAnimationFrame(scrollToEnd);
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [scrollToEnd]);

  // Scroll to the right (most recent) whenever data loads
  useEffect(() => {
    if (data) requestAnimationFrame(scrollToEnd);
  }, [data, scrollToEnd]);

  const gridWidth = data ? data.weeks.length * (cellSize + GAP) - GAP : 0;

  const placeholderH = 7 * MIN_CELL + 6 * GAP + MONTH_LABEL_HEIGHT + 32;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-foreground justify-between">
        <h2 className="text-base font-semibold">GitHub</h2>
        <a
          href="https://github.com/coelhomarcus"
          target="_blank"
          rel="noreferrer noopener"
        >
          <GithubIcon className="text-base text-muted-foreground hover:text-foreground" />
        </a>
      </div>

      <div ref={containerRef} className="border border-border rounded p-3">
        {isLoading && <CalendarSkeleton cellSize={cellSize} colors={colors} />}

        {error && !isLoading && (
          <div
            className="flex items-center justify-center text-sm text-muted-foreground"
            style={{ height: placeholderH }}
          >
            Erro ao carregar dados do GitHub
          </div>
        )}

        {data && !isLoading && (
          <div className="flex flex-col select-none" style={{ gap: GAP }}>
            {/* Scrollable area: month labels + week columns */}
            <div
              ref={scrollRef}
              className="github-calendar-scroll"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
              {/* Month labels */}
              <div
                className="relative"
                style={{ height: MONTH_LABEL_HEIGHT, width: gridWidth }}
              >
                {getMonthLabels(data.weeks, cellSize).map(
                  ({ month, left }, i) => (
                    <span
                      key={i}
                      className="absolute text-[10px] text-muted-foreground leading-none"
                      style={{ left, top: 2 }}
                    >
                      {month}
                    </span>
                  ),
                )}
              </div>

              {/* Weeks grid */}
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
                    {week.contributionDays.map((day, di) => (
                      <div
                        key={di}
                        title={`${day.contributionCount} contribuição${day.contributionCount !== 1 ? "s" : ""} em ${new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}`}
                        style={{
                          width: cellSize,
                          height: cellSize,
                          borderRadius: Math.max(2, cellSize * 0.15),
                          backgroundColor: colors[day.contributionLevel],
                          cursor: "default",
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: total + legend */}
            <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground flex-wrap gap-1">
              <span>
                {data.totalContributions.toLocaleString("pt-BR")} contribuições
                no último ano
              </span>
              <div className="flex items-center gap-1">
                <span>Menos</span>
                {(
                  [
                    "NONE",
                    "FIRST_QUARTILE",
                    "SECOND_QUARTILE",
                    "THIRD_QUARTILE",
                    "FOURTH_QUARTILE",
                  ] as ContributionLevel[]
                ).map((level) => (
                  <div
                    key={level}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: colors[level],
                      flexShrink: 0,
                    }}
                  />
                ))}
                <span>Mais</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GitHubGraph;
