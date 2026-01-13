import type { Project } from "@/types";

export const arrProjects: Project[] = [
  // {
  //   href: "https://cafuntalk.com",
  //   name: "CafunTalk",
  //   desc: "Bate-papo moderno, sem distrações, privado e sem histórico",
  //   tech: ["React", "Typescript", "Tailwind", "Express"],
  //   img: "./src/projects/cafuntalk.webp",
  // },
  {
    href: "https://www.youtube.com/shorts/0fSoHjAadas",
    name: "SOS Queimadas",
    desc: "Aplicativo IOS para conscientização e prevenção de queimadas",
    tech: ["Swift", "MapKit", "IoT", "API"],
    img: "./src/projects/sosqueimadas.webp",
  },
];

export const arrSideProjects: Project[] = [
  {
    href: "https://dictionary.marcuscoelho.com/",
    name: "Dictionary",
    desc: "Dicionário Inglês - Simples & Moderno",
    tech: ["React", "Typescripot", "Tailwind"],
    favicon: "https://dictionary-marcus.netlify.app/logo.svg",
  },
  {
    href: "https://github.com/coelhomarcus/lunebox-backend",
    name: "LuneBox - Backend",
    desc: "Backend de uma plataforma simples de videos com autenticação, comunidade e mais...",
    tech: ["Bun", "ElysiaJS", "Drizzle", "BetterAuth", "Zod"],
    favicon: "https://cdn-icons-png.flaticon.com/256/679/679821.png",
  },
  {
    href: "https://marketplace.visualstudio.com/items?itemName=coelhomarcus.bakaneo",
    name: "BakaNeo",
    desc: "Tema Dark para VS Code",
    tech: ["Theme"],
    favicon:
      "https://coelhomarcus.gallerycdn.vsassets.io/extensions/coelhomarcus/bakaneo/1.1.6/1744053185368/Microsoft.VisualStudio.Services.Icons.Default",
  },
  {
    href: "https://coelhomarcus.itch.io/mailman",
    name: "Mailman",
    desc: "Protótipo de jogo de terror retrô",
    tech: ["C#", "Unity", "Blender"],
    favicon:
      "https://img.itch.zone/aW1nLzE4NjA1Mjg2LnBuZw==/32x32%23/LXf4e4.png",
  },
  {
    href: "https://blob-temp.vercel.app/",
    name: "Blob",
    desc: "Site de previsão meteorológica",
    tech: ["Next.js", "Tailwind", "API"],
    favicon: "https://blob-temp.vercel.app/blob.png ",
  },
];
