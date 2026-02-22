import { Link } from "react-router";
import type { BlogCardProps } from "@/types";
import { arrBlog } from "./posts/_posts";
import PageTitle from "@/components/PageTitle/PageTitle";

const BlogCard = ({ slug, title, date, desc }: BlogCardProps) => {
  return (
    <div className="group block transition-all duration-100 cursor-auto">
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between">
          <div className="flex gap-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="font-medium cursor-default w-[70px] font-mono">
                {date}
              </span>
            </div>
            <Link
              to={`/blog/${slug}`}
              key={slug}
              className="text-base font-normal text-muted-foreground underline decoration-muted-foreground hover:decoration-foreground hover:text-foreground tracking-wide cursor-pointer"
            >
              {title}
            </Link>
          </div>
          <div className="items-center text-xs text-muted-foreground hidden sm:flex">
            <span className="font-medium">{desc}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Blog = () => {
  return (
    <div className="text-foreground">
      <PageTitle title="Blog" suffix />
      <h1 className="text-xl font-semibold mb-2">Blog</h1>
      <p className="text-muted-foreground text-sm mb-4">
        Meus pensamentos e anotações.
      </p>
      <div className="space-y-4">
        {arrBlog.length > 0 ? (
          arrBlog.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              desc={post.desc}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-xs text-center py-4">
            Nenhum post encontrado.
          </p>
        )}
      </div>
    </div>
  );
};

export default Blog;
