import { Link } from "react-router";
import type { BlogCardProps } from "@/types";
import { blogPostsData } from "@/data/blogPostsData";
import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const BlogCard = ({ slug, title, date, desc, banner }: BlogCardProps) => {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-200 overflow-hidden relative group"
    >
      {banner && (
        <div className="absolute right-0 top-0 w-[40%] h-full ">
          <img
            src={banner}
            alt="Banner"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-right select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-transparent transition-colors duration-200 group-hover:from-zinc-900 group-hover:via-zinc-900/70" />
        </div>
      )}
      <div className="relative flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono tracking-wide">
            {date}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500 font-medium">{desc}</span>
        </div>
        <h2 className="font-[Times_New_Roman] italic text-2xl sm:text-3xl text-zinc-100 group-hover:text-white transition-colors duration-200 leading-snug">
          {title}
        </h2>
      </div>
    </Link>
  );
};

const Blog = () => {
  return (
    <main className="text-zinc-100 space-y-8">
      <PageTitle title="Blog" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-2 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            Articles
            <br />
            <span className="font-[Times_New_Roman] italic text-4xl sm:text-5xl">
              & Pensamentos.
            </span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mt-1">
            Meus pensamentos, anotações e experiências.
          </p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="space-y-4"
      >
        {blogPostsData.length > 0 ? (
          blogPostsData.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15 + index * 0.06,
                ease: "easeOut",
              }}
            >
              <BlogCard
                slug={post.slug}
                title={post.title}
                date={post.date}
                desc={post.desc}
                banner={post.banner}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-zinc-500 text-xs text-center py-4">
            Nenhum post encontrado.
          </p>
        )}
      </motion.div>
    </main>
  );
};

export default Blog;
