import type { AnimatedIcon } from "@/components/icons/use-animated-icon";

export interface Project {
  name: string;
  desc: string;
  link?: string;
  linkPreview?: string;
  repo?: string;
  repoStars?: number;
  repoCreatedAt?: string;
  tech: string[];
  favicon?: string;
  images?: string[];
}

export interface WorkPosition {
  title: string;
  period: {
    /** "YYYY-MM" or "YYYY" */
    start: string;
    /** "YYYY-MM" or "YYYY"; omit for ongoing roles */
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
  /** One entry per role held at this company, oldest first */
  positions: WorkPosition[];
}

export interface Certificate {
  href: string;
  course: string;
  teacher: string;
}

/** A link in the header, sidebar or footer */
export interface NavItem {
  name: string;
  href: string;
  icon: AnimatedIcon;
  external?: boolean;
  download?: boolean;
}
