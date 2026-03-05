import type { ProjectCardProps } from "@/types";

import { RxArrowTopRight as ExternalLinkIcon } from "react-icons/rx";

const ProjectCard = ({
  href,
  name,
  desc,
  tech = [],
  img,
  favicon,
  linkPreview,
}: ProjectCardProps) => {
  return (
    <a
      href={href}
      className="group flex flex-col h-full p-3 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors"
      rel="noreferrer noopener"
      target="_blank"
    >
      {img && (
        <div className="aspect-[8/5] mb-3 overflow-clip rounded transition-all">
          <img
            src={img}
            alt={name}
            className="group-hover:scale-[1.03] duration-200 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-1.5">
        <div className="text-sm font-medium text-zinc-200 flex gap-2 items-center">
          {favicon ? (
            <img className="size-4 rounded-sm" src={favicon} alt="" />
          ) : null}
          {name}
        </div>
        <span className="opacity-50 group-hover:opacity-90 transition-opacity">
          <ExternalLinkIcon width={14} height={14} className="text-zinc-500" />
        </span>
      </div>
      {linkPreview && (
        <p className="text-xs text-zinc-500/70 italic mb-1">{linkPreview}</p>
      )}
      <p className="text-xs text-zinc-500 mb-3 flex-grow leading-relaxed">
        {desc}
      </p>
      {tech && tech.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-auto">
          {tech.map((t, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </a>
  );
};

export default ProjectCard;
