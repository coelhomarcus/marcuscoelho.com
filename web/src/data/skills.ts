import type { ComponentType } from "react";
import {
  SiReact as ReactIcon,
  SiNextdotjs as NextJSIcon,
  SiTypescript as TypeScriptIcon,
  SiJavascript as JavaScriptIcon,
  SiTailwindcss as TailwindIcon,
  SiShadcnui as ShadcnIcon,
  SiVite as ViteIcon,
  SiNodedotjs as NodeIcon,
  SiBun as BunIcon,
  SiExpress as ExpressIcon,
  SiPython as PythonIcon,
  SiPostgresql as PostgreSQLIcon,
  SiDrizzle as DrizzleIcon,
  SiGit as GitIcon,
  SiGithub as GitHubIcon,
  SiDocker as DockerIcon,
  SiVercel as VercelIcon,
  SiClaude as ClaudeIcon,
  SiOpenai as OpenAIIcon,
} from "react-icons/si";
import { BiLogoFigma as FigmaIcon } from "react-icons/bi";
import { Rocket as DokployIcon } from "lucide-react";

type SkillType = {
  icon: ComponentType<{ className?: string }>;
  name: string;
  url: string;
};

export const arrSkills: SkillType[] = [
  // Frontend
  { icon: ReactIcon, name: "React", url: "https://react.dev" },
  { icon: NextJSIcon, name: "Next.js", url: "https://nextjs.org" },
  {
    icon: TypeScriptIcon,
    name: "TypeScript",
    url: "https://www.typescriptlang.org",
  },
  {
    icon: JavaScriptIcon,
    name: "JavaScript",
    url: "https://developer.mozilla.org/docs/Web/JavaScript",
  },
  { icon: TailwindIcon, name: "Tailwind CSS", url: "https://tailwindcss.com" },
  { icon: ShadcnIcon, name: "shadcn/ui", url: "https://ui.shadcn.com" },
  { icon: ViteIcon, name: "Vite", url: "https://vite.dev" },

  // Backend
  { icon: NodeIcon, name: "Node.js", url: "https://nodejs.org" },
  { icon: BunIcon, name: "Bun", url: "https://bun.sh" },
  { icon: ExpressIcon, name: "Express", url: "https://expressjs.com" },
  { icon: PythonIcon, name: "Python", url: "https://www.python.org" },
  {
    icon: PostgreSQLIcon,
    name: "PostgreSQL",
    url: "https://www.postgresql.org",
  },
  { icon: DrizzleIcon, name: "Drizzle ORM", url: "https://orm.drizzle.team" },

  // Tools
  { icon: GitIcon, name: "Git", url: "https://git-scm.com" },
  { icon: GitHubIcon, name: "GitHub", url: "https://github.com" },
  { icon: DockerIcon, name: "Docker", url: "https://www.docker.com" },
  { icon: VercelIcon, name: "Vercel", url: "https://vercel.com" },
  { icon: DokployIcon, name: "Dokploy", url: "https://dokploy.com" },
  { icon: FigmaIcon, name: "Figma", url: "https://www.figma.com" },

  // AI
  { icon: ClaudeIcon, name: "Claude", url: "https://claude.ai" },
  { icon: OpenAIIcon, name: "ChatGPT", url: "https://chatgpt.com" },
];
