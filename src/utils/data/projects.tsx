import type { Project } from "@/types";

export const arrProjects: Project[] = [
  {
    href: "https://studio-2n.blipe.cloud/",
    linkPreview: "studio-2n.blipe.cloud",
    name: "Studio 2N",
    desc: "Projeto Real de Agendamentos para uma Barbearia Local",
    tech: ["React", "Typescript", "Tailwind", "Express", "WAHA"],
    img: "./src/projects/2n-studio.webp",
  },
  {
    href: "https://crop.marcuscoelho.com",
    linkPreview: "crop.marcuscoelho.com",
    name: "Crop",
    desc: "Site para fazer Recortes em Imagens e Gifs",
    tech: ["React", "Typescript", "Tailwind", "Node", "Express", "Mono Repo"],
    favicon: "https://crop.marcuscoelho.com/favicon.ico",
    img: "./src/projects/crop.webp",
  },
  {
    href: "https://dictionary.marcuscoelho.com/",
    linkPreview: "dictionary.marcuscoelho.com",
    name: "Dictionary",
    desc: "Dicionário Inglês - Simples & Moderno",
    tech: ["React", "Typescript", "Tailwind"],
    favicon: "https://dictionary.marcuscoelho.com/logo.svg",
    img: "./src/projects/dictionary.webp",
  },
  {
    href: "https://marcuscoelho.com/",
    linkPreview: "marcuscoelho.com 📌",
    name: "Portfolio",
    desc: "Meu Portfólio Pessoal",
    tech: ["React", "Typescript", "Tailwind", "MDX"],
    favicon: "https://marcuscoelho.com/src/icons/favicon.ico",
    img: "./src/projects/portfolio.webp",
  },
  {
    href: "https://www.youtube.com/shorts/0fSoHjAadas",
    linkPreview: "Video Preview",
    name: "SOS Queimadas",
    desc: "Aplicativo IOS para conscientização e prevenção de queimadas",
    tech: ["Swift", "MapKit", "IoT", "API"],
    img: "./src/projects/sosqueimadas.webp",
  },
  {
    href: "https://old.marcuscoelho.com/",
    name: "Portfolio Antigo",
    linkPreview: "old.marcuscoelho.com",
    desc: "Meu primeiro portfolio feito em React",
    tech: ["React", "JSX", "CSS"],
    favicon: "https://old.marcuscoelho.com/favicon/favicon.ico",
    img: "./src/projects/old-portfolio.webp",
  },
];

export const arrSideProjects: Project[] = [
  {
    href: "https://github.com/coelhomarcus/simplemedia-backend",
    name: "Simple Media - Backend",
    desc: "Backend de uma plataforma simples de videos com autenticação, comunidade e mais...",
    tech: ["Bun", "ElysiaJS", "Drizzle", "BetterAuth", "Zod"],
    favicon: "https://cdn-icons-png.flaticon.com/256/679/679821.png",
  },
  {
    href: "https://blob-temp.vercel.app/",
    name: "Blob",
    linkPreview: "blob-temp.vercel.app",
    desc: "Site de previsão meteorológica, feito para um desafio de um dia na SIAPESQ",
    tech: ["Next.js", "Tailwind", "API"],
    favicon: "https://blob-temp.vercel.app/blob.png ",
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
    desc: "Protótipo de jogo retrô de terror",
    tech: ["C#", "Unity", "Blender"],
    favicon:
      "https://img.itch.zone/aW1nLzE4NjA1Mjg2LnBuZw==/32x32%23/LXf4e4.png",
  },
];
