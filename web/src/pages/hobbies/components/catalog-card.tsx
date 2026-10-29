import { BookOpen, Play } from "lucide-react";
import { motion } from "motion/react";
import type { AnimeItem, CatalogKind, MangaItem } from "../types";

export const CATALOG_GRID_CLASS =
  "grid grid-cols-3 gap-2.5 @sm:grid-cols-4 @xl:grid-cols-5 @3xl:grid-cols-6";

const CARD_FRAME_CLASS =
  "relative block aspect-2/3 w-full overflow-hidden rounded-lg bg-zinc-900 shadow-sm ring-1 ring-foreground/10";

export function CatalogCardSkeleton() {
  return <div aria-hidden className={`${CARD_FRAME_CLASS} animate-pulse`} />;
}

export function CatalogCard({
  item,
  kind,
  onSelect,
}: {
  item: AnimeItem | MangaItem;
  kind: CatalogKind;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-label={`Ver detalhes de ${item.title}`}
      className={`${CARD_FRAME_CLASS} group cursor-pointer text-left transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-zinc-400`}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="size-full object-cover transition duration-300 ease-out group-hover:scale-[1.035]"
        />
      ) : (
        <span className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center text-zinc-600">
          {kind === "anime" ? <Play size={22} /> : <BookOpen size={22} />}
          <span className="line-clamp-3 text-[11px] font-medium">{item.title}</span>
        </span>
      )}

      <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/0 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="pointer-events-none absolute right-2 bottom-2 left-2 line-clamp-2 translate-y-1 text-xs leading-tight font-semibold text-white opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {item.title}
      </span>
    </motion.button>
  );
}
