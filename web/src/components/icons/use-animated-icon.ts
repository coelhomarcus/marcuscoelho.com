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

/** Shape shared by every icon in `components/icons`. */
export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & {
    size?: number;
  } & RefAttributes<AnimatedIconHandle>
>;

/**
 * The icons only animate while the pointer is over the icon itself. Spread
 * `hoverProps` on the surrounding button or link and pass `ref` to the icon
 * so the whole control drives the animation (hover and keyboard focus).
 */
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

/** Drives more than one icon from the same control. */
export function combineHoverProps(...all: Hover[]): Hover {
  return {
    onMouseEnter: () => all.forEach((h) => h.onMouseEnter()),
    onMouseLeave: () => all.forEach((h) => h.onMouseLeave()),
    onFocus: () => all.forEach((h) => h.onFocus()),
    onBlur: () => all.forEach((h) => h.onBlur()),
  };
}
