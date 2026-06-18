import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** 0–100 for determinate; omit for indeterminate */
  value?: number | null;
  active?: boolean;
  className?: string;
  label?: string;
};

export function ProgressBar({
  value = null,
  active = false,
  className,
  label = "Transfer in progress",
}: ProgressBarProps) {
  if (!active) return null;

  const determinate = typeof value === "number" && Number.isFinite(value);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-[9998] h-1 overflow-hidden bg-border/40",
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? Math.round(value) : undefined}
      aria-label={label}
      aria-busy
    >
      {determinate ? (
        <div
          className="h-full bg-secondary transition-[width] duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      ) : (
        <div className="h-full w-2/5 animate-progress-indeterminate bg-secondary" />
      )}
    </div>
  );
}
