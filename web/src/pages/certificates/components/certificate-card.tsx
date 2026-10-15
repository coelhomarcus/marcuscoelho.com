import { motion } from "motion/react";
import { cardTransition, cardVariants } from "@/lib/motion";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

interface CertificateCardProps {
  href: string;
  name: string;
  desc: string;
}

const CertificateCard = ({ href, name, desc }: CertificateCardProps) => {
  const arrow = useAnimatedIcon();

  return (
    <motion.a
      href={href}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={cardTransition}
      className="group flex items-center justify-between gap-3 rounded-xl p-4"
      rel="noreferrer noopener"
      target="_blank"
      {...arrow.hoverProps}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-sm text-zinc-100 font-medium truncate">{name}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <ArrowUpRightIcon
        ref={arrow.ref}
        size={16}
        className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200"
      />
    </motion.a>
  );
};

export default CertificateCard;
