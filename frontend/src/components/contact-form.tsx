"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/lib/api";
import { clientFetchCountries, clientFetchProducts } from "@/lib/api-client";
import type { ExportCountry } from "@/lib/api";
import type { ExportProduct } from "@/lib/types/catalog";

type ContactFormProps = {
  variant?: "contact" | "quote";
};

export function ContactForm({ variant = "contact" }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ExportProduct[]>([]);
  const [countries, setCountries] = useState<ExportCountry[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(variant === "quote");

  useEffect(() => {
    if (variant !== "quote") return;

    let cancelled = false;
    setCatalogLoading(true);

    Promise.all([clientFetchProducts(), clientFetchCountries()])
      .then(([productList, countryList]) => {
        if (!cancelled) {
          setProducts(productList);
          setCountries(countryList);
        }
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [variant]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitInquiry({
        type: variant,
        name: String(data.get("name") ?? ""),
        company: String(data.get("company") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        message: String(data.get("message") ?? ""),
        origin: variant === "quote" ? String(data.get("origin") ?? "") : undefined,
        destination: variant === "quote" ? String(data.get("destination") ?? "") : undefined,
        product_slug: String(data.get("product") ?? "") || undefined,
        incoterms: variant === "quote" ? String(data.get("incoterms") ?? "") : undefined,
        volume: variant === "quote" ? String(data.get("volume") ?? "") : undefined,
        website: String(data.get("website") ?? ""),
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-6 text-center sm:p-8">
        <p className="text-lg font-semibold text-primary">Thank you!</p>
        <p className="mt-2 text-sm text-foreground/90">
          We received your {variant === "quote" ? "quote request" : "message"} and will respond within
          one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <Field label="Full name" name="name" required />
        <Field label="Company" name="company" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      {variant === "quote" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <Field label="Origin country / city" name="origin" required />
            {countries.length > 0 ? (
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-foreground/90">
                  Destination country
                </label>
                <select id="destination" name="destination" required className={inputClass}>
                  <option value="" disabled>
                    Select destination
                  </option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.subtitle ? `${c.name} (${c.subtitle})` : c.name}
                    </option>
                  ))}
                  <option value="other">Other — specify in message</option>
                </select>
              </div>
            ) : (
              <Field label="Destination country / city" name="destination" required />
            )}
          </div>
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-foreground/90">
              Product line (if applicable)
            </label>
            <select
              id="product"
              name="product"
              className={inputClass}
              disabled={catalogLoading}
            >
              <option value="">
                {catalogLoading ? "Loading products…" : "Not applicable / not sure"}
              </option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <Field label="Incoterms (if known)" name="incoterms" placeholder="e.g. FOB Mumbai, CIF Houston" />
          <Field label="Estimated volume" name="volume" placeholder="e.g. 1×40ft FCL, 500 kg air" />
        </>
      )}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/90">
          {variant === "quote" ? "Product / cargo details & timeline" : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className={cn(inputClass, "resize-y min-h-[6rem]")}
          placeholder={
            variant === "quote"
              ? "Product specs, packaging, certifications needed, target ship date..."
              : "How can we help?"
          }
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || catalogLoading}
        className="touch-target w-full rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:opacity-60 lg:w-auto lg:min-h-0 lg:px-8"
      >
        {submitting ? "Sending…" : variant === "quote" ? "Submit quote request" : "Send message"}
      </button>
      <p className="text-xs text-muted">
        Submissions are sent securely to our export desk. We typically respond within one business day.
      </p>
    </form>
  );
}

const inputClass =
  "mt-1.5 w-full min-h-11 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:min-h-0";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground/90">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
