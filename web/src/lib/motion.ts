import type { Variants } from "motion/react";

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const cardVariants: Variants = {
  rest: {
    backgroundColor: "#09090b",
    boxShadow: "0 0 0 1px rgba(244, 244, 245, 0.1)",
  },
  hover: {
    backgroundColor: "#18181b",
    boxShadow: "0 0 0 1px rgba(244, 244, 245, 0.2)",
  },
};

export const cardTransition = { duration: 0.2, ease: "easeOut" } as const;
