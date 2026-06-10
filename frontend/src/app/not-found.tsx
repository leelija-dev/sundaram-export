import Link from "next/link";
import { Button, Container } from "@/components/site-ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">404</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-muted sm:text-base">
        The page you are looking for does not exist or may have moved.
      </p>
      <Button href="/" variant="primary" fullWidthOnMobile className="mt-8">
        Back to home
      </Button>
      <Link
        href="/contact"
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-secondary hover:text-primary"
      >
        Contact support →
      </Link>
    </Container>
  );
}
