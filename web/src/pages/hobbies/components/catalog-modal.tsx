import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { BookOpen, Play, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { XIcon } from "@/components/icons/x";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import type { AnimeItem, CatalogKind, MangaItem } from "../types";

const MEDIA_LABELS: Record<string, string> = {
  tv: "TV",
  movie: "Filme",
  ova: "OVA",
  ona: "ONA",
  special: "Especial",
  music: "Clipe",
  manga: "Mangá",
  novel: "Novel",
  light_novel: "Light novel",
  one_shot: "One-shot",
  manhwa: "Manhwa",
  manhua: "Manhua",
  doujinshi: "Doujinshi",
};

const RELEASE_LABELS: Record<string, string> = {
  finished_airing: "Finalizado",
  currently_airing: "Em exibição",
  not_yet_aired: "Ainda não estreou",
  finished: "Finalizado",
  currently_publishing: "Em publicação",
  not_yet_published: "Ainda não publicado",
  on_hiatus: "Em hiato",
  discontinued: "Descontinuado",
};

const SOURCE_LABELS: Record<string, string> = {
  original: "Original",
  manga: "Mangá",
  "4_koma_manga": "Mangá 4-koma",
  web_manga: "Web mangá",
  digital_manga: "Mangá digital",
  web_novel: "Web novel",
  novel: "Novel",
  light_novel: "Light novel",
  visual_novel: "Visual novel",
  game: "Jogo",
  card_game: "Jogo de cartas",
  book: "Livro",
  picture_book: "Livro ilustrado",
  radio: "Rádio",
  music: "Música",
  other: "Outro",
};

const RATING_LABELS: Record<string, string> = {
  g: "Livre",
  pg: "PG",
  pg_13: "PG-13",
  r: "R-17",
  r_plus: "R+",
  rx: "Adulto",
};

const SEASON_LABELS: Record<string, string> = {
  winter: "Inverno",
  spring: "Primavera",
  summer: "Verão",
  fall: "Outono",
};

type TabId = "experience" | "synopsis" | "details";

interface Tab {
  id: TabId;
  label: string;
}

interface Fact {
  label: string;
  value: string;
}

function formatDate(value: string | null) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year) return value;
  if (!month) return String(year);

  const date = new Date(Date.UTC(year, month - 1, day || 1));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
    ...(day ? { day: "2-digit" } : {}),
    timeZone: "UTC",
  }).format(date);
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}min` : `${hours}h`;
}

function formatSeason(season: string | null, year: number | null) {
  if (!season && !year) return null;
  const label = season ? (SEASON_LABELS[season] ?? season) : null;
  return [label, year].filter(Boolean).join(" de ");
}

function yearFromDate(value: string | null) {
  if (!value) return null;
  const year = value.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
}

function ofCount(
  current: number,
  total: number,
  singular: string,
  plural: string,
) {
  const word = total === 1 || (total === 0 && current === 1) ? singular : plural;
  const live = current.toLocaleString("pt-BR");
  if (total > 0) {
    return `${live} de ${total.toLocaleString("pt-BR")} ${word}`;
  }
  return `${live} ${word}`;
}

function MalLink({ href }: { href: string }) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1 text-[13px] font-medium text-zinc-400 transition-colors hover:text-zinc-100"
      {...hoverProps}
    >
      MyAnimeList
      <ArrowUpRightIcon ref={ref} size={13} />
    </a>
  );
}

function Cover({
  item,
  kind,
  className,
}: {
  item: AnimeItem | MangaItem;
  kind: CatalogKind;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden bg-zinc-900", className)}>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={`Capa de ${item.title}`}
          className="size-full object-cover object-top"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-zinc-700">
          {kind === "anime" ? <Play size={26} /> : <BookOpen size={26} />}
        </div>
      )}
    </div>
  );
}

function ModalTabs({
  tabs,
  active,
  baseId,
  onChange,
}: {
  tabs: Tab[];
  active: TabId;
  baseId: string;
  onChange: (id: TabId) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const [pill, setPill] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

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
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (next === undefined) return;

    event.preventDefault();
    const id = tabs[next].id;
    onChange(id);
    listRef.current
      ?.querySelector<HTMLElement>(`[data-tab="${id}"]`)
      ?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Seções do título"
      onKeyDown={handleKeyDown}
      className="relative flex h-8 w-full shrink-0 items-center rounded-lg bg-background p-[3px] ring-1 ring-foreground/10"
    >
      {pill && (
        <motion.span
          aria-hidden
          className="absolute top-0 left-0 bg-foreground"
          style={{ borderRadius: 8, y: pill.y, height: pill.height }}
          initial={false}
          animate={{ x: pill.x, width: pill.width }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            id={`${baseId}-tab-${tab.id}`}
            type="button"
            role="tab"
            data-tab={tab.id}
            aria-selected={selected}
            aria-controls={`${baseId}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center rounded-md px-2 text-[13px] font-medium whitespace-nowrap transition-colors",
              selected
                ? "text-background"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function ExperiencePanel({
  item,
  kind,
  current,
  total,
}: {
  item: AnimeItem | MangaItem;
  kind: CatalogKind;
  current: number;
  total: number;
}) {
  const anime = kind === "anime" ? (item as AnimeItem) : null;
  const manga = kind === "manga" ? (item as MangaItem) : null;
  const rewatching = Boolean(anime?.isRewatching || manga?.isRereading);
  const unit = kind === "anime" ? "episódios" : "capítulos";
  const unitSingular = kind === "anime" ? "episódio" : "capítulo";
  const progress = ofCount(current, total, unitSingular, unit);
  const volumes =
    manga && (manga.volumesRead > 0 || manga.totalVolumes > 0)
      ? ofCount(manga.volumesRead, manga.totalVolumes, "volume", "volumes")
      : null;

  return (
    <div className="space-y-1 text-sm text-zinc-500">
      {item.score > 0 && (
        <p>
          Nota{" "}
          <span className="text-zinc-300 tabular-nums">{item.score}</span>
        </p>
      )}
      <p>
        <span className="text-zinc-300 tabular-nums">{progress}</span>
      </p>
      {volumes && (
        <p>
          <span className="text-zinc-300 tabular-nums">{volumes}</span>
        </p>
      )}
      {item.personalStartDate && (
        <p>
          Comecei em{" "}
          <span className="text-zinc-300">
            {formatDate(item.personalStartDate)}
          </span>
        </p>
      )}
      {item.personalFinishDate && (
        <p>
          Terminei em{" "}
          <span className="text-zinc-300">
            {formatDate(item.personalFinishDate)}
          </span>
        </p>
      )}
      {rewatching && (
        <p className="flex items-center gap-1.5 text-zinc-300">
          <RotateCcw size={12} />
          {anime ? "Assistindo novamente" : "Lendo novamente"}
        </p>
      )}
    </div>
  );
}

function DetailsPanel({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) {
    return <p className="text-sm text-zinc-500">Sem ficha técnica.</p>;
  }

  return (
    <dl>
      {facts.map((fact, index) => (
        <div
          key={fact.label}
          className={cn(
            "flex items-baseline justify-between gap-6 py-2.5",
            index > 0 && "border-t border-foreground/8",
          )}
        >
          <dt className="shrink-0 text-xs text-zinc-500">{fact.label}</dt>
          <dd className="text-right text-sm leading-relaxed text-zinc-200">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function CatalogModal({
  item,
  kind,
  statusLabel,
  onClose,
}: {
  item: AnimeItem | MangaItem | null;
  kind: CatalogKind;
  statusLabel: string;
  onClose: () => void;
}) {
  const baseId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<TabId>("experience");

  useEffect(() => {
    setTab("experience");
  }, [item?.malId]);

  const anime = kind === "anime" ? (item as AnimeItem | null) : null;
  const manga = kind === "manga" ? (item as MangaItem | null) : null;
  const current = anime?.episodesWatched ?? manga?.chaptersRead ?? 0;
  const total = anime?.totalEpisodes ?? manga?.totalChapters ?? 0;

  const facts: Fact[] = item
    ? [
        item.releaseStatus
          ? {
              label: "Situação",
              value: RELEASE_LABELS[item.releaseStatus] ?? item.releaseStatus,
            }
          : null,
        item.startDate
          ? { label: "Lançamento", value: formatDate(item.startDate)! }
          : null,
        item.endDate
          ? { label: "Término", value: formatDate(item.endDate)! }
          : null,
        anime?.source
          ? { label: "Origem", value: SOURCE_LABELS[anime.source] ?? anime.source }
          : null,
        anime?.rating
          ? {
              label: "Classificação",
              value: RATING_LABELS[anime.rating] ?? anime.rating,
            }
          : null,
        anime?.averageEpisodeDuration
          ? {
              label: "Duração",
              value: formatDuration(anime.averageEpisodeDuration)!,
            }
          : null,
        anime && anime.studios.length > 0
          ? { label: "Estúdios", value: anime.studios.join(", ") }
          : null,
        manga && manga.authors.length > 0
          ? { label: "Autores", value: manga.authors.join(", ") }
          : null,
        item.meanScore !== null
          ? { label: "Média no MAL", value: item.meanScore.toFixed(2) }
          : null,
        item.rank !== null
          ? { label: "Ranking", value: `#${item.rank.toLocaleString("pt-BR")}` }
          : null,
        item.popularity !== null
          ? {
              label: "Popularidade",
              value: `#${item.popularity.toLocaleString("pt-BR")}`,
            }
          : null,
      ].filter((fact): fact is Fact => Boolean(fact))
    : [];

  const tabs: Tab[] = item
    ? [
        { id: "experience", label: "Experiência" },
        ...(item.synopsis ? [{ id: "synopsis" as const, label: "Sinopse" }] : []),
        { id: "details", label: "Ficha" },
      ]
    : [];

  const meta = item
    ? [
        item.mediaType
          ? (MEDIA_LABELS[item.mediaType] ?? item.mediaType)
          : null,
        formatSeason(anime?.season ?? null, anime?.seasonYear ?? null) ??
          yearFromDate(item.startDate),
      ].filter(Boolean)
    : [];

  const activeTab = tabs.some((entry) => entry.id === tab) ? tab : "experience";

  useLayoutEffect(() => {
    panelRef.current?.scrollTo(0, 0);
  }, [activeTab, item?.malId]);

  return (
    <Dialog.Root
      open={Boolean(item)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {item && (
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              data-slot="dialog-overlay"
              className="fixed inset-0 z-99 bg-black/65 backdrop-blur-sm"
            />
          </Dialog.Overlay>

          <Dialog.Content asChild aria-describedby={undefined}>
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 z-100 flex max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-foreground/10 sm:h-[min(24rem,92dvh)] sm:w-[calc(100%-2.5rem)] sm:flex-row"
            >
              <Dialog.Close asChild>
                <IconButton
                  type="button"
                  variant="outline"
                  icon={XIcon}
                  aria-label="Fechar"
                  className="absolute top-3 right-3 z-10 bg-background/90 text-foreground backdrop-blur hover:bg-zinc-900 dark:bg-background/90"
                />
              </Dialog.Close>

              <Cover
                item={item}
                kind={kind}
                className="mx-auto mt-4 aspect-2/3 w-32 shrink-0 rounded-lg ring-1 ring-foreground/10 sm:mx-0 sm:mt-0 sm:h-full sm:w-[16rem] sm:rounded-none sm:rounded-l-xl sm:ring-0"
              />

              <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-4 pb-4 sm:px-5 sm:pt-5">
                <header className="min-w-0 shrink-0 pr-10">
                  <Dialog.Title asChild>
                    <h2 className="text-lg leading-tight font-bold text-balance text-zinc-100 sm:text-xl">
                      {item.title}
                    </h2>
                  </Dialog.Title>
                  {item.englishTitle && item.englishTitle !== item.title && (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                      {item.englishTitle}
                    </p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge>{statusLabel}</Badge>
                    {meta.length > 0 && (
                      <span className="text-xs text-zinc-500">
                        {meta.join(" · ")}
                      </span>
                    )}
                  </div>

                  {item.genres.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {item.genres.map((genre) => (
                        <Badge key={genre}>{genre}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-3">
                    <MalLink
                      href={`https://myanimelist.net/${kind}/${item.malId}`}
                    />
                  </div>
                </header>

                <div className="mt-4 shrink-0">
                  <ModalTabs
                    tabs={tabs}
                    active={activeTab}
                    baseId={baseId}
                    onChange={setTab}
                  />
                </div>

                <div
                  ref={panelRef}
                  id={`${baseId}-panel`}
                  role="tabpanel"
                  aria-labelledby={`${baseId}-tab-${activeTab}`}
                  className="scrollbar mt-1 min-h-0 flex-1 overflow-y-auto pt-3"
                >
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.16 }}
                  >
                    {activeTab === "experience" && (
                      <ExperiencePanel
                        item={item}
                        kind={kind}
                        current={current}
                        total={total}
                      />
                    )}
                    {activeTab === "synopsis" && item.synopsis && (
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {item.synopsis}
                      </p>
                    )}
                    {activeTab === "details" && <DetailsPanel facts={facts} />}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
