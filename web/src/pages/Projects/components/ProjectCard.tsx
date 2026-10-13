import type { Project } from "@/types";
import {
  formatCompactNumber,
  formatLinkPreview,
  formatMonthYear,
  projectAsset,
} from "@/lib/utils";
import { techIcons } from "@/data/techIcons";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

import {
  RxCalendar as CalendarIcon,
  RxGlobe as GlobeIcon,
  RxStar as StarIcon,
} from "react-icons/rx";

interface ProjectCardProps extends Omit<Project, "repo" | "tech"> {
  tech?: Project["tech"];
  onClick?: () => void;
}

const ProjectCard = ({
  name,
  desc,
  tech = [],
  images,
  favicon,
  link,
  linkPreview,
  repoStars,
  repoCreatedAt,
  onClick,
}: ProjectCardProps) => {
  const arrow = useAnimatedIcon();
  const preview = linkPreview ?? (link ? formatLinkPreview(link) : undefined);
  const cover = images?.[0];
  const hasStars = typeof repoStars === "number" && repoStars > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      {...arrow.hoverProps}
      className="group card-surface flex flex-col h-full w-full text-left p-3 hover:bg-zinc-900 hover:ring-foreground/20 cursor-pointer"
    >
      {cover && (
        <div className="aspect-[8/5] mb-3 overflow-clip rounded-lg transition-all">
          <img
            src={projectAsset(cover)}
            alt={name}
            className="group-hover:scale-[1.03] duration-200 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-1.5">
        <div className="text-sm font-medium text-zinc-200 flex gap-2 items-center">
          {favicon ? (
            <img
              className="size-4 rounded-sm"
              src={projectAsset(favicon)}
              alt=""
            />
          ) : (
            <GlobeIcon className="size-4 text-zinc-500" />
          )}
          {name}
        </div>
        <span className="opacity-50 group-hover:opacity-90 transition-opacity">
          <ArrowUpRightIcon
            ref={arrow.ref}
            size={14}
            className="text-zinc-500"
          />
        </span>
      </div>
      {preview && (
        <p className="text-xs text-zinc-500/70 italic mb-1">{preview}</p>
      )}
      {(hasStars || repoCreatedAt) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-[11px] text-zinc-500">
          {hasStars && (
            <span className="inline-flex items-center gap-1">
              <StarIcon className="size-3.5 text-zinc-400" />
              {formatCompactNumber(repoStars)}
            </span>
          )}
          {repoCreatedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarIcon className="size-3.5 text-zinc-400" />
              {formatMonthYear(repoCreatedAt)}
            </span>
          )}
        </div>
      )}
      <p className="text-xs text-zinc-500 mb-3 flex-grow leading-relaxed">
        {desc}
      </p>
      {tech && tech.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-auto">
          {tech.map((t, i) => {
            const Icon = techIcons[t];
            return (
              <Badge key={i} variant="muted">
                {Icon && <Icon />}
                {t}
              </Badge>
            );
          })}
        </div>
      )}
    </button>
  );
};

export default ProjectCard;
