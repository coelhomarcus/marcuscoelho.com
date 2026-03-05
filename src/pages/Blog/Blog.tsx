import { Link } from "react-router";
import type { BlogCardProps } from "@/types";
import { blogPostsData } from "./blogPostsData";
import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const BlogCard = ({ slug, title, date, desc }: BlogCardProps) => {
  return (
    <div className="group block transition-all duration-100 cursor-auto">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between">
          <div className="flex gap-6">
            <div className="flex items-center text-xs text-zinc-500">
              <span className="font-medium cursor-default w-[70px] font-mono">
                {date}
              </span>
            </div>
            <Link
              to={`/blog/${slug}`}
              key={slug}
              className="text-base font-normal text-zinc-400 underline decoration-zinc-500 hover:decoration-zinc-100 hover:text-zinc-100 tracking-wide cursor-pointer"
            >
              {title}
            </Link>
          </div>
          <div className="items-center text-xs text-zinc-500 hidden sm:flex">
            <span className="font-medium">{desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <main className="text-zinc-100 space-y-6">
      <PageTitle title="Blog" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Blog</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Meus pensamentos e anotações.
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
