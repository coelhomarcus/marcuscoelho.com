import { projectAsset } from "@/lib/utils";
import { useProjects } from "@/hooks/use-projects";
import { SectionAction, SectionHeading } from "@/components/section-heading";
import { techIcons } from "@/data/tech-icons";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

interface ProjectsMarqueeProps {
  onProjectClick: (project: Project) => void;
}

function MarqueeCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const arrow = useAnimatedIcon();

  return (
    <button
      type="button"
      onClick={onClick}
      {...arrow.hoverProps}
      className="relative group/card shrink-0 rounded overflow-hidden cursor-pointer text-left"
    >
      <img
        src={project.images?.[0] ? projectAsset(project.images[0]) : undefined}
        alt={project.name}
        className="h-48 w-auto object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="text-white text-sm font-semibold">{project.name}</h3>
          <ArrowUpRightIcon
            ref={arrow.ref}
            size={14}
            className="text-white/70"
          />
        </div>
        <p className="text-white/80 text-xs line-clamp-2 mb-2">
          {project.desc}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 3).map((t) => {
            const Icon = techIcons[t];
            return (
              <Badge key={t}>
                {Icon && <Icon />}
                {t}
              </Badge>
            );
          })}
        </div>
      </div>
    </button>
  );
}

const ProjectsMarquee = ({ onProjectClick }: ProjectsMarqueeProps) => {
  const projects = useProjects().slice(0, 7);
  const duplicated = [...projects, ...projects];

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading
        title="Projetos"
        action={<SectionAction to="/projects">Ver todos</SectionAction>}
      />
      <div className="overflow-hidden relative group/marquee">
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-linear-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-linear-to-l from-black to-transparent pointer-events-none" />
        <div className="flex gap-4 animate-marquee w-max group-hover/marquee:[animation-play-state:paused]">
          {duplicated.map((project, i) => (
            <MarqueeCard
              key={i}
              project={project}
              onClick={() => onProjectClick(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsMarquee;
