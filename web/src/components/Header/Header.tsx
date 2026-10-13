import { Link, NavLink } from "react-router";
import type { HeaderLinkProps } from "@/types";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/Sidebar/Sidebar";

import { SocialLink, socialLinks } from "@/components/SocialLink/SocialLink";
import { BookmarkIcon } from "@/components/icons/bookmark";
import { FolderCodeIcon } from "@/components/icons/folder-code";
import { MessageCircleIcon } from "@/components/icons/message-circle";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { UserIcon } from "@/components/icons/user";

const Header = () => {
  return (
    <header className="flex justify-between items-center pt-4 pb-2">
      <Link
        to="/"
        className="text-zinc-100 font-medium text-sm hover:opacity-80 transition-opacity flex items-center rounded-sm"
      >
        <img src="/assets/profile.webp" className="size-5 mr-2 inline" /> Marcus
        Coelho
      </Link>

      <nav className="hidden md:inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground">
        <HeaderLink title="Sobre" to="/" icon={UserIcon} />
        <HeaderLink title="Projetos" to="/projects" icon={FolderCodeIcon} />
        <HeaderLink title="Blog" to="/blog" icon={BookmarkIcon} />
        <HeaderLink title="Contato" to="/contact" icon={MessageCircleIcon} />
      </nav>

      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1 text-zinc-500">
          {socialLinks.map((link) => (
            <SocialLink key={link.label} {...link} />
          ))}
        </div>
        <Sidebar />
      </div>
    </header>
  );
};

function HeaderLink({ to, title, icon: Icon }: HeaderLinkProps) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <NavLink
      to={to}
      {...hoverProps}
      className={({ isActive }) =>
        cn(
          "inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md border border-transparent pr-2.5 pl-2 py-0.5 text-sm font-medium whitespace-nowrap transition-all",
          isActive
            ? "bg-zinc-100 text-black"
            : "text-foreground/60 hover:text-foreground",
        )
      }
    >
      <Icon ref={ref} size={14} />
      {title}
    </NavLink>
  );
}

export default Header;
