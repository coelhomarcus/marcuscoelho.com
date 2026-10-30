import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageTitle from "@/components/page-title";
import { SectionRule } from "@/components/layout/stitch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { cyberpunk } from "@/data/hobbies/cyberpunk";
import type { CyberpunkMedia, CyberpunkMediaKind } from "@/data/hobbies/types";

type Filter = "all" | "done" | "pending";

const KIND_LABEL: Record<CyberpunkMediaKind, string> = {
  game: "Jogo",
  dlc: "DLC",
  comic: "HQ",
  anime: "Anime",
  book: "Livro",
  manga: "Mangá",
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "done", label: "Completos" },
  { key: "pending", label: "Pendentes" },
];

export default function CyberpunkPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => {
    const done = cyberpunk.filter((item) => item.completed).length;
    return {
      all: cyberpunk.length,
      done,
      pending: cyberpunk.length - done,
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return cyberpunk.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "done" ? item.completed : !item.completed);
      const haystack = [item.name, KIND_LABEL[item.kind]]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, query]);

  return (
    <main className="space-y-4 text-zinc-100">
      <PageTitle title="Cyberpunk" suffix />

      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          Hobbies / Cyberpunk
        </p>
        <h1 className="text-2xl leading-tight font-bold sm:text-3xl">
          Cyberpunk
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          Jogo, HQs, anime e o resto do universo — o que já fechei e o que ainda
          falta.
        </p>
      </div>

      <SectionRule />

      <div className="space-y-4">
        <div className="relative">
          <Search
            size={14}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-600"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar em cyberpunk..."
            aria-label="Buscar em cyberpunk"
            className="pl-8"
          />
        </div>

        <div
          className="flex gap-1.5 overflow-x-auto pb-1"
          aria-label="Filtrar por status"
        >
          {FILTERS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              aria-pressed={filter === option.key}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                filter === option.key
                  ? "border-foreground bg-foreground text-background"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
              )}
            >
              {option.label}{" "}
              <span
                className={
                  filter === option.key ? "text-background/60" : "text-zinc-600"
                }
              >
                {counts[option.key]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table
              aria-label="Catálogo de mídias de Cyberpunk"
              className="w-full min-w-[28rem] text-left text-sm"
            >
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Título
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Tipo
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <Row key={`${item.kind}::${item.name}`} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-zinc-600">
            Nenhum título encontrado com esses filtros.
          </p>
        )}
      </div>
    </main>
  );
}

function Row({ item }: { item: CyberpunkMedia }) {
  return (
    <tr className="border-b border-zinc-800/70 last:border-0">
      <th
        scope="row"
        className="py-2.5 pr-4 font-medium text-zinc-100"
      >
        {item.name}
      </th>
      <td className="py-2.5 pr-4 whitespace-nowrap text-zinc-500">
        {KIND_LABEL[item.kind]}
      </td>
      <td
        className={cn(
          "py-2.5 whitespace-nowrap",
          item.completed ? "text-zinc-300" : "text-zinc-600",
        )}
      >
        {item.completed ? "Completo" : "Pendente"}
      </td>
    </tr>
  );
}
