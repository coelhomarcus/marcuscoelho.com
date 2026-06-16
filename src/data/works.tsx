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
  SiOpenjdk as JavaIcon,
  SiSpring as SpringIcon,
  SiPostgresql as PostgreSQLIcon,
  SiBun as BunIcon,
} from "react-icons/si";
import { BiLogoFigma as FigmaIcon } from "react-icons/bi";

export const arrWorks: Work[] = [
  {
    company: "PET-Saúde: Inovação e Saúde Digital no SUS",
    role: "Developer",
    duration: "2025 - Presente",
    logo: "/assets/works/petsaude.webp",
    about:
      "Projeto de inovação em parceria entre a UNIFESSPA e o Ministério da Saúde, voltado à transformação digital no SUS. A iniciativa tem como objetivo digitalizar e automatizar processos em unidades de saúde, melhorando a eficiência do atendimento, a organização interna dos funcionários e a experiência dos pacientes. No projeto, atuo em etapas como visitas técnicas ao posto de saúde, entrevistas com usuários, coleta e análise de requisitos, prototipação e desenvolvimento do sistema.",
  },
  {
    company:
      "Logibot AI: Plataforma de Auxilio no Ensino de Lógica de Programação",
    role: "Developer",
    duration: "2025 - Presente",
    logo: "/assets/works/logibot.svg",
    about:
      "Projeto de pesquisa e desenvolvimento de uma plataforma educacional voltada ao ensino de lógica de programação com o uso de inteligência artificial. A proposta é criar um ambiente interativo onde os alunos possam aprender, praticar e tirar dúvidas com o apoio de um chatbot inteligente. A plataforma também conta com dashboards para que professores acompanhem o progresso das turmas e de alunos individualmente, além de uma área de quizzes, permitindo que os docentes criem atividades avaliativas e acompanhem o desempenho dos estudantes.",
  },
  {
    company: "Exception Jr",
    role: "Full Stack Developer",
    duration: "02/07/2024 - 31/01/2026",
    logo: "/assets/works/exceptionjr.webp",
    about:
      "Na Exception Jr, atuei como desenvolvedor fullstack, contribuindo para a criação de soluções web modernas e funcionais. Minhas responsabilidades envolveram o desenvolvimento de interfaces responsivas, implementação de lógicas de negócio, integrações com APIs e uso de bancos de dados SQL. Durante minha atuação, participei do projeto Conecta Canaã, desenvolvido em parceria com a Prefeitura de Canaã dos Carajás, com foco na digitalização de serviços públicos. A solução permitia que a população registrasse ocorrências urbanas, como buracos em vias públicas, postes com falhas e outras irregularidades, aproximando os cidadãos da gestão municipal.",
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
  { icon: JavaIcon, name: "Java" },
  { icon: SpringIcon, name: "Spring" },
  { icon: NodeIcon, name: "Node.js" },
  { icon: BunIcon, name: "Bun" },
  { icon: ExpressIcon, name: "Express" },
  { icon: PostgreSQLIcon, name: "PostgreSQL" },
  { icon: FigmaIcon, name: "Figma" },
];
