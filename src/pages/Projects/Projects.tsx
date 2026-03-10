import { arrProjects } from "../../data/projects";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const sorted = [...arrProjects].sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0));

const Projects = () => {
  return (
    <main className="text-zinc-100 space-y-6">
      <PageTitle title="Projetos" suffix />

      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-1 pt-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Projetos
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Projetos que fiz ou participei no desenvolvimento.
          </p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((project, index) => (
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
                favicon={project.favicon}
                linkPreview={project.linkPreview}
                href={project.href}
                name={project.name}
                desc={project.desc}
                tech={project.tech}
                img={project.img}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export default Projects;
