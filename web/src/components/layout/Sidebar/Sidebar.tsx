import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { SidebarToggle } from "./SidebarToggle";

/** The toggle plus both versions; CSS decides which one is visible. */
const Sidebar = () => (
  <>
    <SidebarToggle />
    <DesktopSidebar />
    <MobileSidebar />
  </>
);

export default Sidebar;
