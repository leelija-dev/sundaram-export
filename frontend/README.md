# Sundaram Export — Public Frontend

Marketing site for a multinational export company: **products**, **services**, **markets**, and **contact / quote** forms. Backend API is planned separately — see [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, stats, products, services |
| `/products` | Export product divisions |
| `/products/[slug]` | Product detail |
| `/services` | Export & logistics services |
| `/services/[slug]` | Service detail |
| `/markets` | Global market corridors |
| `/about` | Company overview |
| `/contact` | Contact form |
| `/quote` | Export quote request |

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
frontend/
  src/
    app/           # Routes & pages
    components/    # UI (site-ui, contact-form)
    data/          # Catalog & site content (replace with API later)
      products.ts
      services.ts
      markets.ts
      site.ts
    lib/utils.ts
```

## Next steps (see ARCHITECTURE.md)

1. Add backend API + PostgreSQL
2. `POST /api/v1/inquiries` for contact & quote forms
3. Email notifications to sales desk
4. Optional: Django Admin to edit catalog without code changes

```env
# .env.local (future)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
