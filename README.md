# Dr. K. Palani Kumar — Academic Portfolio Website

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind · PostgreSQL (Supabase or any Postgres) · secure admin panel.
All content comes from the Bio-Data and lives in the database, editable from `/admin`.

## Quick start (local, zero config)

```bash
npm install
cp .env.example .env.local        # optional locally; set AUTH_SECRET for anything but a quick look
npm run create-admin              # creates your admin login (password min 12 chars)
npm run dev                       # http://localhost:3000   admin: /admin
```

With `DATABASE_URL` empty, the site uses an embedded Postgres (PGlite) stored in `.data/pglite`.
On first start the database is created and filled from `data/seed/*.json` automatically.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `AUTH_SECRET` | **Yes in production** | 32+ random chars (`openssl rand -hex 32`). Signs admin sessions. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public URL, used for canonical links, sitemap, Open Graph. |
| `DATABASE_URL` | Production | Postgres connection string (Supabase: *Project Settings → Database → Connection string*, use the pooler URL). |
| `DATABASE_SSL` | No | `false` to disable SSL for a non-local DB that doesn't support it. |
| `AUTO_SEED` | No | `false` to stop auto-seeding an empty database. |
| `UPLOAD_DIR` | VPS/Docker | Folder for uploaded images/PDFs (persist it with a volume). |
| `SUPABASE_*` | Optional | Supabase Storage for uploads on serverless hosts (see `.env.example`). |

## Database setup

Tables are created automatically on first request (idempotent). To do it explicitly:

```bash
npm run db:push            # create/upgrade tables
npm run db:seed            # load Bio-Data content into empty tables
npm run db:seed -- --wipe  # replace ALL content with the seed (admin users are kept)
```

## Create / reset an admin

```bash
npm run create-admin
# non-interactive:
ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD='a-long-password' npm run create-admin
```
Running it again for the same e-mail resets that password. Install dev dependencies on the server (`npm ci`, not `--omit=dev`) so `tsx` is available.

## Deployment

> Step-by-step GitHub + Supabase + Vercel guide: **DEPLOY.md**. Admin login uses **Supabase Auth** (credentials) plus an `admin_users` allow-list; the SQL migration in `supabase/migrations/` enables Row Level Security and the storage bucket policies. Without `SUPABASE_*` variables the site runs in local mode (embedded database, local password).


**Vercel + Supabase (recommended for a managed setup)**
1. Create a Supabase project; copy the Postgres connection string.
2. Import the repo in Vercel; set `AUTH_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`.
3. Vercel's disk is read-only/ephemeral, so for uploads set the `SUPABASE_*` variables (a public bucket) — otherwise use a VPS.
4. Deploy, then run `DATABASE_URL=… npm run create-admin` once from your machine.

**VPS / Docker**
```bash
docker build -t palanikumar-site .
docker run -d -p 3000:3000 --env-file .env.production -v pk_uploads:/data/uploads -e UPLOAD_DIR=/data/uploads palanikumar-site
docker exec -it <container> npm run create-admin
```
Put Nginx/Caddy in front for HTTPS. Without Docker: `npm ci && npm run build && npm start`.

## Admin panel (`/admin`)

Dashboard with live counts and activity log; add / edit / delete / search / filter / publish-toggle for publications, patents, projects, scholars, awards, memberships, editorial roles, books, consultancy, gallery, news, statistics, qualifications, experience, research interests and social links. Profile & biography editor with portrait upload. **Settings & CV** replaces the downloadable PDF. Gallery supports drag-and-drop multi-upload and drag-to-reorder (use *Reorder* on any sortable list).

## Security

bcrypt (cost 12) password hashes · signed httpOnly SameSite cookie sessions (8h) · edge middleware plus per-request DB check · login rate limiting · Origin check on writes · zod validation on every field · parameterised SQL only · uploads verified by file signature (JPG/PNG/WebP/GIF/PDF only, size-capped, SVG refused) · audit log · security headers.

## Content notes

See **DATA_VERIFICATION.md** — conflicting statistics (310 vs 353 articles) are shown separately and labelled, never merged. Only the three verified social links are used (Facebook, LinkedIn, Google Scholar). Images come solely from the Bio-Data; replace/add more in the admin.

## Project layout

`src/lib/resources.ts` is the single definition of every content type (schema, validation, admin forms). `data/seed/` holds content separate from UI. `src/app/(site)` public pages · `src/app/admin` panel · `src/app/api/admin` API.
