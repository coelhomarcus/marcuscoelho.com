import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router";
import type { Page, SidebarLinkProps } from "@/types";

import {
  RxPerson as PersonIcon,
  RxArrowTopRight as ExternalLinkIcon,
  RxReader as ResumeIcon,
  RxCross1 as CloseIcon,
  RxBookmark as BookmarkIcon,
  RxLayers as LayersIcon,
  RxRocket as RocketIcon,
  RxGithubLogo as GithubIcon,
  RxLinkedinLogo as LinkedinIcon,
  RxDownload as DownloadIcon,
} from "react-icons/rx";
import { LuMail as MailIcon } from "react-icons/lu";
import {
  VscLayoutSidebarRightOff as SideBarOffIcon,
  VscLayoutSidebarRight as SideBarIcon,
} from "react-icons/vsc";

const navigation: Page[] = [
  { name: "Sobre", href: "/", icon: PersonIcon },
  { name: "Projetos", href: "/projects", icon: LayersIcon },
  { name: "Blog", href: "/blog", icon: BookmarkIcon },
  { name: "Contato", href: "/contact", icon: MailIcon },
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
        className="hover:*:text-zinc-100 rounded-md transition-all cursor-pointer"
        aria-label="Abrir menu"
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <SideBarIcon className="w-5 h-5 hidden md:block text-zinc-500" />
        ) : (
          <SideBarOffIcon className="w-5 h-5 hidden md:block text-zinc-500" />
        )}
        <svg
          className="w-5 h-5 block md:hidden text-zinc-500"
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
          <div
            className={`fixed inset-0 bg-black/20 z-99 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={close}
            aria-hidden="true"
          />

          <div
            className={`bg-black text-zinc-100 fixed right-0 top-0 z-100 flex h-full w-[90vw] flex-col border-l border-zinc-900 sm:w-[70vw] lg:w-[400px] transition-transform duration-200 ease-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            data-drawer-content
          >
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex justify-end items-center p-6 pb-4 flex-shrink-0">
                <button
                  onClick={close}
                  className="p-2 hover:text-zinc-500 rounded-md transition-colors cursor-pointer"
                >
                  <CloseIcon className="size-5" />
                </button>
              </div>

              <nav
                className="flex flex-col space-y-8 flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 scrollbar"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
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

                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
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

                <div>
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
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
        className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-800 transition-colors group w-full text-left cursor-pointer"
      >
        {item.download ? (
          <>
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
              <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-100 transition-colors">
                {item.name}
              </span>
            </div>
            <DownloadIcon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
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
              <Icon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
              <span className="text-sm text-zinc-500 font-medium group-hover:text-zinc-100 transition-colors">
                {item.name}
              </span>
            </div>
            <ExternalLinkIcon className="w-5 h-5 text-zinc-500 group-hover:text-zinc-100 transition-colors" />
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
            ? "bg-zinc-800 text-zinc-100 border"
            : "hover:bg-zinc-800 text-zinc-500 border border-transparent"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`w-5 h-5 transition-colors ${
              isActive
                ? "text-zinc-100"
                : "text-zinc-500 group-hover:text-zinc-100"
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors ${
              isActive ? "text-zinc-100" : "group-hover:text-zinc-100"
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
