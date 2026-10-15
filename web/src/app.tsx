import Header from "@/components/layout/header";
import PageTransition from "@/components/layout/page-transition";
import Footer from "@/components/layout/footer";
import { Rails, SectionRule } from "@/components/layout/stitch";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-provider";
import { useSidebar } from "@/components/layout/sidebar/sidebar-context";
import { cn } from "@/lib/utils";

import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";

import { lazy, Suspense } from "react";
const NotFoundPage = lazy(() => import("@/pages/not-found/not-found-page"));
const CertificatesPage = lazy(
  () => import("@/pages/certificates/certificates-page"),
);

import AboutPage from "@/pages/about/about-page";
import ProjectsPage from "@/pages/projects/projects-page";
import BlogPage from "@/pages/blog/blog-page";
import PostPage from "@/pages/blog/post-page";
import ContactPage from "@/pages/contact/contact-page";

const Shell = () => {
  const location = useLocation();
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-screen transition-[padding,background-color] duration-300 ease-out md:flex md:h-svh md:flex-col",
        isOpen && "md:bg-zinc-950 md:pr-(--sidebar-w)",
      )}
    >
      <div
        id="app-scroll"
        className={cn(
          "min-h-screen bg-background transition-[margin,border-radius,box-shadow] duration-300 ease-out md:min-h-0 md:flex-1 scrollbar md:[scrollbar-gutter:stable_both-edges]",
          isOpen &&
            "md:m-2 md:mr-0 md:rounded-xl md:ring-1 md:ring-foreground/10",
        )}
      >
        <div className="overflow-x-clip md:flex md:min-h-full md:flex-col">
          <div className="@container relative mx-auto min-h-screen max-w-3xl space-y-4 px-(--gutter) pb-4 [--gutter:--spacing(4)] md:min-h-0 md:w-full md:flex-1">
            <Rails />
            <ScrollToTop />
            <Header />
            <SectionRule />
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition key={location.pathname}>
                <Suspense fallback={null}>
                  <Routes location={location}>
                    <Route path="/" element={<AboutPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<PostPage />} />
                    <Route
                      path="/certificates"
                      element={<CertificatesPage />}
                    />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </PageTransition>
            </AnimatePresence>
            <SectionRule />
            <Footer />
          </div>
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
