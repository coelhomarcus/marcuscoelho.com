import { Link, NavLink } from "react-router";
import type { HeaderLinkProps } from "@/types";

import SidebarDrawer from "@/components/Vaul/Vaul";

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

      <nav className="hidden md:flex items-center bg-zinc-800/60 rounded-full px-1.5 py-1 border border-zinc-700/50">
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
        <SidebarDrawer />
      </div>
    </header>
  );
};

function HeaderLink({ to, title }: HeaderLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1 rounded-full text-sm transition-all ${
          isActive
            ? "bg-zinc-100 text-black font-medium"
            : "text-zinc-500 hover:text-zinc-100"
        }`
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
