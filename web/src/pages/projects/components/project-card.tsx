import { motion, type Variants } from "motion/react";
import { cardTransition, cardVariants } from "@/lib/motion";
import type { Project } from "@/types";
import { projectAsset } from "@/lib/utils";
import { techIcons } from "@/data/tech-icons";
import { Tooltip } from "@/components/ui/tooltip";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03 },
};

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { name, desc, tech, images } = project;
  const arrow = useAnimatedIcon();
  const cover = images?.[0];

  const withIcon = tech.filter((t) => techIcons[t]);
  const withoutIcon = tech.filter((t) => !techIcons[t]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...arrow.hoverProps}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={cardTransition}
      className="group flex h-full w-full cursor-pointer flex-col rounded-xl p-3 text-left"
    >
      {cover && (
        <div className="isolate aspect-8/5 w-full overflow-hidden rounded-lg">
          <motion.img
            src={projectAsset(cover)}
            alt={name}
            loading="lazy"
            variants={imageVariants}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="size-full object-cover"
          />
        </div>
      )}

      <div className="mt-3 flex flex-1 flex-col px-1 pb-1">
        <h3 className="text-[15px] leading-tight font-bold text-zinc-100">
          {name}
        </h3>

        <p className="mt-1.5 pr-2 text-[13px] leading-relaxed text-zinc-400">
          {desc}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex flex-wrap items-center gap-2 text-zinc-400">
            {withIcon.map((t) => {
              const Icon = techIcons[t];
              return (
                <Tooltip key={t} content={t}>
                  <Icon className="size-4" aria-label={t} />
                </Tooltip>
              );
            })}
            {withoutIcon.length > 0 && (
              <Tooltip content={withoutIcon.join(", ")}>
                <span className="text-[11px] font-medium text-zinc-500 tabular-nums">
                  +{withoutIcon.length}
                </span>
              </Tooltip>
            )}
          </div>

          <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-zinc-200">
            Ver projeto
            <ArrowUpRightIcon ref={arrow.ref} size={12} />
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default ProjectCard;
