import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import type { NavItem } from "@/types";

export function SocialLink({ href, name, icon: Icon }: NavItem) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="flex items-center justify-center p-1.5 rounded-md hover:text-zinc-100 transition-colors"
      {...hoverProps}
    >
      <Icon ref={ref} size={16} />
    </a>
  );
}
