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

type SkillType = {
  icon: IconType;
  name: string;
};

export const arrSkills: SkillType[] = [
  // Frontend
  { icon: ReactIcon, name: "React" },
  { icon: NextJSIcon, name: "Next.js" },
  { icon: TypeScriptIcon, name: "TypeScript" },
  { icon: JavaScriptIcon, name: "JavaScript" },
  { icon: TailwindIcon, name: "Tailwind CSS" },
  { icon: ViteIcon, name: "Vite" },

  // Backend
  { icon: NodeIcon, name: "Node.js" },
  { icon: BunIcon, name: "Bun" },
  { icon: ExpressIcon, name: "Express" },
  { icon: JavaIcon, name: "Java" },
  { icon: SpringIcon, name: "Spring" },
  { icon: PostgreSQLIcon, name: "PostgreSQL" },

  // Design
  { icon: FigmaIcon, name: "Figma" },
];
