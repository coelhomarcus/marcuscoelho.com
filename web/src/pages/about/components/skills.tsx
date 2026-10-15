import { skills } from "@/data/skills";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/section-heading";

function Skills() {
  return (
    <div className="flex flex-col gap-4 cursor-default">
      <SectionHeading title="Skills & Tecnologias" />
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <Badge key={index} asChild>
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
