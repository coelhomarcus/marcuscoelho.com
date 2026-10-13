import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  useAnimatedIcon,
  type AnimatedIcon,
} from "@/components/icons/use-animated-icon";

interface LinkButtonProps {
  href: string;
  icon: AnimatedIcon;
  children: React.ReactNode;
  iconSize?: number;
}

/** Outline Button rendered as an external link with a trailing animated icon. */
function LinkButton({
  href,
  icon: Icon,
  children,
  iconSize = 14,
}: LinkButtonProps) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <Button asChild variant="outline">
      <a href={href} target="_blank" rel="noreferrer noopener" {...hoverProps}>
        {children}
        <Icon ref={ref} size={iconSize} />
      </a>
    </Button>
  );
}

export { LinkButton };
