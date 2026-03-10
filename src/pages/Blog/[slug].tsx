import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { useParams, Link, useLocation } from "react-router";
import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";
import { useToast } from "@/components/Toast/Toast";

import {
  RxChevronLeft as BackIcon,
  RxCommit as CommitIcon,
  RxLink2 as LinkIcon,
} from "react-icons/rx";

import { loadPost } from "./posts/_posts";
import { blogPostsData } from "@/data/blogPostsData";
import components from "../../lib/mdx-components";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const Post = () => {
  const { slug } = useParams();
  const post = blogPostsData.find((p) => p.slug === slug);
  const [MDXComponent, setMDXComponent] = useState<React.ComponentType | null>(
    null,
  );
  const { toast } = useToast();

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
        >
          <BackIcon className="size-4" /> Voltar aos articles
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
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/90" />
            </div>
          )}
          <div className={`relative ${post.banner ? "py-4" : ""}`}>
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
              >
                <LinkIcon className="size-3.5" /> Copiar link
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.12 }}
      >
        <MDXProvider components={components}>
          <article className="prose max-w-full">
            <ScrollToHashOnLoad />
            <MDXComponent />
          </article>
        </MDXProvider>
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
            className="inline-flex items-center gap-2 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors"
          >
            Voltar pro Blog
          </Link>
        </div>
      </motion.div>
    </main>
  );
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
