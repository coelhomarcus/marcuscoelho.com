import { useEffect, useRef, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useParams, Link, useLocation } from "react-router";
import PageTitle from "@/components/page-title";
import { motion } from "motion/react";
import { useToast } from "@/components/toast/toast-context";

import { RxCommit as CommitIcon } from "react-icons/rx";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { LinkIcon } from "@/components/icons/link";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

import { loadPost } from "./load-post";
import { blogPosts } from "@/data/blog-posts";
import components from "./components/mdx-components";
import PostNotFound from "./components/post-not-found";
import PostToc from "./components/post-toc";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(
    null,
  );
  const { toast } = useToast();
  const back = useAnimatedIcon();
  const copyLink = useAnimatedIcon();
  const articleRef = useRef<HTMLElement>(null);

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

          <PostToc articleRef={articleRef} ready={MDXComponent} />
        </div>
      </motion.div>
    </main>
  );
};

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

export default PostPage;
