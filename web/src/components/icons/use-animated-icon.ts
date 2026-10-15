import {
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & {
    size?: number;
  } & RefAttributes<AnimatedIconHandle>
>;

export function useAnimatedIcon() {
  const ref = useRef<AnimatedIconHandle>(null);

  const hoverProps = {
    onMouseEnter: () => ref.current?.startAnimation(),
    onMouseLeave: () => ref.current?.stopAnimation(),
    onFocus: () => ref.current?.startAnimation(),
    onBlur: () => ref.current?.stopAnimation(),
  };

  return { ref, hoverProps };
}

type Hover = ReturnType<typeof useAnimatedIcon>["hoverProps"];

export function combineHoverProps(...all: Hover[]): Hover {
  return {
    onMouseEnter: () => all.forEach((h) => h.onMouseEnter()),
    onMouseLeave: () => all.forEach((h) => h.onMouseLeave()),
    onFocus: () => all.forEach((h) => h.onFocus()),
    onBlur: () => all.forEach((h) => h.onBlur()),
  };
}
