import {
  Skeleton,
  SkeletonCard,
  SkeletonForm,
  SkeletonHero,
  SkeletonSection,
} from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading page">
      <SkeletonHero />
      <SkeletonSection cards={3} />
      <section className="border-y border-border/60 bg-surface/40 py-12 sm:py-16" aria-hidden>
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <Skeleton className="mx-auto mb-3 h-8 w-56" />
            <Skeleton className="mx-auto h-4 w-80 max-w-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/70 bg-white p-5">
                <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
                <Skeleton className="mb-2 h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <SkeletonSection cards={3} />
    </div>
  );
}

export function ProductsPageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading products">
      <section className="border-b border-border/60 bg-primary py-12 sm:py-16" aria-hidden>
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-3 h-8 w-64 bg-white/20 before:via-white/25" />
          <Skeleton className="h-5 w-full max-w-xl bg-white/15 before:via-white/20" />
        </div>
      </section>
      <section className="py-8 sm:py-10" aria-hidden>
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading product">
      <section className="border-b border-border/60 bg-primary py-12 sm:py-16 lg:py-20" aria-hidden>
        <div className="mx-auto grid max-w-[var(--container-max)] gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div>
            <Skeleton className="mb-3 h-6 w-28 rounded-full bg-white/20 before:via-white/25" />
            <Skeleton className="mb-4 h-10 w-full max-w-lg bg-white/20 before:via-white/25 sm:h-12" />
            <Skeleton className="h-5 w-full max-w-md bg-white/15 before:via-white/20" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl bg-white/10 before:via-white/15" />
        </div>
      </section>
      <section className="py-10 sm:py-12" aria-hidden>
        <div className="mx-auto grid max-w-[var(--container-max)] gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </section>
    </div>
  );
}

export function AboutPageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading about page">
      <SkeletonHero />
      <SkeletonSection cards={4} />
      <SkeletonSection cards={3} />
    </div>
  );
}

export function MarketsPageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading markets">
      <SkeletonHero />
      <section className="py-8 sm:py-10" aria-hidden>
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/70 bg-white p-5">
                <Skeleton className="mb-3 h-6 w-2/3" />
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading contact page">
      <SkeletonHero />
      <section className="py-10 sm:py-12" aria-hidden>
        <div className="mx-auto grid max-w-[var(--container-max)] gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
          <div className="lg:col-span-3">
            <SkeletonForm fields={4} />
          </div>
        </div>
      </section>
    </div>
  );
}

export function QuotePageSkeleton() {
  return (
    <div className="min-w-0" aria-busy="true" aria-label="Loading quote page">
      <SkeletonHero />
      <section className="py-10 sm:py-12" aria-hidden>
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <SkeletonForm fields={8} />
        </div>
      </section>
    </div>
  );
}
