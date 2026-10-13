import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useParams, Link, useLocation } from "react-router";
import PageTitle from "@/components/PageTitle/PageTitle";
import { AnimatePresence, motion } from "motion/react";
import { useToast } from "@/components/Toast/ToastContext";
import { RailToc, type RailTocItem } from "@/components/ui/rail-toc";

import { RxCommit as CommitIcon } from "react-icons/rx";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { LinkIcon } from "@/components/icons/link";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

import { loadPost } from "./loadPost";
import { blogPostsData } from "@/data/blogPostsData";
import components from "@/lib/mdx-components";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// The TOC floats in the empty space left of the article, plus some breathing
// room from the edge of the page
const TOC_WIDTH = 160;
const TOC_GAP = 40;
const TOC_SPACE = TOC_WIDTH + TOC_GAP + 16;

const Post = () => {
  const { slug } = useParams();
  const post = blogPostsData.find((p) => p.slug === slug);
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(
    null,
  );
  const { toast } = useToast();
  const back = useAnimatedIcon();
  const copyLink = useAnimatedIcon();
  const articleRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement | null>(null);
  const [tocItems, setTocItems] = useState<RailTocItem[]>([]);
  const gutter = useLeftGutter(articleRef, MDXComponent);
  const showToc = gutter >= TOC_SPACE && tocItems.length > 1;

  useEffect(() => {
    if (!slug) return;

    const importer = loadPost(slug);
    if (importer) {
      importer().then((mod) => {
        const Component = (mod as { default: React.ComponentType }).default;
        setMDXComponent(() => Component);
      });
    } else {
      setMDXComponent(() => () => (
        <p className="text-red-500">Post não encontrado</p>
      ));
    }
  }, [slug]);

  // Headings only exist once the MDX renders; read them before paint so the
  // two-column layout never flashes in
  useLayoutEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    // The TOC only shows on desktop, where the page card scrolls, not the window
    scrollRef.current = document.getElementById("app-scroll");

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h1[id], h2[id], h3[id]"),
    );
    const levels = headings.map((h) => Number(h.tagName[1]));
    const top = Math.min(...levels);
    setTocItems(
      headings.map((h, i) => ({
        id: h.id,
        label: h.textContent ?? "",
        depth: levels[i] - top,
      })),
    );
  }, [MDXComponent]);

  if (!MDXComponent)
    return (
      <div className="flex items-center justify-center">
        <CommitIcon className="text-zinc-500 animate-[spin_3s_linear_infinite] duration-100 size-6 mt-10" />
      </div>
    );

  if (!post) return <PostNotFound />;

  return (
    <main className="text-zinc-100">
      {post && <PageTitle title={post.title} />}

      <motion.div {...fadeUp}>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 mb-8"
          {...back.hoverProps}
        >
          <ChevronLeftIcon ref={back.ref} size={16} /> Voltar aos articles
        </Link>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.06 }}
      >
        <div className="relative mb-10 overflow-hidden rounded-xl bg-black">
          {post.banner && (
            <div className="absolute right-0 top-0 w-[50%] h-full">
              <img
                src={post.banner}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover object-right select-none"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/90" />
            </div>
          )}
          <div className={cn("relative", post.banner ? "py-4" : undefined)}>
            <h1 className="font-[Times_New_Roman] italic text-4xl sm:text-5xl md:text-6xl text-zinc-100 leading-[1.1] mb-5">
              {post.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500 font-mono">
                {post.date}
              </span>
              <span className="text-zinc-700">·</span>
              <span className="text-sm text-zinc-500">{post.desc}</span>
              <span className="text-zinc-700">·</span>
              <button
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast("Link copiado!");
                }}
                {...copyLink.hoverProps}
              >
                <LinkIcon ref={copyLink.ref} size={14} /> Copiar link
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.12 }}
      >
        <div className="relative">
          <MDXProvider components={components}>
            <article ref={articleRef} className="prose max-w-full">
              <ScrollToHashOnLoad />
              <MDXComponent />
            </article>
          </MDXProvider>

          <AnimatePresence>
            {showToc && (
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
                  items={tocItems}
                  containerRef={scrollRef}
                  offset={80}
                  title="Nesta página"
                  className="sticky top-8 w-full"
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

function PostNotFound() {
  return (
    <main className="text-zinc-100 space-y-6">
      <motion.div {...fadeUp}>
        <div className="flex flex-col justify-center mt-10 items-center gap-2">
          <h1 className="text-center text-2xl sm:text-3xl font-bold text-zinc-100">
            Esse post não existe!
          </h1>
          <p className="text-center text-sm text-zinc-400 mb-2 leading-relaxed">
            Talvez ele tenha sido removido ou nunca existiu.
          </p>

          <div className="relative w-50 h-50 self-center mb-3">
            <div className="absolute inset-0 w-full h-full bg-zinc-800 animate-pulse rounded-xl" />
            <img
              loading="lazy"
              src="https://i.pinimg.com/736x/07/24/a3/0724a3febab29fbb247abde72d51d184.jpg"
              alt="Imagem de personagem confuso"
              className="absolute inset-0 w-full h-full object-cover select-none rounded-xl"
            />
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Voltar pro Blog
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

// Free space between the scroll container's left edge and the article. It
// shrinks with the window and when the sidebar pushes the page
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

function ScrollToHashOnLoad() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
}

export default Post;
