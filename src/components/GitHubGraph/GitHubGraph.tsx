import { useRef, useState, useEffect, useCallback } from "react";
import {
  useGitHubCalendar,
  type ContributionLevel,
} from "@/hooks/useGitHubCalendar";
import { RxGithubLogo as GithubIcon } from "react-icons/rx";

const GAP = 3;
const MIN_CELL = 10;
const WEEKS_TOTAL = 53;

const COLORS: Record<ContributionLevel, string> = {
  NONE: "#181818",
  FIRST_QUARTILE: "#0e4429",
  SECOND_QUARTILE: "#006d32",
  THIRD_QUARTILE: "#26a641",
  FOURTH_QUARTILE: "#39d353",
};

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
      <div
        className="github-calendar-scroll"
        style={{ flex: 1, overflowX: "hidden", overflowY: "hidden" }}
      >
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

  return (
    <div className="flex flex-col gap-3">
      <a
        href="https://github.com/coelhomarcus"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-base font-semibold text-zinc-300 hover:text-zinc-100 hover:underline transition-colors"
      >
        <GithubIcon className="size-4" />
        github.com/coelhomarcus
      </a>

      <div
        ref={containerRef}
        className="border border-zinc-700/50 bg-zinc-800/30 rounded-[8px] p-3"
      >
        {isLoading && <CalendarSkeleton cellSize={cellSize} colors={colors} />}

        {error && !isLoading && (
          <CalendarSkeleton cellSize={cellSize} colors={colors} />
        )}

        {data && !isLoading && (
          <div className="flex flex-col select-none" style={{ gap: GAP }}>
            <div
              ref={scrollRef}
              className="github-calendar-scroll"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
              }}
            >
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
          </div>
        )}
      </div>
    </div>
  );
}

export default GitHubGraph;
