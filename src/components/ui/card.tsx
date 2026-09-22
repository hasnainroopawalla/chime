import * as React from "react"
import { cn } from "cn"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        "min-w-0 gap-0 rounded-[16px] border border-border bg-card p-4.75 pt-3 shadow-[0_3px_10px_#00000002] ring-0 min-[371px]:p-5.75 min-[371px]:pt-3.75 min-[701px]:rounded-[19px] min-[701px]:p-6 min-[701px]:pt-4 min-[1001px]:p-7 min-[1001px]:pt-5",
        className
      )}
      {...props}
    />
  )
}

export { Card }
