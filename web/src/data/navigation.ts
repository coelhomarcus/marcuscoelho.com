import config from "@/data/config";
import type { NavItem } from "@/types";
import { AtSignIcon } from "@/components/icons/at-sign";
import { BookmarkIcon } from "@/components/icons/bookmark";
import { FileTextIcon } from "@/components/icons/file-text";
import { FolderCodeIcon } from "@/components/icons/folder-code";
import { GithubIcon } from "@/components/icons/github";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { MessageCircleIcon } from "@/components/icons/message-circle";
import { RocketIcon } from "@/components/icons/rocket";
import { UserIcon } from "@/components/icons/user";
import {
  AnimeIcon,
  CyberpunkIcon,
  GameIcon,
  MangaIcon,
} from "@/components/icons/media";

export const navigation: NavItem[] = [
  { name: "Sobre", href: "/", icon: UserIcon },
  { name: "Projetos", href: "/projects", icon: FolderCodeIcon },
  { name: "Blog", href: "/blog", icon: BookmarkIcon },
  { name: "Contato", href: "/contact", icon: MessageCircleIcon },
];

export const hobbies: NavItem[] = [
  { name: "Animes", href: "/hobbies/animes", icon: AnimeIcon },
  { name: "Mangá", href: "/hobbies/manga", icon: MangaIcon },
  { name: "Jogos", href: "/hobbies/jogos", icon: GameIcon },
  { name: "Cyberpunk", href: "/hobbies/cyberpunk", icon: CyberpunkIcon },
];

export const socials: NavItem[] = [
  {
    name: "Email",
    href: "mailto:marcusrangelcoelho@gmail.com",
    icon: AtSignIcon,
    external: true,
  },
  {
    name: "GitHub",
    href: `https://github.com/${config.GITHUB_USERNAME}`,
    icon: GithubIcon,
    external: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/coelhomarcus/",
    icon: LinkedinIcon,
    external: true,
  },
];

export const others: NavItem[] = [
  {
    name: "Curriculo",
    href: "https://docs.google.com/document/d/1wgOhwh-1YT-LRog9j1tvxzBVKfraoSzps1AiBGuSx9A/export?format=pdf",
    icon: FileTextIcon,
    external: true,
    download: true,
  },
  {
    name: "Certificados",
    href: "/certificates",
    icon: RocketIcon,
  },
];
