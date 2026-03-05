import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";

import HeroSection from "@/components/HeroSection/HeroSection";
import WorksExperience from "@/components/WorksExperience/WorksExperience";
import Skills from "@/components/Skills/Skills";
import GitHubGraph from "@/components/GitHubGraph/GitHubGraph";
import GitHubStats from "@/components/GitHubStats/GitHubStats";
import ProjectsMarquee from "@/components/ProjectsMarquee/ProjectsMarquee";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const About = () => {
  return (
    <main className="text-zinc-100 space-y-6">
      <PageTitle title="Marcus Coelho" />

      <motion.div {...fadeUp}>
        <HeroSection />
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <Skills />
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <ProjectsMarquee />
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.15 }}
      >
        <WorksExperience />
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.25 }}
        className="flex flex-col gap-3"
      >
        <GitHubGraph />
        <GitHubStats />
      </motion.div>
    </main>
  );
};

export default About;
