import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import path from "path";

// Posts live outside the web app, at the repo root
const postsDir = path.resolve(__dirname, "../posts");

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      enforce: "pre",
      ...mdx({
        providerImportSource: "@mdx-js/react",
        remarkPlugins: [remarkFrontmatter],
      }),
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@posts": postsDir,
    },
    // Compiled MDX imports these from posts/, which has no node_modules of its own
    dedupe: ["react", "react-dom", "@mdx-js/react"],
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), postsDir],
    },
  },
});
