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

// Expects date in DD.MM.YYYY format
function sortByDateDesc(a, b) {
  const [da, ma, ya] = a.date.split(".").map(Number);
  const [db, mb, yb] = b.date.split(".").map(Number);
  return new Date(yb, mb - 1, db) - new Date(ya, ma - 1, da);
}

function generateBlogData() {
  const postsDir = path.join(srcDir, "Blog/posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const fm = extractFrontmatter(path.join(postsDir, file));
      if (!fm) return null;
      return {
        slug: fm.slug || path.basename(file, ".mdx"),
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
    "export const blogPostsData: BlogFrontmatter[] = [",
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
    path.resolve(srcDir, "../data/blogPostsData.ts"),
    lines.join("\n"),
  );
  console.log(`Blog: generated ${posts.length} post(s).`);
}

function generateDiaryData() {
  const postsDir = path.join(srcDir, "Diary/posts");
  if (!fs.existsSync(postsDir)) return;

  const folders = fs
    .readdirSync(postsDir)
    .filter((f) => fs.statSync(path.join(postsDir, f)).isDirectory());

  const posts = folders
    .flatMap((folder) => {
      const folderPath = path.join(postsDir, folder);
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith(".mdx"));

      return files.map((file) => {
        const fm = extractFrontmatter(path.join(folderPath, file));
        if (!fm) return null;
        const day = path.basename(file, ".mdx");
        const [month, year] = folder.split("-");
        const slug = `${day}-${month}-${year}`;
        const date = `${day}.${month}.${year}`;
        return {
          slug,
          date,
          preview: fm.preview || undefined,
          dayWas: fm.dayWas || "normal",
          background: fm.background || undefined,
        };
      });
    })
    .filter(Boolean)
    .sort(sortByDateDesc);

  const lines = [
    'import type { DiaryFrontmatter } from "@/types/posts";',
    "",
    "export const diaryPostsData: DiaryFrontmatter[] = [",
  ];

  for (const p of posts) {
    lines.push("  {");
    lines.push(`    slug: ${JSON.stringify(p.slug)},`);
    lines.push(`    date: ${JSON.stringify(p.date)},`);
    if (p.preview) lines.push(`    preview: ${JSON.stringify(p.preview)},`);
    lines.push(`    dayWas: ${JSON.stringify(p.dayWas)},`);
    if (p.background)
      lines.push(`    background: ${JSON.stringify(p.background)},`);
    lines.push("  },");
  }

  lines.push("];", "");
  fs.writeFileSync(
    path.join(srcDir, "Diary/diaryPostsData.ts"),
    lines.join("\n"),
  );
  console.log(`Diary: generated ${posts.length} entry(ies).`);
}

generateBlogData();
generateDiaryData();
console.log("Posts data generated!");
