import { AnchorHTMLAttributes } from "react";
import type { IconType } from "react-icons";

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

export interface BlogPost {
  slug: string;
  title: string;
  desc: string;
  date: string;
  tags?: string[];
}

export interface Page {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  external?: boolean;
  download?: boolean;
}

export interface ProjectCardProps extends Omit<Project, "repo" | "tech"> {
  tech?: Project["tech"];
  onClick?: () => void;
}

export interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export interface PageTitleProps {
  title: string;
  suffix?: boolean;
}

export interface ContactLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  Icon: IconType;
  title: string;
  href: string;
}

export interface SimpleCardProps {
  href: string;
  name: string;
  desc: string;
}

export interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  desc: string;
  tags?: string[];
  banner?: string;
}

export interface SidebarLinkProps {
  item: Page;
  onClose: () => void;
}

export interface HeaderLinkProps {
  to: string;
  title: string;
}
export type HeadingProps = React.HTMLProps<HTMLHeadingElement>;

export interface PreComponentProps {
  children: React.ReactElement<{ className?: string; children: string }>;
  [key: string]: unknown;
}
