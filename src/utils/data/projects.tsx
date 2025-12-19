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
    href: "https://dictionary-marcus.netlify.app/",
    name: "Dictionary",
    desc: "Dicionário Inglês moderno",
    tech: ["React", "Typescripot", "Tailwind"],
  },
  {
    href: "https://marketplace.visualstudio.com/items?itemName=coelhomarcus.bakaneo",
    name: "BakaNeo",
    desc: "Tema Dark para VS Code",
    tech: ["Theme"],
  },
  {
    href: "https://coelhomarcus.itch.io/mailman",
    name: "Mailman",
    desc: "Protótipo de jogo de terror retrô",
    tech: ["C#", "Unity", "Blender"],
  },
  {
    href: "https://blob-temp.vercel.app/",
    name: "Blob",
    desc: "Site de previsão meteorológica",
    tech: ["Next.js", "Tailwind", "API"],
  },
];
