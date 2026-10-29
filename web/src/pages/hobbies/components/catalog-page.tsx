import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import PageTitle from "@/components/page-title";
import { SectionRule } from "@/components/layout/stitch";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CatalogCard } from "./catalog-card";
import { CatalogModal } from "./catalog-modal";
import type {
  AnimeItem,
  CatalogKind,
  CatalogResponse,
  MangaItem,
} from "../types";

const STATUS_LABELS: Record<CatalogKind, Record<string, string>> = {
  anime: {
    watching: "Assistindo",
    completed: "Concluídos",
    on_hold: "Em pausa",
    dropped: "Abandonados",
    plan_to_watch: "Quero assistir",
  },
  manga: {
    reading: "Lendo",
    completed: "Concluídos",
    on_hold: "Em pausa",
    dropped: "Abandonados",
    plan_to_read: "Quero ler",
  },
};

type CatalogItem = AnimeItem | MangaItem;

function Summary({ items, kind }: { items: CatalogItem[]; kind: CatalogKind }) {
  const completed = items.filter((item) => item.listStatus === "completed").length;
  const scored = items.filter((item) => item.score > 0);
  const average = scored.length
    ? scored.reduce((total, item) => total + item.score, 0) / scored.length
    : 0;
  const progress = items.reduce(
    (total, item) =>
      total +
      (kind === "anime"
        ? (item as AnimeItem).episodesWatched
        : (item as MangaItem).chaptersRead),
    0,
  );
  const stats = [
    { label: "No catálogo", value: items.length.toLocaleString("pt-BR") },
    { label: "Concluídos", value: completed.toLocaleString("pt-BR") },
    {
      label: kind === "anime" ? "Episódios vistos" : "Capítulos lidos",
      value: progress.toLocaleString("pt-BR"),
    },
    { label: "Nota média", value: average ? average.toFixed(1) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-zinc-800/70 ring-1 ring-zinc-800 @2xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-background px-3 py-3.5">
          <p className="text-lg font-semibold tracking-tight text-zinc-100">
            {stat.value}
          </p>
          <p className="text-[11px] text-zinc-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @xl:grid-cols-5 @3xl:grid-cols-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <div
          key={index}
          className="aspect-2/3 animate-pulse rounded-lg bg-zinc-900 ring-1 ring-zinc-800"
        />
      ))}
    </div>
  );
}

export function CatalogPage({
  kind,
  data,
  isLoading,
  error,
}: {
  kind: CatalogKind;
  data: CatalogResponse<AnimeItem> | CatalogResponse<MangaItem> | null;
  isLoading: boolean;
  error: string | null;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const items = useMemo(
    () => (data?.items ?? []) as CatalogItem[],
    [data?.items],
  );
  const labels = STATUS_LABELS[kind];
  const plannedStatus = kind === "anime" ? "plan_to_watch" : "plan_to_read";
  const allCount = items.filter(
    (item) => item.listStatus !== plannedStatus,
  ).length;
  const title = kind === "anime" ? "Animes" : "Mangás";
  const description =
    kind === "anime"
      ? "Histórias que assisti, estou acompanhando ou ainda quero conhecer."
      : "Mangás, novels e outras leituras que passaram pela minha estante digital.";

  const statuses = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) counts.set(item.listStatus, (counts.get(item.listStatus) ?? 0) + 1);
    return Object.keys(labels)
      .filter((key) => counts.has(key))
      .map((key) => ({ key, label: labels[key], count: counts.get(key) ?? 0 }));
  }, [items, labels]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return items.filter((item) => {
      const matchesStatus =
        status === "all"
          ? item.listStatus !== plannedStatus
          : item.listStatus === status;
      const haystack = [item.title, item.englishTitle, ...item.genres]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [items, plannedStatus, query, status]);

  return (
    <main className="space-y-4 text-zinc-100">
      <PageTitle title={title} suffix />

      <motion.div {...fadeUp} className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          Hobbies / {title}
        </p>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </motion.div>

      <SectionRule />

      {isLoading ? (
        <LoadingCards />
      ) : error ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-center">
          <p className="text-sm text-zinc-300">Não consegui abrir este catálogo.</p>
          <p className="mt-1 text-xs text-zinc-600">{error}</p>
        </div>
      ) : (
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="space-y-4"
        >
          <Summary items={items} kind={kind} />

          <div className="space-y-3">
            <div className="relative">
              <Search
                size={14}
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-600"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Buscar em ${title.toLocaleLowerCase("pt-BR")}...`}
                aria-label={`Buscar em ${title}`}
                className="pl-8"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Filtrar por status">
              {[{ key: "all", label: "Todos", count: allCount }, ...statuses].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setStatus(option.key)}
                  aria-pressed={status === option.key}
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    status === option.key
                      ? "border-zinc-500 bg-zinc-800 text-zinc-100"
                      : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300",
                  )}
                >
                  {option.label} <span className="text-zinc-600">{option.count}</span>
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @xl:grid-cols-5 @3xl:grid-cols-6">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.malId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.3) }}
                >
                  <CatalogCard
                    item={item}
                    kind={kind}
                    onSelect={() => setSelected(item)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-zinc-600">
              Nenhum título encontrado com esses filtros.
            </p>
          )}

          {data?.syncedAt && (
            <p className="text-center text-[10px] text-zinc-700">
              Sincronizado com o MyAnimeList em{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(data.syncedAt))}
            </p>
          )}

          <CatalogModal
            item={selected}
            kind={kind}
            statusLabel={
              selected
                ? labels[selected.listStatus] ?? selected.listStatus
                : ""
            }
            onClose={() => setSelected(null)}
          />
        </motion.div>
      )}
    </main>
  );
}
