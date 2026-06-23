type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inject schema.org JSON-LD for search engines. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
