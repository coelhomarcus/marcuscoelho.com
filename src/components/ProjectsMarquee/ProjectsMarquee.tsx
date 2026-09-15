import { projectAsset } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { techIcons } from "@/data/techIcons";
import type { Project } from "@/types";
import { RxArrowTopRight as ExternalLinkIcon } from "react-icons/rx";

interface ProjectsMarqueeProps {
  onProjectClick: (project: Project) => void;
}

const ProjectsMarquee = ({ onProjectClick }: ProjectsMarqueeProps) => {
  const projects = useProjects().slice(0, 7);
  const duplicated = [...projects, ...projects];

  return (
    <div className="overflow-hidden relative group/marquee">
      <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      <div className="flex gap-4 animate-marquee w-max group-hover/marquee:[animation-play-state:paused]">
        {duplicated.map((project, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onProjectClick(project)}
            className="relative group/card flex-shrink-0 rounded overflow-hidden cursor-pointer text-left"
          >
            <img
              src={project.images?.[0] ? projectAsset(project.images[0]) : undefined}
              alt={project.name}
              className="h-48 w-auto object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-white text-sm font-semibold">
                  {project.name}
                </h3>
                <ExternalLinkIcon className="text-white/70 size-3.5" />
              </div>
              <p className="text-white/80 text-xs line-clamp-2 mb-2">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.slice(0, 3).map((t) => {
                  const Icon = techIcons[t];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-[10px] text-white/90 bg-white/15 px-1.5 py-0.5 rounded"
                    >
                      {Icon && <Icon className="size-2.5" />}
                      {t}
                    </span>
                  );
                })}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectsMarquee;
