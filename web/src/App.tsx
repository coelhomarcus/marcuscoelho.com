import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition/PageTransition";
import Footer from "./components/Footer/Footer";
import { SidebarProvider } from "./components/Sidebar/SidebarProvider";
import { useSidebar } from "./components/Sidebar/SidebarContext";
import { cn } from "./lib/utils";

import { Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";

import { lazy, Suspense } from "react";
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
const Certificates = lazy(() => import("@/pages/Certificates/Certificates"));

import About from "@/pages/About/About";
import Projects from "@/pages/Projects/Projects";
import Blog from "@/pages/Blog/Blog";
import PostPage from "@/pages/Blog/[slug]";
import Contact from "@/pages/Contact/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mobile scrolls the window, desktop scrolls the page card
    window.scrollTo({ top: 0, behavior: "smooth" });
    document
      .getElementById("app-scroll")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

const Shell = () => {
  const location = useLocation();
  const { isOpen } = useSidebar();

  return (
    // Page frame: darkens and makes room for the inset sidebar (md and up only)
    <div
      className={cn(
        "min-h-screen transition-[padding,background-color] duration-300 ease-out md:flex md:h-svh md:flex-col",
        isOpen && "md:bg-zinc-950 md:pr-(--sidebar-w)",
      )}
    >
      {/* The page itself becomes a rounded card while the sidebar is open */}
      <div
        id="app-scroll"
        className={cn(
          "min-h-screen bg-background transition-[margin,border-radius,box-shadow] duration-300 ease-out md:min-h-0 md:flex-1 scrollbar md:[scrollbar-gutter:stable_both-edges]",
          isOpen &&
            "md:m-2 md:mr-0 md:rounded-xl md:ring-1 md:ring-foreground/10",
        )}
      >
        <div className="@container mx-auto min-h-screen max-w-5xl md:min-h-full space-y-3 px-4 py-4 sm:px-6 sm:py-8">
          <ScrollToTop />
          <Header />
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Suspense fallback={null}>
                <Routes location={location}>
                  <Route path="/" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<PostPage />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </AnimatePresence>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <SidebarProvider>
    <Shell />
  </SidebarProvider>
);

export default App;
