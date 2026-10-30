import { useMemo, useState } from "react";
import { Gamepad2, Search } from "lucide-react";
import PageTitle from "@/components/page-title";
import { SectionRule } from "@/components/layout/stitch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { games } from "@/data/hobbies/games";
import { wishlist } from "@/data/hobbies/wishlist";
import type { Game, WishlistGame } from "@/data/hobbies/types";
import { CoverCard } from "./components/catalog-card";
import { GameModal, type GameModalEntry } from "./components/game-modal";
import {
  CATALOG_GRID_CLASS,
  GAME_CARD_FRAME_CLASS,
} from "./components/catalog-skeleton";

type Filter = "all" | "playing" | "finished" | "wishlist";

function isPlaying(game: Game) {
  return game.finishedAt === null;
}

function compareGames(a: Game, b: Game) {
  const aPlaying = isPlaying(a);
  const bPlaying = isPlaying(b);
  if (aPlaying !== bPlaying) return aPlaying ? -1 : 1;
  const aDate = (aPlaying ? a.startedAt : a.finishedAt) ?? "";
  const bDate = (bPlaying ? b.startedAt : b.finishedAt) ?? "";
  return bDate.localeCompare(aDate);
}

function gameKey(game: Game) {
  return [game.name, game.platform, game.startedAt, game.finishedAt].join("::");
}

function wishlistKey(game: WishlistGame) {
  return ["wishlist", game.name, game.platform].join("::");
}

function matchesQuery(
  query: string,
  values: Array<string | number | null>,
) {
  if (!query) return true;
  return values
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("pt-BR")
    .includes(query);
}

function toGameEntry(game: Game): GameModalEntry {
  return {
    name: game.name,
    coverUrl: game.coverUrl,
    platform: game.platform,
    note: game.note,
    status: isPlaying(game) ? "Jogando" : "Zerado",
    startedAt: game.startedAt,
    finishedAt: game.finishedAt,
  };
}

function toWishlistEntry(game: WishlistGame): GameModalEntry {
  return {
    name: game.name,
    coverUrl: game.coverUrl,
    platform: game.platform,
    note: game.note,
    status: "Wishlist",
    link: game.link,
    desire: game.desire,
  };
}

const LIBRARY_FILTERS: { key: Exclude<Filter, "wishlist">; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "playing", label: "Jogando" },
  { key: "finished", label: "Zerados" },
];

function FilterPill({
  label,
  count,
  pressed,
  onClick,
}: {
  label: string;
  count: number;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
        pressed
          ? "border-foreground bg-foreground text-background"
          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
      )}
    >
      {label}{" "}
      <span className={pressed ? "text-background/60" : "text-zinc-600"}>
        {count}
      </span>
    </button>
  );
}

export default function GamesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<GameModalEntry | null>(null);

  const sorted = useMemo(() => games.slice().sort(compareGames), []);

  const counts = useMemo(() => {
    const playing = sorted.filter(isPlaying).length;
    return {
      all: sorted.length,
      playing,
      finished: sorted.length - playing,
      wishlist: wishlist.length,
    };
  }, [sorted]);

  const normalized = query.trim().toLocaleLowerCase("pt-BR");

  const filteredGames = useMemo(() => {
    if (filter === "wishlist") return [];
    return sorted.filter((game) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "playing" ? isPlaying(game) : !isPlaying(game));
      return (
        matchesFilter &&
        matchesQuery(normalized, [game.name, game.platform, game.note])
      );
    });
  }, [filter, normalized, sorted]);

  const filteredWishlist = useMemo(() => {
    if (filter !== "wishlist") return [];
    return wishlist.filter((game) =>
      matchesQuery(normalized, [game.name, game.platform, game.note]),
    );
  }, [filter, normalized]);

  const showingWishlist = filter === "wishlist";
  const cards = showingWishlist ? filteredWishlist : filteredGames;

  return (
    <main className="space-y-4 text-zinc-100">
      <PageTitle title="Jogos" suffix />

      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600">
          Hobbies / Jogos
        </p>
        <h1 className="text-2xl leading-tight font-bold sm:text-3xl">Jogos</h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
          O que estou jogando agora e o que já zerei, do mais recente ao mais
          antigo.
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
            placeholder={
              showingWishlist ? "Buscar na wishlist..." : "Buscar em jogos..."
            }
            aria-label={
              showingWishlist ? "Buscar na wishlist" : "Buscar em jogos"
            }
            className="pl-8"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1" aria-label="Filtrar por status">
          {LIBRARY_FILTERS.map((option) => (
            <FilterPill
              key={option.key}
              label={option.label}
              count={counts[option.key]}
              pressed={filter === option.key}
              onClick={() => setFilter(option.key)}
            />
          ))}
          <FilterPill
            label="Wishlist"
            count={counts.wishlist}
            pressed={showingWishlist}
            onClick={() => setFilter("wishlist")}
          />
        </div>

        {cards.length > 0 ? (
          <div className={CATALOG_GRID_CLASS}>
            {showingWishlist
              ? filteredWishlist.map((game) => (
                  <CoverCard
                    key={wishlistKey(game)}
                    imageUrl={game.coverUrl}
                    title={game.name}
                    fallback={<Gamepad2 size={22} />}
                    onSelect={() => setSelected(toWishlistEntry(game))}
                    frameClassName={GAME_CARD_FRAME_CLASS}
                  />
                ))
              : filteredGames.map((game) => (
                  <CoverCard
                    key={gameKey(game)}
                    imageUrl={game.coverUrl}
                    title={game.name}
                    fallback={<Gamepad2 size={22} />}
                    onSelect={() => setSelected(toGameEntry(game))}
                    frameClassName={GAME_CARD_FRAME_CLASS}
                  />
                ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-zinc-600">
            Nenhum título encontrado com esses filtros.
          </p>
        )}
      </div>

      <GameModal entry={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
