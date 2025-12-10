import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    maxHeight?: string | number;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
    ({ className, children, maxHeight, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("relative overflow-auto", className)}
                style={{ maxHeight: maxHeight }}
                {...props}
            >
                {children}
            </div>
        )
    }
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea }
