import { arrSkills } from "@/data/skills";
import { motion } from "motion/react";

function Skills() {
  return (
    <div className="flex flex-col gap-3 cursor-default">
      <h2 className="text-base font-semibold text-zinc-300">Skills</h2>
      <div className="flex flex-wrap gap-1.5">
        {arrSkills.map((skill, index) => (
          <motion.a
            key={index}
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
              ease: "easeOut",
            }}
            className="inline-flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-full px-2 py-1 text-xs text-zinc-500 hover:text-zinc-100 hover:border-zinc-600 transition-colors"
          >
            <skill.icon className="size-3" />
            {skill.name}
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default Skills;
