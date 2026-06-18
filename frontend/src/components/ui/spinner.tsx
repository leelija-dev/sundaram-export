import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
  size?: "sm" | "md";
};

const sizeClass = {
  sm: "h-3.5 w-3.5 border-[1.5px]",
  md: "h-4 w-4 border-2",
} as const;

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent",
        sizeClass[size],
        className,
      )}
      aria-hidden
    />
  );
}
