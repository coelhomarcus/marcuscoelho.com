import type { AnimatedIcon } from "@/components/icons/use-animated-icon";

export interface Project {
  name: string;
  desc: string;
  link?: string;
  linkPreview?: string;
  repo?: string;
  repoStars?: number;
  repoDownloads?: number;
  repoCreatedAt?: string;
  tech: string[];
  favicon?: string;
  images?: string[];
}

export interface WorkPosition {
  title: string;
  period: {
    start: string;
    end?: string;
  };
  employmentType?: string;
  about: string[];
  skills?: string[];
}

export interface Work {
  company: string;
  logo: string;
  website?: string;
  workMode: "Híbrido" | "Remoto" | "Presencial";
  positions: WorkPosition[];
}

export interface Certificate {
  href: string;
  course: string;
  teacher: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: AnimatedIcon;
  external?: boolean;
  download?: boolean;
}
