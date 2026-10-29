import PageTitle from "@/components/page-title";
import { SectionRule } from "@/components/layout/stitch";
import type { CatalogKind } from "../types";

export const CATALOG_COPY: Record<
  CatalogKind,
  { title: string; description: string }
> = {
  anime: {
    title: "Animes",
    description:
      "Histórias que assisti, estou acompanhando ou ainda quero conhecer.",
  },
  manga: {
    title: "Mangás",
    description:
      "Mangás, novels e outras leituras que passaram pela minha estante digital.",
  },
};

export const CATALOG_GRID_CLASS =
  "grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @xl:grid-cols-5 @3xl:grid-cols-6";

export const CARD_FRAME_CLASS =
  "relative block aspect-2/3 w-full overflow-hidden rounded-lg bg-zinc-900 shadow-sm ring-1 ring-foreground/10";

const SKELETON_CHIP_LABELS = ["Todos 00", "Concluídos 00", "Em pausa 0", "Abandonados 0"];

export function CatalogCardSkeleton() {
  return <div aria-hidden className={`${CARD_FRAME_CLASS} animate-pulse`} />;
}

export function CatalogHeading({ kind }: { kind: CatalogKind }) {
  const { title, description } = CATALOG_COPY[kind];

  return (
    <>
      <PageTitle title={title} suffix />

      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          Hobbies / {title}
        </p>
        <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>

      <SectionRule />
    </>
  );
}

export function LoadingCatalog() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Carregando catálogo">
      <div className="space-y-3">
        <div className="h-8 w-full animate-pulse rounded-lg border border-zinc-800 bg-zinc-950" />
        <div className="flex gap-1.5 overflow-hidden pb-1">
          {SKELETON_CHIP_LABELS.map((label) => (
            <span
              key={label}
              className="shrink-0 animate-pulse rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-medium"
            >
              <span className="invisible">{label}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={CATALOG_GRID_CLASS}>
        {Array.from({ length: 24 }).map((_, index) => (
          <CatalogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function CatalogPageFallback({ kind }: { kind: CatalogKind }) {
  return (
    <main className="space-y-4 text-zinc-100">
      <CatalogHeading kind={kind} />
      <LoadingCatalog />
    </main>
  );
}
