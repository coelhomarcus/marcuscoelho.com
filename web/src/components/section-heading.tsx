import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";

interface SectionHeadingProps {
  title: string;
  action?: ReactNode;
}

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h2 className="text-xl font-bold tracking-tight text-zinc-100">
        {title}
      </h2>
      {action}
    </div>
  );
}

const actionClass =
  "inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-zinc-500 transition-colors hover:text-zinc-200";

export function SectionAction({
  to,
  href,
  children,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
}) {
  const { ref, hoverProps } = useAnimatedIcon();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
        {...hoverProps}
      >
        {children}
        <ArrowUpRightIcon ref={ref} size={13} />
      </a>
    );
  }

  return (
    <Link to={to ?? "/"} className={actionClass} {...hoverProps}>
      {children}
      <ChevronRightIcon ref={ref} size={13} />
    </Link>
  );
}
