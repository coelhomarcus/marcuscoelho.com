import { arrProjects } from "../../utils/data/projects";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import PageTitle from "@/components/PageTitle/PageTitle";

const Projects = () => {
  const projects = arrProjects;

  return (
    <div className="text-foreground">
      <PageTitle title="Projetos" suffix />
      <h1 className="text-xl font-semibold mb-2">Projetos</h1>
      <p className="text-muted-foreground text-sm mb-4">
        Projetos que fiz ou participei no desenvolvimento.
      </p>
      {/*<div className="border border-yellow-400/20 bg-yellow-400/10 mb-4 text-yellow-800 dark:text-yellow-400 text-center rounded">
        <p className="text-amber-foreground p-2 text-sm">
          Alguns projetos estão em fase de migração, pois estou substituindo
          certos serviços e reduzindo custos.
        </p>
      </div>*/}
      <div className="gap-4 mb-4 grid grid-cols-1 sm:grid-cols-2">
        {projects.map((project, index) => {
          return (
            <ProjectCard
              key={index}
              favicon={project.favicon}
              linkPreview={project.linkPreview}
              href={project.href}
              name={project.name}
              desc={project.desc}
              tech={project.tech}
              img={project.img}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
