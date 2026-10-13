import { createContext, useContext } from "react";

interface SidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
