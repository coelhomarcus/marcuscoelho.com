import { MenuIcon } from "@/components/icons/menu";
import { PanelRightOpenIcon } from "@/components/icons/panel-right-open";
import {
  combineHoverProps,
  useAnimatedIcon,
} from "@/components/icons/use-animated-icon";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function SidebarToggle() {
  const { isOpen, open, close } = useSidebar();
  const panelIcon = useAnimatedIcon();
  const menuIcon = useAnimatedIcon();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
      aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      aria-expanded={isOpen}
      onClick={isOpen ? close : open}
      {...combineHoverProps(panelIcon.hoverProps, menuIcon.hoverProps)}
    >
      <PanelRightOpenIcon
        ref={panelIcon.ref}
        size={16}
        className="hidden md:inline-flex"
      />
      <MenuIcon ref={menuIcon.ref} size={16} className="md:hidden" />
    </Button>
  );
}
