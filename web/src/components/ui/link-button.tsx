import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  useAnimatedIcon,
  type AnimatedIcon,
} from "@/components/icons/use-animated-icon";

type ButtonProps = React.ComponentProps<typeof Button>;

interface LinkButtonProps {
  href: string;
  icon: AnimatedIcon;
  children: React.ReactNode;
  iconSize?: number;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}

/** Button rendered as an external link with a trailing animated icon (outline by default). */
function LinkButton({
  href,
  icon: Icon,
  children,
  iconSize = 14,
  variant = "outline",
  size,
  className,
}: LinkButtonProps) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={href} target="_blank" rel="noreferrer noopener" {...hoverProps}>
        {children}
        <Icon ref={ref} size={iconSize} />
      </a>
    </Button>
  );
}

export { LinkButton };
