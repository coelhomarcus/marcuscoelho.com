import { useGitHubStats } from "@/hooks/useGitHubStats";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded border border-border">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-lg font-semibold text-foreground leading-tight">
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded border border-border animate-pulse">
      <div className="h-3 w-16 rounded bg-muted" />
      <div className="h-5 w-10 rounded bg-muted" />
      <div className="h-3 w-20 rounded bg-muted" />
    </div>
  );
}

function LanguageBar({
  languages,
}: {
  languages: { name: string; percentage: number; color: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded border border-border">
      <span className="text-[11px] text-muted-foreground uppercase tracking-wide">
        Linguagens mais usadas
      </span>

      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-[2px]">
        {languages.map((lang) => (
          <div
            key={lang.name}
            title={`${lang.name}: ${lang.percentage}%`}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              minWidth: 4,
            }}
            className="rounded-full"
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-[11px] text-muted-foreground">
              {lang.name}{" "}
              <span className="text-foreground font-medium">
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
    <div className="flex flex-col gap-2 p-3 rounded border border-border animate-pulse">
      <div className="h-3 w-32 rounded bg-muted" />
      <div className="h-2 w-full rounded-full bg-muted" />
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="h-3 w-14 rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

function GitHubStats() {
  const { data, isLoading, error } = useGitHubStats();

  if (error && !isLoading) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Stat cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard
            label="Streak"
            value={data.currentStreak}
            sub="dias seguidos"
          />
          <StatCard
            label="Stars"
            value={data.totalStars}
            sub="total em repos"
          />
          <StatCard
            label="PRs Merged"
            value={data.mergedPRs}
            sub="pull requests"
          />
          <StatCard label="Issues" value={data.closedIssues} sub="fechadas" />
        </div>
      ) : null}

      {/* Languages bar */}
      {isLoading ? (
        <LanguageBarSkeleton />
      ) : data ? (
        <LanguageBar languages={data.languages} />
      ) : null}
    </div>
  );
}

export default GitHubStats;
