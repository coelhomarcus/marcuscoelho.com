import Header from "./components/Header/Header";
import About from "./pages/About/About";
import Projects from "./pages/Projects/Projects";
import Blog from "./pages/Blog/Blog";
import PostPage from "./pages/Blog/[slug]";
import Certificates from "./pages/Certificates/Certificates";
import Contact from "./pages/Contact/Contact";
import PageTransition from "./components/PageTransition/PageTransition";

import { Routes, Route, useLocation } from "react-router";
import NotFound from "./components/NotFound/NotFound";
import Footer from "./components/Footer/Footer";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";

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
    <div className="px-4 py-4 sm:px-6 sm:py-8 min-h-[100vh] space-y-3 max-w-[900px] mx-auto">
      <ScrollToTop />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;
