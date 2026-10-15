import { useState } from "react";
import PageTitle from "@/components/page-title";
import { motion } from "motion/react";

import HeroSection from "./components/hero-section";
import WorkExperience from "./components/work-experience/work-experience";
import Skills from "./components/skills";
import GitHubGraph from "./components/github-graph";
import OpenSourceContributions from "./components/open-source-contributions";
import ProjectsMarquee from "./components/projects-marquee";
import { SectionRule } from "@/components/layout/stitch";
import ProjectModal from "@/components/project-modal";
import type { Project } from "@/types";
import { fadeUp } from "@/lib/motion";

const AboutPage = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <main className="text-zinc-100 space-y-8">
      <PageTitle title="Marcus Coelho" />

      <motion.div {...fadeUp}>
        <HeroSection />
      </motion.div>

      <SectionRule />

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <Skills />
      </motion.div>

      <SectionRule />

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <ProjectsMarquee onProjectClick={setSelected} />
      </motion.div>

      <SectionRule />

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.15 }}
      >
        <WorkExperience />
      </motion.div>

      <SectionRule />

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.25 }}
      >
        <GitHubGraph />
      </motion.div>

      <SectionRule />

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
        <OpenSourceContributions />
      </motion.div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default AboutPage;
