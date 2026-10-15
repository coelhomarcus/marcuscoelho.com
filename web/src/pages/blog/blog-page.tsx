import { Link } from "react-router";
import type { BlogFrontmatter } from "@/types/posts";
import { SectionRule } from "@/components/layout/stitch";
import { blogPosts } from "@/data/blog-posts";
import PageTitle from "@/components/page-title";
import { motion } from "motion/react";
import { cardTransition, cardVariants, fadeUp } from "@/lib/motion";
import { formatPostDate, slugify } from "@/lib/utils";

const DITHER_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect x='0' y='0' width='2' height='2' fill='black'/%3E%3Crect x='2' y='2' width='2' height='2' fill='black'/%3E%3C/svg%3E")`;

const MotionLink = motion.create(Link);

const BlogCard = ({
  title,
  date,
  tag,
  banner,
}: Omit<BlogFrontmatter, "file">) => {
  const slug = slugify(title);
  return (
    <MotionLink
      to={`/blog/${slug}`}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={cardTransition}
      className="group block overflow-hidden relative rounded-xl"
    >
      {banner && (
        <div
          className="absolute right-0 top-0 w-[50%] h-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, rgb(0 0 0 / 0.5) 50%, black)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, rgb(0 0 0 / 0.5) 50%, black)",
          }}
        >
          <img
            src={banner}
            alt="Banner"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-right select-none grayscale contrast-150 brightness-110 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-500"
          />
          <div
            className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundImage: DITHER_PATTERN,
              mixBlendMode: "multiply",
            }}
          />
        </div>
      )}
      <div className="relative flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono tracking-wide">
            {formatPostDate(date)}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500 font-medium">{tag}</span>
        </div>
        <h2 className="font-[Times_New_Roman] italic text-2xl sm:text-3xl text-zinc-100 group-hover:text-white transition-colors duration-200 leading-snug">
          {title}
        </h2>
      </div>
    </MotionLink>
  );
};

const BlogPage = () => {
  return (
    <main className="text-zinc-100 space-y-4">
      <PageTitle title="Blog" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-2">
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

      <SectionRule />

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="space-y-4"
      >
        {blogPosts.length > 0 ? (
          blogPosts.map((post, index) => (
            <motion.div
              key={post.file}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15 + index * 0.06,
                ease: "easeOut",
              }}
            >
              <BlogCard
                title={post.title}
                date={post.date}
                tag={post.tag}
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

export default BlogPage;
