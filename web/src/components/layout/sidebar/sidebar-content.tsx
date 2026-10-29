import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { XIcon } from "@/components/icons/x";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { Button } from "@/components/ui/button";
import { hobbies, navigation, others, socials } from "@/data/navigation";
import { SidebarLink, type SidebarSize } from "./sidebar-link";

interface SidebarContentProps {
  size?: SidebarSize;
  onClose: () => void;
  onNavigate?: () => void;
}

function Group({
  title,
  size,
  children,
}: {
  title: string;
  size: SidebarSize;
  children: ReactNode;
}) {
  return (
    <div className="mb-4">
      <p
        className={cn(
          "mb-1 px-2 font-medium text-zinc-500",
          size === "lg" ? "text-[13px]" : "text-xs",
        )}
      >
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function SidebarContent({
  size = "md",
  onClose,
  onNavigate,
}: SidebarContentProps) {
  const closeIcon = useAnimatedIcon();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 pt-3 pb-5">
        <div className="flex items-center gap-2.5">
          <img
            src="https://avatars.githubusercontent.com/u/106438089?v=4"
            className="size-8 rounded-full"
            alt="Marcus Coelho"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium text-zinc-100">Marcus Coelho</p>
            <p className="text-xs text-zinc-500">@coelhomarcus</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Fechar menu"
          className="text-muted-foreground"
          {...closeIcon.hoverProps}
        >
          <XIcon ref={closeIcon.ref} size={16} />
        </Button>
      </div>

      <nav
        className="scrollbar flex-1 overflow-y-auto overflow-x-hidden px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <Group title="Navegação" size={size}>
          {navigation.map((item) => (
            <SidebarLink
              key={item.name}
              item={item}
              size={size}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
        <Group title="Contato" size={size}>
          {socials.map((item) => (
            <SidebarLink
              key={item.name}
              item={item}
              size={size}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
        <Group title="Hobbies" size={size}>
          {hobbies.map((item) => (
            <SidebarLink
              key={item.name}
              item={item}
              size={size}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
        <Group title="Outros" size={size}>
          {others.map((item) => (
            <SidebarLink
              key={item.name}
              item={item}
              size={size}
              onNavigate={onNavigate}
            />
          ))}
        </Group>
      </nav>

      <div className="px-4 py-3">
        <p className="text-center text-xs text-zinc-600">marcuscoelho.com</p>
      </div>
    </div>
  );
}
