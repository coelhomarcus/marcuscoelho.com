import { useGitHubStats } from "@/hooks/useGitHubStats";
import { useGitHubCalendar } from "@/hooks/useGitHubCalendar";

function StatItem({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 p-3">
      <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-lg font-semibold text-zinc-200 leading-tight">
        {value}
      </span>
      {sub && <span className="text-[11px] text-zinc-500">{sub}</span>}
    </div>
  );
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-1.5 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 p-3 animate-pulse">
          <div className="h-3 w-16 rounded bg-zinc-800" />
          <div className="h-5 w-10 rounded bg-zinc-800" />
          <div className="h-3 w-20 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

function LanguageBar({
  languages,
}: {
  languages: { name: string; percentage: number; color: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30">
      <span className="text-[11px] text-zinc-500 uppercase tracking-wide">
        Linguagens mais usadas
      </span>

      <div className="flex h-2 rounded-xs overflow-hidden gap-[2px]">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name}: ${lang.percentage}%`}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              minWidth: 4,
            }}
            className="rounded-xs"
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-[11px] text-zinc-500">
              {lang.name}{" "}
              <span className="text-zinc-200 font-medium">
                {lang.percentage}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguageBarSkeleton() {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 animate-pulse">
      <div className="h-3 w-32 rounded bg-zinc-800" />
      <div className="h-2 w-full rounded-full bg-zinc-800" />
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-3 w-14 rounded bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

function GitHubStats() {
  const { data, isLoading, error } = useGitHubStats();
  const { data: calendarData } = useGitHubCalendar();

  if (error && !isLoading) return null;

  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <StatsGridSkeleton />
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatItem
            label="Contribuições"
            value={calendarData?.totalContributions ?? "—"}
            sub="no último ano"
          />
          <StatItem
            label="Stars"
            value={data.totalStars}
            sub="total em repos"
          />
          <StatItem
            label="PRs Merged"
            value={data.mergedPRs}
            sub="pull requests"
          />
          <StatItem
            label="Issues"
            value={data.closedIssues}
            sub="fechadas"
          />
        </div>
      ) : null}

      {isLoading ? (
        <LanguageBarSkeleton />
      ) : data ? (
        <LanguageBar languages={data.languages} />
      ) : null}
    </div>
  );
}

export default GitHubStats;
