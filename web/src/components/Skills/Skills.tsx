import { arrSkills } from "@/data/skills";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

function Skills() {
  return (
    <div className="flex flex-col gap-3 cursor-default">
      <h2 className="text-base font-semibold text-zinc-300">Skills</h2>
      <div className="flex flex-wrap gap-1.5">
        {arrSkills.map((skill, index) => (
          <Badge key={index} asChild variant="muted">
            <motion.a
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
            >
              <skill.icon />
              {skill.name}
            </motion.a>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default Skills;
