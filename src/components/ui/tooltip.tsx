import * as React from "react";
import { cn } from "@/lib/utils";

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-slot="tooltip" className="relative group/tooltip">
      {children}
    </div>
  );
}

function TooltipTrigger({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="tooltip-trigger" {...props}>
      {children}
    </div>
  );
}

function TooltipContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="tooltip-content"
      role="tooltip"
      className={cn(
        "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
        "bg-foreground text-background",
        "opacity-0 scale-95 pointer-events-none transition-all duration-150",
        "group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
