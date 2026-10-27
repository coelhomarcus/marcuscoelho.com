import type { Variants } from "motion/react";
import { useTheme, type Theme } from "@/hooks/use-theme";

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const cardVariantsByTheme: Record<Theme, Variants> = {
  dark: {
    rest: {
      backgroundColor: "#09090b",
      boxShadow: "0 0 0 1px rgba(244, 244, 245, 0.1)",
    },
    hover: {
      backgroundColor: "#18181b",
      boxShadow: "0 0 0 1px rgba(244, 244, 245, 0.2)",
    },
  },
  light: {
    rest: {
      backgroundColor: "#fafafa",
      boxShadow: "0 0 0 1px rgba(9, 9, 11, 0.1)",
    },
    hover: {
      backgroundColor: "#f4f4f5",
      boxShadow: "0 0 0 1px rgba(9, 9, 11, 0.2)",
    },
  },
};

export const useCardVariants = () => cardVariantsByTheme[useTheme().theme];

export const cardTransition = { duration: 0.2, ease: "easeOut" } as const;
