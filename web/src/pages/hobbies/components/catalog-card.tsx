import { useCallback, useEffect, useState } from "react";
import { BookOpen, Play } from "lucide-react";
import { animate, motion, useMotionValue } from "motion/react";
import { CARD_FRAME_CLASS } from "./catalog-skeleton";
import type { AnimeItem, CatalogKind, MangaItem } from "../types";

const loadedImages = new Set<string>();

export function CatalogCard({
  item,
  kind,
  onSelect,
}: {
  item: AnimeItem | MangaItem;
  kind: CatalogKind;
  onSelect: () => void;
}) {
  const { imageUrl } = item;
  const [loaded, setLoaded] = useState(
    () => !imageUrl || loadedImages.has(imageUrl),
  );
  const [settled, setSettled] = useState(loaded);
  const overlayOpacity = useMotionValue(1);

  useEffect(() => {
    if (!loaded || settled) return;
    const controls = animate(overlayOpacity, 0, {
      duration: 0.3,
      ease: "easeOut",
      onComplete: () => setSettled(true),
    });
    return () => controls.stop();
  }, [loaded, settled, overlayOpacity]);

  const markLoaded = useCallback(() => {
    if (imageUrl) loadedImages.add(imageUrl);
    setLoaded(true);
  }, [imageUrl]);

  const imageRef = useCallback(
    (element: HTMLImageElement | null) => {
      if (element?.complete) markLoaded();
    },
    [markLoaded],
  );

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
        <>
          <img
            ref={imageRef}
            src={item.imageUrl}
            alt=""
            loading="lazy"
            onLoad={markLoaded}
            onError={markLoaded}
            className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
          />
          {!settled && (
            <motion.span
              style={{ opacity: overlayOpacity }}
              aria-hidden
              className="absolute inset-0"
            >
              <span className="block size-full animate-pulse bg-zinc-900" />
            </motion.span>
          )}
        </>
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
