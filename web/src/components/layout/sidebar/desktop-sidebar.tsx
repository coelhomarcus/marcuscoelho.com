import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { SidebarContent } from "./sidebar-content";
import { useSidebar } from "./sidebar-context";

export function DesktopSidebar() {
  const { isOpen, close } = useSidebar();

  return createPortal(
    <aside
      aria-label="Menu"
      inert={!isOpen}
      className={cn(
        "fixed top-0 right-0 z-40 hidden h-full w-(--sidebar-w) p-2 transition-transform duration-300 ease-out md:block",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <SidebarContent onClose={close} />
    </aside>,
    document.body,
  );
}
