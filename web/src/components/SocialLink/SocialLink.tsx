import { AtSignIcon } from "@/components/icons/at-sign";
import { GithubIcon } from "@/components/icons/github";
import { LinkedinIcon } from "@/components/icons/linkedin";
import {
  useAnimatedIcon,
  type AnimatedIcon,
} from "@/components/icons/use-animated-icon";

interface SocialLinkProps {
  href: string;
  label: string;
  icon: AnimatedIcon;
}

export const socialLinks: SocialLinkProps[] = [
  {
    href: "mailto:marcusrangelcoelho@gmail.com",
    label: "Email",
    icon: AtSignIcon,
  },
  {
    href: "https://github.com/coelhomarcus",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://www.linkedin.com/in/coelhomarcus/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

export function SocialLink({ href, label, icon: Icon }: SocialLinkProps) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center p-1.5 rounded-md hover:text-zinc-100 transition-colors"
      {...hoverProps}
    >
      <Icon ref={ref} size={16} />
    </a>
  );
}
