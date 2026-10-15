import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { SidebarToggle } from "./sidebar-toggle";

const Sidebar = () => (
  <>
    <SidebarToggle />
    <DesktopSidebar />
    <MobileSidebar />
  </>
);

export default Sidebar;
