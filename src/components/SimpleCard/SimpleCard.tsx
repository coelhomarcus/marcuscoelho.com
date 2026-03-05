import type { SimpleCardProps } from "@/types";

const SimpleCard = ({ href, name, desc }: SimpleCardProps) => {
   return (
      <a
         href={href}
         className="block text-zinc-500 p-4 transition-colors hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-700"
         rel="noreferrer noopener"
         target="_blank"
      >
         <p className="text-sm text-zinc-100 font-medium">{name}</p>
         <p className="text-sm">{desc}</p>
      </a>
   );
};

export default SimpleCard;
