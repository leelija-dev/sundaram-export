import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-border/60",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
  if (lines <= 1) {
    return <Skeleton className={cn("h-4 w-full", className)} />;
  }
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-4/5" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border/70 bg-white p-5 shadow-sm", className)}>
      <Skeleton className="mb-4 aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}

export function SkeletonHero({ className }: SkeletonProps) {
  return (
    <section
      className={cn(
        "border-b border-border/60 bg-primary/90 py-14 sm:py-20 lg:py-24",
        className,
      )}
      aria-hidden
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-6 w-28 rounded-full bg-white/20 before:via-white/25" />
        <Skeleton className="mb-3 h-10 w-full max-w-xl bg-white/20 before:via-white/25 sm:h-12" />
        <Skeleton className="mb-8 h-5 w-full max-w-2xl bg-white/15 before:via-white/20" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-36 rounded-xl bg-white/20 before:via-white/25" />
          <Skeleton className="h-11 w-32 rounded-xl bg-white/15 before:via-white/20" />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-20 rounded-xl bg-white/10 before:via-white/15 sm:h-24"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonSection({
  className,
  cards = 3,
}: SkeletonProps & { cards?: number }) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-20", className)} aria-hidden>
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Skeleton className="mx-auto mb-3 h-4 w-24" />
          <Skeleton className="mx-auto mb-3 h-8 w-full max-w-md" />
          <Skeleton className="mx-auto h-4 w-full max-w-lg" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkeletonForm({ fields = 6, className }: SkeletonProps & { fields?: number }) {
  return (
    <div className={cn("space-y-5 rounded-2xl border border-border/70 bg-white p-6 shadow-sm", className)} aria-hidden>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: Math.min(fields, 2) }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
      {fields > 4 &&
        Array.from({ length: Math.ceil((fields - 4) / 2) }).map((_, row) => (
          <div key={row} className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <Skeleton className="h-11 w-44 rounded-xl" />
    </div>
  );
}
