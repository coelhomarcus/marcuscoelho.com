import { HiArrowUpRight } from "react-icons/hi2";
import type { SimpleCardProps } from "@/types";

const SimpleCard = ({ href, name, desc }: SimpleCardProps) => {
  return (
    <a
      href={href}
      className="group card-surface flex items-center justify-between gap-3 p-4 hover:bg-zinc-900 hover:ring-foreground/20"
      rel="noreferrer noopener"
      target="_blank"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm text-zinc-100 font-medium truncate">{name}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <HiArrowUpRight className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200" />
    </a>
  );
};

export default SimpleCard;
