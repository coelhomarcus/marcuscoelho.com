import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SidebarContent } from "./sidebar-content";
import { useSidebar } from "./sidebar-context";

const CLOSE_DISTANCE = 90;
const CLOSE_VELOCITY = 500;

export function MobileSidebar() {
  const { isOpen, close } = useSidebar();

  return createPortal(
    <div className="md:hidden">
      <div
        className={cn(
          "fixed inset-0 z-99 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden="true"
      />

      <motion.aside
        aria-label="Menu"
        inert={!isOpen}
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 420, damping: 42 }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.6 }}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.x > CLOSE_DISTANCE || velocity.x > CLOSE_VELOCITY) close();
        }}
        className="fixed top-0 right-0 z-100 h-dvh w-[85vw] max-w-sm touch-pan-y rounded-l-2xl bg-popover pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] ring-1 ring-foreground/10"
      >
        <span
          aria-hidden
          className="absolute top-1/2 left-1.5 h-10 w-1 -translate-y-1/2 rounded-full bg-zinc-700"
        />
        <SidebarContent size="lg" onClose={close} onNavigate={close} />
      </motion.aside>
    </div>,
    document.body,
  );
}
