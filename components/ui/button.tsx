import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md",
        outline:
          "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-md",
        link: "text-primary underline-offset-4 hover:underline",
        wedding: "btn-wedding btn-wedding-primary rounded-full border-2 border-primary/20 shadow-lg hover:shadow-xl",
        weddingOutline: "btn-wedding btn-wedding-outline rounded-full",
        weddingCta: "btn-wedding btn-wedding-cta rounded-full text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 min-h-[3rem] sm:min-h-[3.5rem]",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[2.75rem] sm:min-h-10",
        sm: "h-9 rounded-md px-3 min-h-[2.5rem] sm:min-h-9",
        lg: "h-11 rounded-full px-6 sm:px-8 min-h-[2.75rem] sm:min-h-11",
        icon: "h-10 w-10 min-h-[2.75rem] min-w-[2.75rem] sm:min-h-10 sm:min-w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

