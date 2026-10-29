import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CatalogCard } from "./catalog-card";
import { CatalogModal } from "./catalog-modal";
import {
  CATALOG_COPY,
  CATALOG_GRID_CLASS,
  CatalogHeading,
  LoadingCatalog,
} from "./catalog-skeleton";
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
  const { title } = CATALOG_COPY[kind];

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
      <CatalogHeading kind={kind} />

      {isLoading ? (
        <LoadingCatalog />
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
                      ? "border-foreground bg-foreground text-background"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  {option.label}{" "}
                  <span
                    className={
                      status === option.key ? "text-background/60" : "text-zinc-600"
                    }
                  >
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className={CATALOG_GRID_CLASS}>
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
