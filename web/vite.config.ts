import { defineConfig, loadEnv, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import path from "path";

// Posts live outside the web app, at the repo root
const postsDir = path.resolve(__dirname, "../posts");

const PRODUCTION_API = "https://api.marcuscoelho.com";

export default defineConfig(({ mode }) => {
  const apiTarget =
    loadEnv(mode, process.cwd(), "").API_PROXY_TARGET || PRODUCTION_API;
  const proxyPath = apiTarget === PRODUCTION_API ? "/api/github" : "/api";

  return {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-icons")) {
                return "react-icons";
              }
              if (id.includes("react-syntax-highlighter")) {
                return "syntax-highlighter";
              }
              return "vendor";
            }
            if (id.startsWith(postsDir) && id.endsWith(".mdx")) {
              const fileName = id.split("/").pop()?.replace(".mdx", "") || "post";
              return `posts/${fileName}`;
            }
          },
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name && chunkInfo.name.startsWith("posts/")) {
              const postName = chunkInfo.name.replace("posts/", "");
              return `assets/posts/${postName}-[hash].js`;
            }
            return "assets/[name]-[hash].js";
          },
        },
      },
    },
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
        [proxyPath]: {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (url: string) => url.replace(/^\/api/, ""),
        },
      },
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), postsDir],
      },
    },
  };
});
