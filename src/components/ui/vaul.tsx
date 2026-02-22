import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router";
import type { Page, SidebarLinkProps } from "@/types";

import {
  PersonIcon,
  ExternalLinkIcon,
  ResumeIcon,
  CloseIcon,
  BookmarkIcon,
  LayersIcon,
  RocketIcon,
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  SideBarOffIcon,
  SideBarIcon,
  DownloadIcon,
} from "@/lib/icons";

import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";

const navigation: Page[] = [
  { name: "Sobre", href: "/", icon: PersonIcon },
  { name: "Projetos", href: "/projects", icon: LayersIcon },
  { name: "Blog", href: "/blog", icon: BookmarkIcon },
  {
    name: "Curriculo",
    href: "https://docs.google.com/document/d/1wgOhwh-1YT-LRog9j1tvxzBVKfraoSzps1AiBGuSx9A/export?format=pdf",
    icon: ResumeIcon,
    external: true,
    download: true,
  },
];

const socials: Page[] = [
  {
    name: "Email",
    href: "mailto:marcusrangelcoelho@gmail.com",
    icon: MailIcon,
    external: true,
  },
  {
    name: "GitHub",
    href: "https://github.com/coelhomarcus",
    icon: GithubIcon,
    external: true,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/coelhomarcus/",
    icon: LinkedinIcon,
    external: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/coelhoincode",
    icon: TwitterIcon,
    external: true,
  },
];

const others: Page[] = [
  {
    name: "Certificados",
    href: "/certificates",
    icon: RocketIcon,
  },
];

const SidebarDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const preventScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-drawer-content]")) return;
      e.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        className="hover:*:text-foreground rounded-md transition-all cursor-pointer"
        aria-label="Abrir menu"
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <SideBarIcon className="w-5 h-5 hidden md:block text-muted-foreground" />
        ) : (
          <SideBarOffIcon className="w-5 h-5 hidden md:block text-muted-foreground" />
        )}
        <svg
          className="w-5 h-5 block md:hidden text-muted-foreground"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>

      {createPortal(
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/20 z-99 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={`bg-background text-foreground fixed right-0 top-0 z-100 flex h-full w-[90vw] flex-col border border-border sm:w-[70vw] lg:w-[400px] transition-transform duration-200 ease-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            data-drawer-content
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
                <ThemeToggle />
                <button
                  onClick={close}
                  className="p-2 hover:text-muted-foreground rounded-md transition-colors cursor-pointer"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              <nav
                className="flex flex-col space-y-8 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 scrollbar"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Navegação Principal */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Navegação
                  </h3>
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        onClose={close}
                      />
                    ))}
                  </div>
                </div>

                {/* Redes Sociais */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Contato
                  </h3>
                  <div className="space-y-1">
                    {socials.map((item) => (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        onClose={close}
                      />
                    ))}
                  </div>
                </div>

                {/* Outros Links */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Outros
                  </h3>
                  <div className="space-y-1">
                    {others.map((item) => (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        onClose={close}
                      />
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
};

function SidebarLink({ item, onClose }: SidebarLinkProps) {
  const Icon = item.icon;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.href;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  if (item.external) {
    return (
      <button
        onClick={item.download ? handleDownload : undefined}
        className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors group w-full text-left cursor-pointer"
      >
        {item.download ? (
          <>
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {item.name}
              </span>
            </div>
            <DownloadIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </>
        ) : (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full"
            onClick={onClose}
          >
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                {item.name}
              </span>
            </div>
            <ExternalLinkIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={item.href}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-md transition-colors group ${
          isActive
            ? "bg-muted text-foreground border"
            : "hover:bg-muted text-muted-foreground border border-transparent"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors ${
              isActive ? "text-foreground" : "group-hover:text-foreground"
            }`}
          >
            {item.name}
          </span>
        </>
      )}
    </NavLink>
  );
}

export default SidebarDrawer;
