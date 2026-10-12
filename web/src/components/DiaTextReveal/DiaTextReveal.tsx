import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = [
  "#c679c4",
  "#fa3d1d",
  "#ffb005",
  "#e1e1fe",
  "#0358f7",
];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (value: number) =>
  value < 0.5
    ? 4 * value ** 3
    : 1 - (-2 * value + 2) ** 3 / 2;

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }

  const parts: string[] = [];
  const colorCount = colors.length;

  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }

  colors.forEach((color, index) => {
    const percent =
      colorCount === 1
        ? pos
        : bandStart + (index / (colorCount - 1)) * BAND_HALF * 2;
    parts.push(`${color} ${percent.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, "transparent 100%");
  }

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "#f4f4f5",
  duration = 1.5,
  delay = 0,
  startOnView = true,
  once = true,
  className,
  ...props
}: {
  text: string;
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
  once?: boolean;
  className?: string;
} & Omit<
  HTMLMotionProps<"span">,
  "ref" | "children" | "style" | "animate" | "transition" | "color"
>) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(spanRef, { once, amount: 0.1 });
  const sweepPos = useMotionValue(SWEEP_START);
  const stopRef = useRef<(() => void) | null>(null);
  const hasPlayedRef = useRef(false);
  const optionsRef = useRef({ colors, textColor, duration, delay });
  optionsRef.current = { colors, textColor, duration, delay };

  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, optionsRef.current.colors, optionsRef.current.textColor),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      sweepPos.set(SWEEP_END);
      return;
    }
    if (startOnView && !isInView) return;
    if (once && hasPlayedRef.current) return;

    hasPlayedRef.current = true;
    const { duration: sweepDuration, delay: sweepDelay } = optionsRef.current;
    const controls = animate(sweepPos, SWEEP_END, {
      duration: sweepDuration,
      delay: sweepDelay,
      ease: sweepEase,
    });

    stopRef.current = () => controls.stop();

    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [isInView, once, prefersReducedMotion, startOnView, sweepPos]);

  return (
    <motion.span
      ref={spanRef}
      className={cn("align-bottom leading-[100%] text-inherit", className)}
      style={{
        transform: "translateY(-2px)",
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundImage,
      }}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export default DiaTextReveal;
