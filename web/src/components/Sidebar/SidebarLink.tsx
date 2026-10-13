import { NavLink } from "react-router";
import type { Page } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { DownloadIcon } from "@/components/icons/download";
import {
  combineHoverProps,
  useAnimatedIcon,
} from "@/components/icons/use-animated-icon";

export type SidebarSize = "md" | "lg";

// "lg" is the touch-friendly size used by the mobile sheet
const sizes = {
  md: { row: "h-8 gap-2 px-2.5 text-sm", icon: 16, trailing: 14 },
  lg: { row: "h-11 gap-3 px-3 text-[15px]", icon: 20, trailing: 16 },
} as const;

interface SidebarLinkProps {
  item: Page;
  size?: SidebarSize;
  /** Called after a link is followed; the mobile sheet uses it to close. */
  onNavigate?: () => void;
}

export function SidebarLink({
  item,
  size = "md",
  onNavigate,
}: SidebarLinkProps) {
  const Icon = item.icon;
  const icon = useAnimatedIcon();
  const trailing = useAnimatedIcon();
  const hoverProps = combineHoverProps(icon.hoverProps, trailing.hoverProps);
  const s = sizes[size];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.href;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNavigate?.();
  };

  if (item.external) {
    return (
      <button
        onClick={item.download ? handleDownload : undefined}
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100",
          s.row,
        )}
        {...hoverProps}
      >
        {item.download ? (
          <>
            <div className="flex items-center gap-2">
              <Icon
                ref={icon.ref}
                size={s.icon}
                className="text-zinc-500 transition-colors group-hover:text-zinc-300"
              />
              <span className="font-medium">{item.name}</span>
            </div>
            <DownloadIcon
              ref={trailing.ref}
              size={s.trailing}
              className="text-zinc-600 transition-colors group-hover:text-zinc-400"
            />
          </>
        ) : (
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between"
            onClick={onNavigate}
          >
            <div className="flex items-center gap-2">
              <Icon
                ref={icon.ref}
                size={s.icon}
                className="text-zinc-500 transition-colors group-hover:text-zinc-300"
              />
              <span className="font-medium">{item.name}</span>
            </div>
            <ArrowUpRightIcon
              ref={trailing.ref}
              size={s.trailing}
              className="text-zinc-600 transition-colors group-hover:text-zinc-400"
            />
          </a>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      {...hoverProps}
      className={({ isActive }) =>
        cn(
          "group flex items-center rounded-lg transition-colors",
          s.row,
          isActive
            ? "bg-zinc-800/80 text-zinc-100"
            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            ref={icon.ref}
            size={s.icon}
            className={cn(
              "transition-colors",
              isActive
                ? "text-zinc-100"
                : "text-zinc-500 group-hover:text-zinc-300",
            )}
          />
          <span className="font-medium">{item.name}</span>
        </>
      )}
    </NavLink>
  );
}
