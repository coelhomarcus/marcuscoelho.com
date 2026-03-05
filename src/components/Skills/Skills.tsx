import { arrSkills } from "@/data/works";
import { motion } from "motion/react";

function Skills() {
  return (
    <div className="flex flex-col gap-3 cursor-default">
      <h2 className="text-base font-semibold text-zinc-300">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {arrSkills.map((skill, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
              ease: "easeOut",
            }}
            className="inline-flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-full px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <skill.icon className="size-3.5" />
            {skill.name}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default Skills;
