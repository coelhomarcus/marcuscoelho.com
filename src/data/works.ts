import type { Work } from "@/types";

// https://chanhdai.com/components/work-experience-component

export const arrWorks: Work[] = [
  {
    company:
      "Logibot AI: Plataforma de Auxilio no Ensino de Lógica de Programação",
    logo: "/assets/works/logibot.svg",
    positions: [
      {
        title: "Full Stack Developer",
        period: { start: "2025-09" },
        about: [
          "Reformulei todo o front-end da plataforma, priorizando responsividade e experiência do usuário",
          "Desenvolvi insights de desempenho do aluno gerados por IA para apoiar o professor",
          "Implementei RAG para alinhar o chatbot ao conteúdo do curso, com upload de materiais pelo professor",
          "Implementei as arquiteturas Context RAG, Self RAG e Hybrid RAG",
          "Criei a geração de quizzes com IA e RAG",
          "Otimizei a performance do frontend, reduzindo dependências",
        ],
        skills: [
          "React",
          "TypeScript",
          "Tailwind CSS",
          "TanStack Query",
          "Node.js",
          "Express",
          "Drizzle ORM",
          "PostgreSQL",
          "Python",
          "FastAPI",
          "ChromaDB",
          "Agents",
          "Context RAG",
          "Self RAG",
          "Hybrid RAG",
        ],
      },
    ],
  },
  {
    company: "PET-Saúde: Inovação e Saúde Digital no SUS",
    logo: "/assets/works/petsaude.webp",
    positions: [
      {
        title: "Front-end Developer",
        period: { start: "2025-09" },
        about: [
          "Projeto de inovação em parceria entre a UNIFESSPA e o Ministério da Saúde, focado em transformação digital no SUS",
          "Digitalização e automação de processos em unidades de saúde, melhorando o atendimento e a organização interna",
          "Visitas técnicas, entrevistas com usuários e coleta/análise de requisitos",
          "Prototipação e desenvolvimento do sistema",
        ],
        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "React Hook Form",
          "Zod",
          "Leaflet",
          "Figma",
        ],
      },
    ],
  },
  {
    company: "Exception Jr",
    logo: "/assets/works/exceptionjr.webp",
    positions: [
      {
        title: "Full Stack Developer",
        period: { start: "2024-07", end: "2026-01" },
        about: [
          "Desenvolvimento fullstack de soluções web modernas e funcionais",
          "Interfaces responsivas, lógicas de negócio, integrações com APIs e bancos SQL",
          "Participação no projeto Conecta Canaã, em parceria com a Prefeitura de Canaã dos Carajás",
          "Sistema de registro de ocorrências urbanas pela população, aproximando cidadãos da gestão municipal",
        ],
        skills: [
          "React",
          "TypeScript",
          "JavaScript",
          "Node.js",
          "Express",
          "PostgreSQL",
          "MongoDB",
          "Tailwind CSS",
          "Figma",
        ],
      },
    ],
  },
];
