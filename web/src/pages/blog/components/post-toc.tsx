import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RailToc, type RailTocItem } from "@/components/ui/rail-toc";

const TOC_WIDTH = 160;
const TOC_GAP = 40;
const TOC_SPACE = TOC_WIDTH + TOC_GAP + 16;

interface PostTocProps {
  articleRef: React.RefObject<HTMLElement | null>;
  ready: unknown;
}

const PostToc = ({ articleRef, ready }: PostTocProps) => {
  const scrollRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<RailTocItem[]>([]);
  const gutter = useLeftGutter(articleRef, ready);
  const show = gutter >= TOC_SPACE && items.length > 1;

  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    scrollRef.current = document.getElementById("app-scroll");

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h1[id], h2[id], h3[id]"),
    );
    const levels = headings.map((h) => Number(h.tagName[1]));
    const top = Math.min(...levels);
    setItems(
      headings.map((h, i) => ({
        id: h.id,
        label: h.textContent ?? "",
        depth: levels[i] - top,
      })),
    );
  }, [articleRef, ready]);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          key="toc"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute top-0 right-full bottom-0"
          style={{ width: TOC_WIDTH, marginRight: TOC_GAP }}
        >
          <RailToc
            items={items}
            containerRef={scrollRef}
            offset={80}
            title="Nesta página"
            className="sticky top-8 w-full"
          />
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

function useLeftGutter(
  ref: React.RefObject<HTMLElement | null>,
  ready: unknown,
) {
  const [gutter, setGutter] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    const scroller = document.getElementById("app-scroll");
    if (!el || !scroller) return;

    const measure = () =>
      setGutter(
        el.getBoundingClientRect().left - scroller.getBoundingClientRect().left,
      );
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(scroller);
    return () => ro.disconnect();
  }, [ref, ready]);

  return gutter;
}

export default PostToc;
