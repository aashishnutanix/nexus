"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

export interface FilterTabsProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const FilterTabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, FilterTabsProps>(
  ({ className, options, value, onChange, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} className={cn("inline-flex", className)} value={value} onValueChange={onChange}>
      <TabsPrimitive.List className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        {options.map((option) => (
          <TabsPrimitive.Trigger
            key={option}
            value={option}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
            )}
          >
            {option}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  ),
)
FilterTabs.displayName = "FilterTabs"

export { FilterTabs }

