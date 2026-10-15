import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  useAnimatedIcon,
  type AnimatedIcon,
} from "@/components/icons/use-animated-icon";

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  icon: AnimatedIcon;
  iconSize?: number;
  "aria-label": string;
};

function IconButton({
  icon: Icon,
  iconSize = 16,
  size = "icon-sm",
  ...props
}: IconButtonProps) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <Button size={size} {...hoverProps} {...props}>
      <Icon ref={ref} size={iconSize} />
    </Button>
  );
}

export { IconButton };
