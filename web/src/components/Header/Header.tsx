import { Link, NavLink } from "react-router";
import type { HeaderLinkProps } from "@/types";
import { cn } from "@/lib/utils";

import Sidebar from "@/components/Sidebar/Sidebar";

import {
  RxGithubLogo as GithubIcon,
  RxLinkedinLogo as LinkedinIcon,
} from "react-icons/rx";
import { LuMail as MailIcon } from "react-icons/lu";

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
        <HeaderLink title="Sobre" to="/" />
        <HeaderLink title="Projetos" to="/projects" />
        <HeaderLink title="Blog" to="/blog" />
        <HeaderLink title="Contato" to="/contact" />
      </nav>

      <div className="flex items-center gap-1">
        <div className="hidden md:flex items-center gap-1 text-zinc-500">
          <SocialLink href="mailto:marcusrangelcoelho@gmail.com" label="Email">
            <MailIcon className="size-4" />
          </SocialLink>
          <SocialLink href="https://github.com/coelhomarcus" label="GitHub">
            <GithubIcon className="size-4" />
          </SocialLink>
          <SocialLink
            href="https://www.linkedin.com/in/coelhomarcus/"
            label="LinkedIn"
          >
            <LinkedinIcon className="size-4" />
          </SocialLink>
        </div>
        <Sidebar />
      </div>
    </header>
  );
};

function HeaderLink({ to, title }: HeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border border-transparent px-2.5 py-0.5 text-sm font-medium whitespace-nowrap transition-all",
          isActive
            ? "bg-zinc-100 text-black"
            : "text-foreground/60 hover:text-foreground",
        )
      }
    >
      {title}
    </NavLink>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-1.5 rounded-md hover:text-zinc-100 transition-colors"
    >
      {children}
    </a>
  );
}

export default Header;
