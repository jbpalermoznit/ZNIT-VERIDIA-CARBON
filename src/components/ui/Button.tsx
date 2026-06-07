import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "brand" | "ghost" | "subtle";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-700 disabled:opacity-40",
  brand: "bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-40",
  ghost:
    "border border-ink-300 text-ink-700 hover:border-ink-900 hover:text-ink-900",
  subtle: "bg-brand-100 text-brand-600 hover:bg-brand-300/60",
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: "md" | "lg";
  }
>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed",
        size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});
