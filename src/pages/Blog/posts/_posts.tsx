import type { BlogPost } from "@/types";

function parseFrontmatter(content: string) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (!normalized.startsWith("---\n")) {
    return { data: {} as Record<string, string>, content: normalized };
  }
  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {} as Record<string, string>, content: normalized };
  }

  const frontmatterText = normalized.slice(4, endIndex);
  const remainingContent = normalized.slice(endIndex + 5).trim();

  const data: Record<string, string> = {};
  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      data[key] = value;
    }
  });

  return { data, content: remainingContent };
}

const raw = import.meta.glob("./*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
});

const mdxModules = import.meta.glob("./*.mdx");

function extractSlug(path: string) {
  const file = path.split("/").pop() || "";
  return file.replace(".mdx", "");
}

function getAllBlogPosts(): BlogPost[] {
  return Object.entries(raw)
    .map(([path, content]) => {
      const slug = extractSlug(path);
      const { data } = parseFrontmatter(content as string);

      return {
        slug,
        title: data.title || slug,
        desc: data.desc || "",
        date: data.date || "",
        tags: data.tags
          ? data.tags.split(",").map((tag) => tag.trim())
          : undefined,
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date.split(".").reverse().join("-"));
      const dateB = new Date(b.date.split(".").reverse().join("-"));
      return dateB.getTime() - dateA.getTime();
    });
}

export const arrBlog: BlogPost[] = getAllBlogPosts();

export function loadPost(slug: string) {
  const key = Object.keys(mdxModules).find((k) => k.endsWith(`/${slug}.mdx`));
  if (!key) return null;
  return mdxModules[key];
}
