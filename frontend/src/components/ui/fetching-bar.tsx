import { cn } from "@/lib/utils";

type FetchingBarProps = {
  active?: boolean;
  className?: string;
};

export function FetchingBar({ active = false, className }: FetchingBarProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[9999] h-0.5 overflow-hidden bg-transparent transition-opacity duration-200",
        active ? "opacity-100" : "opacity-0",
        className,
      )}
      role="progressbar"
      aria-hidden={!active}
      aria-busy={active}
      aria-label="Loading"
    >
      <div
        className={cn(
          "h-full w-1/3 bg-gradient-to-r from-transparent via-secondary to-transparent",
          active && "animate-fetching-slide",
        )}
      />
    </div>
  );
}
