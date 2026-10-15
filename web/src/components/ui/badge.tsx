import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

function Badge({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 rounded-[4px] border border-zinc-800/50 bg-[#111111] px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-zinc-400 transition-colors [a]:hover:border-zinc-700 [a]:hover:text-zinc-200 [&>svg]:pointer-events-none [&>svg]:size-3 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
