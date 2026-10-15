import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "../src/pages");

function extractFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return fm;
}

function sortByDateDesc(a, b) {
  const [da, ma, ya] = a.date.split(".").map(Number);
  const [db, mb, yb] = b.date.split(".").map(Number);
  return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
}

function generateBlogData() {
  const postsDir = path.resolve(__dirname, "../../posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const fm = extractFrontmatter(path.join(postsDir, file));
      if (!fm) return null;
      return {
        slug: path.basename(file, ".mdx"),
        title: fm.title || "",
        date: fm.date || "",
        desc: fm.desc || "",
        tags: fm.tags || undefined,
        banner: fm.banner || undefined,
      };
    })
    .filter(Boolean)
    .sort(sortByDateDesc);

  const lines = [
    'import type { BlogFrontmatter } from "@/types/posts";',
    "",
    "export const blogPosts: BlogFrontmatter[] = [",
  ];

  for (const p of posts) {
    lines.push("  {");
    lines.push(`    slug: ${JSON.stringify(p.slug)},`);
    lines.push(`    title: ${JSON.stringify(p.title)},`);
    lines.push(`    date: ${JSON.stringify(p.date)},`);
    lines.push(`    desc: ${JSON.stringify(p.desc)},`);
    if (p.tags)
      lines.push(
        `    tags: ${JSON.stringify(p.tags.split(",").map((t) => t.trim()))},`,
      );
    if (p.banner) lines.push(`    banner: ${JSON.stringify(p.banner)},`);
    lines.push("  },");
  }

  lines.push("];", "");
  fs.writeFileSync(
    path.resolve(srcDir, "../data/blog-posts.ts"),
    lines.join("\n"),
  );
  console.log(`Blog: generated ${posts.length} post(s).`);
}

generateBlogData();
console.log("Posts data generated!");
