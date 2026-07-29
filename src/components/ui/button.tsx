"use client";

/**
 * components/ui/button.tsx — Button Component
 *
 * Variants match DESIGN_SYSTEM.md §9 exactly.
 * Uses class-variance-authority for type-safe variant props.
 * Extends HTML button with asChild (Radix Slot) for polymorphic rendering.
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // DESIGN_SYSTEM §9 Primary — warm terracotta CTA
        primary:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-[0.98]",
        // DESIGN_SYSTEM §9 Secondary/Outline
        secondary:
          "bg-[var(--color-surface)] text-[var(--color-heading)] border border-[var(--color-border)] hover:bg-[var(--color-muted-bg)]",
        // DESIGN_SYSTEM §9 Ghost/Text
        ghost:
          "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-muted-bg)]",
        // DESIGN_SYSTEM §9 Destructive — muted, not neon (per brand rules)
        destructive:
          "bg-[var(--color-surface)] text-[var(--color-danger)] border border-[var(--color-danger)] hover:bg-red-50",
        // Link-style
        link: "bg-transparent text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-6 py-2.5 text-sm",
        sm: "h-8 px-4 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
