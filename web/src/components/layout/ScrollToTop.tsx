import { useEffect } from "react";
import { useLocation } from "react-router";

// Back to the top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mobile scrolls the window, desktop scrolls the page card
    window.scrollTo({ top: 0, behavior: "smooth" });
    document
      .getElementById("app-scroll")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
