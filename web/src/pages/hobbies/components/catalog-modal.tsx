import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Clock3,
  ExternalLink,
  Play,
  RotateCcw,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import { XIcon } from "@/components/icons/x";
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

function formatDate(value: string | null, includeTime = false) {
  if (!value) return null;
  if (includeTime) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

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
  const label = season ? SEASON_LABELS[season] ?? season : null;
  return [label, year].filter(Boolean).join(" de ");
}

function Progress({ current, total }: { current: number; total: number }) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Progresso</span>
        <span className="tabular-nums text-zinc-300">
          {current.toLocaleString("pt-BR")}
          {total > 0 ? ` / ${total.toLocaleString("pt-BR")}` : ""}
        </span>
      </div>
      {total > 0 && (
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-zinc-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-lg bg-zinc-900/70 p-3 ring-1 ring-foreground/8">
      <span className="mb-2 block text-zinc-600">{icon}</span>
      <p className="text-lg leading-none font-semibold text-zinc-100">{value}</p>
      <p className="mt-1 text-[10px] text-zinc-600">{label}</p>
    </div>
  );
}

function Fact({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "col-span-2")}>
      <dt className="text-[11px] text-zinc-600">{label}</dt>
      <dd className="mt-0.5 text-xs leading-relaxed text-zinc-300">{value}</dd>
    </div>
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
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  useEffect(() => {
    setSynopsisExpanded(false);
  }, [item?.malId]);

  const anime = kind === "anime" ? (item as AnimeItem | null) : null;
  const manga = kind === "manga" ? (item as MangaItem | null) : null;
  const current = anime?.episodesWatched ?? manga?.chaptersRead ?? 0;
  const total = anime?.totalEpisodes ?? manga?.totalChapters ?? 0;
  const updatedAt = item ? formatDate(item.malUpdatedAt, true) : null;
  const synopsisCanExpand = (item?.synopsis?.length ?? 0) > 280;

  const facts = item
    ? [
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
        item.mediaType
          ? { label: "Formato", value: MEDIA_LABELS[item.mediaType] ?? item.mediaType }
          : null,
        item.releaseStatus
          ? {
              label: "Situação",
              value: RELEASE_LABELS[item.releaseStatus] ?? item.releaseStatus,
            }
          : null,
        item.startDate
          ? { label: "Lançamento", value: formatDate(item.startDate)! }
          : null,
        item.endDate ? { label: "Término", value: formatDate(item.endDate)! } : null,
        anime?.source
          ? { label: "Origem", value: SOURCE_LABELS[anime.source] ?? anime.source }
          : null,
        anime && (anime.season || anime.seasonYear)
          ? {
              label: "Temporada",
              value: formatSeason(anime.season, anime.seasonYear)!,
            }
          : null,
        anime?.rating
          ? {
              label: "Classificação",
              value: RATING_LABELS[anime.rating] ?? anime.rating,
            }
          : null,
        anime?.averageEpisodeDuration
          ? {
              label: "Duração por episódio",
              value: formatDuration(anime.averageEpisodeDuration)!,
            }
          : null,
        anime && anime.studios.length > 0
          ? { label: "Estúdios", value: anime.studios.join(", "), wide: true }
          : null,
        manga && manga.authors.length > 0
          ? { label: "Autores", value: manga.authors.join(", "), wide: true }
          : null,
      ].filter((fact): fact is { label: string; value: string; wide?: boolean } =>
        Boolean(fact),
      )
    : [];

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
              className="scrollbar fixed top-1/2 left-1/2 z-100 max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-card p-3 shadow-2xl ring-1 ring-foreground/10 sm:w-[calc(100%-2.5rem)] sm:p-5"
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

              <header className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <div className="aspect-2/3 overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-foreground/10">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={`Capa de ${item.title}`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-zinc-700">
                      {kind === "anime" ? <Play size={26} /> : <BookOpen size={26} />}
                    </div>
                  )}
                </div>

                <div className="min-w-0 pr-8 sm:pt-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                    {kind === "anime" ? "Anime" : "Mangá"}
                  </p>
                  <Dialog.Title asChild>
                    <h2 className="mt-1 text-lg leading-tight font-bold text-zinc-100 sm:text-2xl">
                      {item.title}
                    </h2>
                  </Dialog.Title>
                  {item.englishTitle && item.englishTitle !== item.title && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                      {item.englishTitle}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge>{statusLabel}</Badge>
                  </div>

                  <a
                    href={`https://myanimelist.net/${kind}/${item.malId}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-100"
                  >
                    Ver no MyAnimeList <ExternalLink size={12} />
                  </a>
                </div>
              </header>

              <section className="mt-5 border-t border-foreground/10 pt-5">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Minha experiência
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metric
                    icon={<Star size={13} />}
                    value={
                      item.score > 0 ? (
                        <>
                          {item.score}
                          <span className="text-xs text-zinc-600">/10</span>
                        </>
                      ) : (
                        "—"
                      )
                    }
                    label="Minha nota"
                  />
                  <Metric
                    icon={kind === "anime" ? <Play size={13} /> : <BookOpen size={13} />}
                    value={current.toLocaleString("pt-BR")}
                    label={kind === "anime" ? "Episódios" : "Capítulos"}
                  />
                  {manga && (manga.volumesRead > 0 || manga.totalVolumes > 0) && (
                    <Metric
                      icon={<BookOpen size={13} />}
                      value={manga.volumesRead.toLocaleString("pt-BR")}
                      label="Volumes"
                    />
                  )}
                  {updatedAt && (
                    <Metric
                      icon={<Clock3 size={13} />}
                      value={<span className="text-sm">{updatedAt}</span>}
                      label="Última atualização"
                    />
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-6">
                  <Progress current={current} total={total} />
                  <div className="space-y-1.5 text-xs text-zinc-500">
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
                    {(anime?.isRewatching || manga?.isRereading) && (
                      <p className="flex items-center gap-1.5 text-zinc-300">
                        <RotateCcw size={12} />
                        {anime ? "Assistindo novamente" : "Lendo novamente"}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {item.synopsis && (
                <section className="mt-5 border-t border-foreground/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-zinc-200">Sinopse</h3>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-700">
                      MyAnimeList · EN
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed text-zinc-400",
                      !synopsisExpanded && "line-clamp-4",
                    )}
                  >
                    {item.synopsis}
                  </p>
                  {synopsisCanExpand && (
                    <button
                      type="button"
                      aria-expanded={synopsisExpanded}
                      onClick={() => setSynopsisExpanded((expanded) => !expanded)}
                      className="mt-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
                    >
                      {synopsisExpanded ? "Ler menos" : "Ler mais"}
                    </button>
                  )}
                </section>
              )}

              <section className="mt-5 border-t border-foreground/10 pt-5">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Ficha técnica
                </h3>

                <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <dl className="grid grid-cols-2 gap-x-5 gap-y-3 md:grid-cols-3">
                    {facts.map((fact) => (
                      <Fact
                        key={fact.label}
                        label={fact.label}
                        value={fact.value}
                        wide={fact.wide}
                      />
                    ))}
                  </dl>

                  {item.genres.length > 0 && (
                    <div className="sm:w-48">
                      <p className="mb-2 text-[11px] text-zinc-600">Gêneros</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.genres.map((genre) => (
                          <Badge key={genre}>{genre}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
