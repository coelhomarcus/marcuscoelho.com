import { useState } from "react";
import { SectionRule } from "@/components/layout/stitch";
import ProjectCard from "./components/project-card";
import ProjectModal from "@/components/project-modal";
import PageTitle from "@/components/page-title";
import type { Project } from "@/types";
import { motion } from "motion/react";
import { useProjects } from "@/hooks/use-projects";
import { fadeUp } from "@/lib/motion";

const ProjectsPage = () => {
  const [selected, setSelected] = useState<Project | null>(null);
  const projects = useProjects();

  return (
    <main className="text-zinc-100 space-y-4">
      <PageTitle title="Projetos" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Projetos
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Projetos que fiz ou participei no desenvolvimento.
          </p>
        </div>
      </motion.div>

      <SectionRule />

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              className="h-full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15 + index * 0.06,
                ease: "easeOut",
              }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelected(project)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </main>
  );
};

export default ProjectsPage;
