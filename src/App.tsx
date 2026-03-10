import Header from "./components/Header/Header";
import PageTransition from "./components/PageTransition/PageTransition";
import Footer from "./components/Footer/Footer";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

const App = () => {
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-8 min-h-[100vh] space-y-3">
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
  );
};

export default App;
