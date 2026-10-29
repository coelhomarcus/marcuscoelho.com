import { motion, useAnimation } from "motion/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
} from "react";
import type { AnimatedIconHandle } from "./use-animated-icon";
import { cn } from "@/lib/utils";

interface MediaIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

function createMediaIcon(
  displayName: string,
  paths: React.ReactNode,
  animation: { rotate?: number[]; scale?: number[]; y?: number[] },
) {
  const Icon = forwardRef<AnimatedIconHandle, MediaIconProps>(
    ({ className, size = 28, onMouseEnter, onMouseLeave, ...props }, ref) => {
      const controls = useAnimation();
      const controlled = useRef(false);

      useImperativeHandle(ref, () => {
        controlled.current = true;
        return {
          startAnimation: () => controls.start("animate"),
          stopAnimation: () => controls.start("normal"),
        };
      });

      const enter = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          if (controlled.current) onMouseEnter?.(event);
          else controls.start("animate");
        },
        [controls, onMouseEnter],
      );
      const leave = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
          if (controlled.current) onMouseLeave?.(event);
          else controls.start("normal");
        },
        [controls, onMouseLeave],
      );

      return (
        <div
          className={cn("inline-flex", className)}
          onMouseEnter={enter}
          onMouseLeave={leave}
          {...props}
        >
          <motion.svg
            animate={controls}
            variants={{
              normal: { rotate: 0, scale: 1, y: 0 },
              animate: {
                ...animation,
                transition: { duration: 0.45, ease: "easeOut" },
              },
            }}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {paths}
          </motion.svg>
        </div>
      );
    },
  );
  Icon.displayName = displayName;
  return Icon;
}

export const AnimeIcon = createMediaIcon(
  "AnimeIcon",
  <>
    <rect width="20" height="15" x="2" y="6" rx="2" />
    <path d="m8 2 4 4 4-4" />
    <path d="m10 11 5 3-5 3Z" />
  </>,
  { rotate: [0, -4, 4, 0], scale: [1, 1.08, 1] },
);

export const MangaIcon = createMediaIcon(
  "MangaIcon",
  <>
    <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H11v18H4.5A2.5 2.5 0 0 0 2 22Z" />
    <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H13v18h6.5A2.5 2.5 0 0 1 22 22Z" />
  </>,
  { y: [0, -2, 0], scale: [1, 1.06, 1] },
);
