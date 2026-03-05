import type { Work } from "@/types";
import type { IconType } from "react-icons";
import {
  SiReact as ReactIcon,
  SiTypescript as TypeScriptIcon,
  SiJavascript as JavaScriptIcon,
  SiTailwindcss as TailwindIcon,
  SiExpress as ExpressIcon,
  SiNodedotjs as NodeIcon,
  SiVite as ViteIcon,
  SiNextdotjs as NextJSIcon,
  SiPostgresql as PostgreSQLIcon,
  SiBun as BunIcon,
} from "react-icons/si";
import { BiLogoFigma as FigmaIcon } from "react-icons/bi";

export const arrWorks: Work[] = [
  {
    company: "PET-Saúde: Inovação e Saúde Digital no SUS",
    role: "Developer",
    duration: "2025 - Presente",
    logo: "/src/works/petsaude.webp",
    about: "",
  },
  {
    company:
      "Logibot AI: Plataforma de Auxilio no Ensino de Lógica de Programação",
    role: "Developer",
    duration: "2025 - Presente",
    logo: "/src/works/logibot.svg",
    about: "",
  },
  {
    company: "Exception Jr",
    role: "Full Stack Developer",
    duration: "02/07/2024 - 31/01/2026",
    logo: "/src/works/exceptionjr.webp",
    about:
      "Na Exception, atuei como dev fullstack, contribuindo para a criação de soluções web modernas. Minhas responsabilidades envolvem desde o desenvolvimento de interfaces responsivas até a implementação de lógicas de negócio e integrações com APIs. No dia a dia, utilizei tecnologias como React, Next.js, Node.js, TypeScript, JavaScript e Bancos SQL.",
  },
];

type SkillType = {
  icon: IconType;
  name: string;
};

export const arrSkills: SkillType[] = [
  { icon: ReactIcon, name: "React" },
  { icon: ViteIcon, name: "Vite" },
  { icon: NextJSIcon, name: "Next.js" },
  { icon: TypeScriptIcon, name: "TypeScript" },
  { icon: JavaScriptIcon, name: "JavaScript" },
  { icon: TailwindIcon, name: "Tailwind CSS" },
  { icon: ExpressIcon, name: "Express" },
  { icon: NodeIcon, name: "Node.js" },
  { icon: BunIcon, name: "Bun" },
  { icon: PostgreSQLIcon, name: "PostgreSQL" },
  { icon: FigmaIcon, name: "Figma" },
];
