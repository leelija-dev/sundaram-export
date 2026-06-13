// src/components/contact-form.tsx

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
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
          ✓
        </div>
        <p className="text-xl font-bold text-foreground">Thank you!</p>
        <p className="mt-2 text-sm text-muted">
          We received your {variant === "quote" ? "quote request" : "message"} and will respond within
          one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {/* Row 1: Name + Company */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Company" name="company" required />
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>

      {/* Quote-specific fields – landscape layout */}
      {variant === "quote" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Origin country / city" name="origin" required />
            {countries.length > 0 ? (
              <SelectField
                label="Destination country"
                name="destination"
                options={countries.map((c) => ({
                  value: c.name,
                  label: c.subtitle ? `${c.name} (${c.subtitle})` : c.name,
                }))}
                required
              />
            ) : (
              <Field label="Destination country / city" name="destination" required />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Product line"
              name="product"
              options={products.map((p) => ({ value: p.slug, label: p.title }))}
              loading={catalogLoading}
              placeholder="Not applicable / not sure"
            />
            <Field label="Incoterms (if known)" name="incoterms" placeholder="e.g. FOB Mumbai, CIF Houston" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estimated volume" name="volume" placeholder="e.g. 1×40ft FCL, 500 kg air" />
            <div /> {/* Spacer */}
          </div>
        </>
      )}

      {/* Message – full width, reduced height for landscape */}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground/90">
          {variant === "quote" ? "Product / cargo details & timeline" : "Message"}
          <span className="ml-1 text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          required
          className={cn(inputClass, "resize-y")}
          placeholder={
            variant === "quote"
              ? "Product specs, packaging, certifications needed, target ship date..."
              : "How can we help?"
          }
        />
      </div>

      {/* Error message */}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {/* Submit button – inline on desktop, full on mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting || catalogLoading}
          className="rounded-xl bg-gradient-to-r from-secondary to-secondary/80 px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-secondary/30 disabled:opacity-60"
        >
          {submitting ? "Sending..." : variant === "quote" ? "Submit quote request" : "Send message"}
        </button>
        <p className="text-xs text-muted">
          We respond within one business day.
        </p>
      </div>
    </form>
  );
}

// Input styling – with 3D hover effect (lift + grey shadow)
const inputClass =
  "mt-1 w-full rounded-lg border border-border/80 bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition-all duration-200 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 hover:-translate-y-0.5 hover:shadow-md";

// Basic field component
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
        {required && <span className="ml-1 text-accent">*</span>}
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

// Select field component (inherits same hover)
function SelectField({
  label,
  name,
  options,
  required,
  placeholder,
  loading,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  loading?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-foreground/90">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        disabled={loading}
        defaultValue=""
        className={cn(inputClass, "cursor-pointer")}
      >
        <option value="" disabled>
          {loading ? "Loading..." : placeholder || `Select ${label.toLowerCase()}`}
        </option>
        {!loading &&
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        {!loading && placeholder && (
          <option value="other">Other — specify in message</option>
        )}
      </select>
    </div>
  );
}