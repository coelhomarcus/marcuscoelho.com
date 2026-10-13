import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { SidebarToggle } from "./sidebar-toggle";

/** The toggle plus both versions; CSS decides which one is visible. */
const Sidebar = () => (
  <>
    <SidebarToggle />
    <DesktopSidebar />
    <MobileSidebar />
  </>
);

export default Sidebar;
