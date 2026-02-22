import type { Work } from "@/types";
import {
  type IconType,
  ReactIcon,
  TypeScriptIcon,
  JavaScriptIcon,
  TailwindIcon,
  ExpressIcon,
  NodeIcon,
  ViteIcon,
  NextJSIcon,
  PostgreSQLIcon,
  FigmaIcon,
  BunIcon,
} from "@/lib/icons";

export const arrWorks: Work[] = [
  {
    company: "PET-Saúde: Inovação e Saúde Digital no SUS",
    role: "Developer",
    duration: "2025 - Presente",
    logo: "/src/works/petsaude.webp",
    about:
      "Desenvolvedor no PET-Saúde/I&SD, programa em parceria entre a UNIFESSPA e o Ministério da Saúde, com foco na transformação digital do SUS, participando de iniciativas de inovação e desenvolvimento de soluções para a saúde pública.",
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
    duration: "2024 - Presente",
    logo: "/src/works/exceptionjr.webp",
    about:
      "Na Exception, atuo como desenvolvedor fullstack, contribuindo para a criação de soluções web modernas. Minhas responsabilidades envolvem desde o desenvolvimento de interfaces responsivas até a implementação de lógicas de negócio e integrações com APIs. No dia a dia, utilizo tecnologias como React, Next.js, Node.js, TypeScript, JavaScript, Bancos SQL e NoSQL para construir aplicações robustas, escaláveis e de fácil manutenção.",
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
