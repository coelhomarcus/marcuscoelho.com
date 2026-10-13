import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router";
import type { Page, SidebarLinkProps } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { AtSignIcon } from "@/components/icons/at-sign";
import { BookmarkIcon } from "@/components/icons/bookmark";
import { DownloadIcon } from "@/components/icons/download";
import { FileTextIcon } from "@/components/icons/file-text";
import { GithubIcon } from "@/components/icons/github";
import { FolderCodeIcon } from "@/components/icons/folder-code";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { MenuIcon } from "@/components/icons/menu";
import { PanelRightOpenIcon } from "@/components/icons/panel-right-open";
import { RocketIcon } from "@/components/icons/rocket";
import { MessageCircleIcon } from "@/components/icons/message-circle";
import {
  combineHoverProps,
  useAnimatedIcon,
} from "@/components/icons/use-animated-icon";
import { UserIcon } from "@/components/icons/user";
import { XIcon } from "@/components/icons/x";

const navigation: Page[] = [
  { name: "Sobre", href: "/", icon: UserIcon },
  { name: "Projetos", href: "/projects", icon: FolderCodeIcon },
  { name: "Blog", href: "/blog", icon: BookmarkIcon },
  { name: "Contato", href: "/contact", icon: MessageCircleIcon },
];

const socials: Page[] = [
  {
    name: "Email",
    href: "mailto:marcusrangelcoelho@gmail.com",
    icon: AtSignIcon,
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

const Sidebar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const panelIcon = useAnimatedIcon();
  const menuIcon = useAnimatedIcon();
  const closeIcon = useAnimatedIcon();

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
        aria-label="Abrir menu"
        onClick={() => setIsOpen(true)}
        {...combineHoverProps(panelIcon.hoverProps, menuIcon.hoverProps)}
      >
        <PanelRightOpenIcon
          ref={panelIcon.ref}
          size={16}
          className="hidden md:inline-flex"
        />
        <MenuIcon ref={menuIcon.ref} size={16} className="md:hidden" />
      </Button>

      {createPortal(
        <>
          {/* Overlay */}
          <div
            className={cn(
              "fixed inset-0 bg-black/50 backdrop-blur-sm z-99 transition-opacity duration-300",
              isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
            onClick={close}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <aside
            className={cn(
              "fixed right-0 top-0 z-100 flex h-full w-[85vw] sm:w-[350px] lg:w-[320px] flex-col bg-zinc-950 border-l border-zinc-800/80 transition-transform duration-300 ease-out",
              isOpen ? "translate-x-0" : "translate-x-full",
            )}
            role="dialog"
            aria-modal="true"
            data-drawer-content
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/profile.webp"
                    className="size-8 rounded-full"
                    alt="Marcus Coelho"
                  />
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-zinc-100">
                      Marcus Coelho
                    </p>
                    <p className="text-xs text-zinc-500">@coelhomarcus</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={close}
                  aria-label="Fechar menu"
                  className="text-muted-foreground"
                  {...closeIcon.hoverProps}
                >
                  <XIcon ref={closeIcon.ref} size={16} />
                </Button>
              </div>

              {/* Divider */}
              <div className="mx-4 my-3 border-t border-zinc-800/80" />

              {/* Navigation */}
              <nav
                className="flex-1 overflow-y-auto overflow-x-hidden px-2 scrollbar"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* Main nav */}
                <div className="mb-4">
                  <p className="px-2 mb-1 text-xs font-medium text-zinc-500">
                    Navegação
                  </p>
                  <div className="space-y-0.5">
                    {navigation.map((item) => (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        onClose={close}
                      />
                    ))}
                  </div>
                </div>

                {/* Socials */}
                <div className="mb-4">
                  <p className="px-2 mb-1 text-xs font-medium text-zinc-500">
                    Contato
                  </p>
                  <div className="space-y-0.5">
                    {socials.map((item) => (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        onClose={close}
                      />
                    ))}
                  </div>
                </div>

                {/* Others */}
                <div className="mb-4">
                  <p className="px-2 mb-1 text-xs font-medium text-zinc-500">
                    Outros
                  </p>
                  <div className="space-y-0.5">
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

              {/* Footer */}
              <div className="px-4 py-3 border-t border-zinc-800/80">
                <p className="text-xs text-zinc-600 text-center">
                  marcuscoelho.com
                </p>
              </div>
            </div>
          </aside>
        </>,
        document.body,
      )}
    </>
  );
};

function SidebarLink({ item, onClose }: SidebarLinkProps) {
  const Icon = item.icon;
  const icon = useAnimatedIcon();
  const trailing = useAnimatedIcon();
  const hoverProps = combineHoverProps(icon.hoverProps, trailing.hoverProps);

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
        className="flex h-8 items-center justify-between w-full px-2.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors group cursor-pointer"
        {...hoverProps}
      >
        {item.download ? (
          <>
            <div className="flex items-center gap-2">
              <Icon
                ref={icon.ref}
                size={16}
                className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <DownloadIcon
              ref={trailing.ref}
              size={14}
              className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
            />
          </>
        ) : (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full"
            onClick={onClose}
          >
            <div className="flex items-center gap-2">
              <Icon
                ref={icon.ref}
                size={16}
                className="text-zinc-500 group-hover:text-zinc-300 transition-colors"
              />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <ArrowUpRightIcon
              ref={trailing.ref}
              size={14}
              className="text-zinc-600 group-hover:text-zinc-400 transition-colors"
            />
          </a>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={item.href}
      onClick={onClose}
      {...hoverProps}
      className={({ isActive }) =>
        cn(
          "flex h-8 items-center gap-2 px-2.5 rounded-lg transition-colors group",
          isActive
            ? "bg-zinc-800/80 text-zinc-100"
            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            ref={icon.ref}
            size={16}
            className={cn(
              "transition-colors",
              isActive
                ? "text-zinc-100"
                : "text-zinc-500 group-hover:text-zinc-300",
            )}
          />
          <span className="text-sm font-medium">{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;
