import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SidebarContext } from "./sidebar-context";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (window.matchMedia("(max-width: 767px)").matches) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
