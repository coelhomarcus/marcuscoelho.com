import { arrWorks } from "@/data/works";
import { motion } from "motion/react";

function WorksExperience() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-300">Experiência</h2>
      <div className="space-y-3">
        {arrWorks.map((work, index) => (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
              ease: "easeOut",
            }}
            className="group flex gap-3 p-3 rounded-[8px] border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 transition-colors"
            key={work.company}
          >
            <img
              src={work.logo}
              alt={work.company}
              className="size-10 object-cover rounded-md shrink-0 mt-0.5"
            />
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
                <h3 className="text-sm font-medium text-zinc-200 leading-snug">
                  {work.company}
                </h3>
                <span className="text-xs text-zinc-500 whitespace-nowrap">
                  {work.duration}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{work.role}</p>
              {work.about && (
                <p className="text-xs text-zinc-500/70 leading-relaxed mt-1">
                  {work.about}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default WorksExperience;
