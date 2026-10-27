import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";
import {
  useGitHubPullRequests,
  type PullRequest,
  type PullRequestState,
} from "../hooks/use-github-pull-requests";

const TABS: { state: PullRequestState; label: string; dot: string }[] = [
  { state: "merged", label: "Merged", dot: "bg-violet-500" },
  { state: "open", label: "Open", dot: "bg-emerald-500" },
  { state: "closed", label: "Closed", dot: "bg-red-500" },
];

const EMPTY_MESSAGE: Record<PullRequestState, string> = {
  merged: "Nenhum pull request merged ainda.",
  open: "Nenhum pull request aberto no momento.",
  closed: "Nenhum pull request fechado.",
};

interface PillRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const tabId = (baseId: string, state: PullRequestState) => `${baseId}-tab-${state}`;
const panelId = (baseId: string) => `${baseId}-panel`;

function Tabs({
  baseId,
  active,
  onChange,
}: {
  baseId: string;
  active: PullRequestState;
  onChange: (state: PullRequestState) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const [pill, setPill] = useState<PillRect | null>(null);

  const measure = useCallback(() => {
    const tab = listRef.current?.querySelector<HTMLElement>(
      `[data-tab="${activeRef.current}"]`,
    );
    if (!tab) return;
    setPill({
      x: tab.offsetLeft,
      y: tab.offsetTop,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
    });
  }, []);

  useLayoutEffect(() => {
    activeRef.current = active;
    measure();
  }, [active, measure]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const obs = new ResizeObserver(measure);
    obs.observe(list);
    return () => obs.disconnect();
  }, [measure]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((tab) => tab.state === active);
    const next = {
      ArrowRight: (index + 1) % TABS.length,
      ArrowLeft: (index - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    }[event.key];
    if (next === undefined) return;

    event.preventDefault();
    const state = TABS[next].state;
    onChange(state);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-tab="${state}"]`)
      ?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Estado dos pull requests"
      onKeyDown={handleKeyDown}
      className="relative inline-flex h-8 w-fit shrink-0 items-center rounded-lg bg-background p-[3px] ring-1 ring-foreground/10"
    >
      {pill && (
        <motion.span
          aria-hidden
          className="absolute top-0 left-0 bg-zinc-100"
          style={{ borderRadius: 8, y: pill.y, height: pill.height }}
          initial={false}
          animate={{ x: pill.x, width: pill.width }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      {TABS.map(({ state, label }) => {
        const selected = state === active;

        return (
          <button
            key={state}
            id={tabId(baseId, state)}
            type="button"
            role="tab"
            data-tab={state}
            aria-selected={selected}
            aria-controls={panelId(baseId)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(state)}
            className={cn(
              "relative inline-flex h-[calc(100%-1px)] cursor-pointer items-center rounded-md px-2 text-[13px] sm:px-2.5 font-medium whitespace-nowrap transition-colors",
              selected
                ? "text-background"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <li className="group/row relative">
      {children}
      <span
        aria-hidden
        className="dotted-x absolute bottom-0 -right-(--gutter) -left-(--gutter) group-last/row:hidden"
      />
    </li>
  );
}

function PullRequestItem({ pr, dot }: { pr: PullRequest; dot: string }) {
  return (
    <Row>
      <a
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 py-3.5 group-last/row:pb-0"
      >
        <span aria-hidden className={cn("mt-[7px] size-2 shrink-0 rounded-full", dot)} />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[15px] text-zinc-100 underline decoration-transparent underline-offset-4 transition-colors group-hover:text-zinc-50 group-hover:decoration-zinc-600">
            {pr.title}
          </span>
          <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-zinc-500">
            <img
              src={`https://github.com/${pr.repository.split("/")[0]}.png?size=32`}
              alt=""
              loading="lazy"
              className="size-4 shrink-0 rounded-full bg-zinc-800"
            />
            <span className="truncate">{pr.repository}</span>
          </span>
        </span>
      </a>
    </Row>
  );
}

function ListSkeleton() {
  return (
    <ul className="animate-pulse">
      {Array.from({ length: 3 }, (_, i) => (
        <Row key={i}>
          <div className="flex items-start gap-3 py-3.5 group-last/row:pb-0">
            <span className="mt-[7px] size-2 shrink-0 rounded-full bg-zinc-800" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <span className="h-3 w-3/4 rounded bg-zinc-900" />
              <span className="h-2.5 w-1/3 rounded bg-zinc-900" />
            </div>
          </div>
        </Row>
      ))}
    </ul>
  );
}

function OpenSourceContributions() {
  const { data, isLoading } = useGitHubPullRequests();
  const baseId = useId();
  const [active, setActive] = useState<PullRequestState>("merged");

  const group = data?.[active];
  const { dot } = TABS.find((tab) => tab.state === active)!;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading
        title="Últimos PRs"
        action={
          <Tabs baseId={baseId} active={active} onChange={setActive} />
        }
      />

      <div>
        <div aria-hidden className="dotted-x -mx-(--gutter)" />

        {isLoading || !group ? (
          <ListSkeleton />
        ) : (
          <motion.div
            key={active}
            id={panelId(baseId)}
            role="tabpanel"
            aria-labelledby={tabId(baseId, active)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {group.items.length === 0 ? (
              <p className="pt-3.5 text-sm text-zinc-500">{EMPTY_MESSAGE[active]}</p>
            ) : (
              <ul>
                {group.items.map((pr) => (
                  <PullRequestItem key={pr.url} pr={pr} dot={dot} />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default OpenSourceContributions;
