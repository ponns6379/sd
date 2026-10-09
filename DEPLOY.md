# Upload to GitHub → deploy on Vercel (with Supabase)

Total time ≈ 20 minutes. You need three free accounts: **GitHub**, **Supabase**, **Vercel**.

## 0. Upload the files to GitHub (website method, no commands)
GitHub's web uploader accepts at most **100 files per upload**, so the project is supplied in parts.
1. github.com → **New repository** → name it (e.g. `palanikumar-site`) → *Create repository*.
2. On the empty repository page click **uploading an existing file**.
3. Unzip `github-part-1.zip`. Open the folder, select **everything inside it** (including folders and hidden files such as `.gitignore`, `.env.example`) and drag it into the browser. Wait for the green ticks, then **Commit changes**.
4. Repeat with `github-part-2.zip` (and `github-part-3.zip` if present): repository → **Add file → Upload files** → drag the contents → Commit.
5. Check the repository's top level shows: `src`, `public`, `data`, `scripts`, `supabase`, `package.json`, `next.config.mjs`, `README.md`. The folders must be at the **top level**, not inside another folder.
   - Hidden files: Mac Finder `Cmd+Shift+.`; Windows Explorer *View → Show → Hidden items*.

**Recommended if the website upload ever loses files — GitHub Desktop (no commands):**
1. Install *GitHub Desktop* (desktop.github.com) and sign in.
2. Unzip `palanikumar-site-full.zip`. In GitHub Desktop: *File → Add local repository…* → choose the unzipped `palanikumar-site` folder (it already contains the commit history).
3. Click **Publish repository** (untick "Keep this code private" only if you want it public). Every file is uploaded reliably, with no 100-file limit.

(Command-line alternative: unzip `palanikumar-site-full.zip` and run `git remote add origin <your-repo-url> && git push -u origin main`.)

## 1. Create the Supabase project
1. supabase.com → **New project** (pick a region near India, e.g. Mumbai or Singapore). Save the database password.
2. **Run the database setup:** *SQL Editor → New query* → open `supabase/migrations/20261009000000_init.sql` from the repo, paste the whole file → **Run**. It creates the tables, the Row Level Security policies, and the `site-uploads` storage bucket with its policies.
3. Copy these values (Project Settings):
   - **Database URL:** *Connect* → **Transaction pooler** (port 6543) URI, with your password filled in.
   - **Project URL** and **anon public key** and **service_role key** (*Project Settings → API*).

## 2. Deploy on Vercel
1. vercel.com → **Add New → Project** → import the GitHub repo (Framework preset: Next.js; leave *Root Directory* empty).
2. Add Environment Variables:

| Name | Value |
|---|---|
| `AUTH_SECRET` | random 32+ characters (e.g. from a password generator) |
| `DATABASE_URL` | Supabase pooler URI |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (secret) |
| `SUPABASE_BUCKET` | `site-uploads` |
| `NEXT_PUBLIC_SITE_URL` | your site address, e.g. `https://your-project.vercel.app` |

3. **Deploy.** The first page visit loads the Bio-Data content into the database automatically.

## 3. Create the first administrator (once, from your computer)
Needs Node.js 20+.
```bash
npm install
SUPABASE_URL=… SUPABASE_ANON_KEY=… SUPABASE_SERVICE_ROLE_KEY=… DATABASE_URL=… \
ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD='a-long-password-12+' npm run create-admin
```
This creates the user in **Supabase Auth** and adds the e-mail to the admin allow-list. Sign in at `https://<your-site>/admin`.
(No computer with Node? In Supabase: *Authentication → Users → Add user* (tick auto-confirm), then *SQL Editor*: `insert into admin_users (email, name) values ('you@example.com','Your Name');`)

## 4. Updating content later
Everything is edited at `/admin` and saved to the database — no redeploy needed. CSV export/import is on every list.

## Troubleshooting
- **"PROJECT FILES ARE MISSING"** (printed at the start of the Vercel build) → the build lists exactly which files did not reach GitHub and which zip they belong to. Re-upload that part, or use the GitHub Desktop method above.
- **"Couldn't find any `pages` or `app` directory"** → the `src` folder is missing or nested in the repo. Open the repo on github.com: clicking `src` must show `app`, `components`, `lib`, `middleware.ts`. If not, use the GitHub Desktop method. *Vercel → Settings → General → Root Directory* must be empty.
- **Build fails: AUTH_SECRET** → add `AUTH_SECRET` (32+ chars) in Vercel and redeploy.
- **Pages show a database error** → check `DATABASE_URL` (use the *pooler* URL with your real password) and that step 1.2 ran.
- **Admin login says incorrect** → run `create-admin` again (it resets the password) and confirm the e-mail is the same.
- **Upload fails** → files must be ≤ 4 MB (Vercel limit); check `SUPABASE_SERVICE_ROLE_KEY` and that the bucket `site-uploads` exists.
- Security note: the `service_role` key and `DATABASE_URL` are server-only; never put them in a `NEXT_PUBLIC_` variable.

## Alternative: deploy straight from your computer (skips GitHub)
Install Node.js 20+, unzip `palanikumar-site-full.zip`, then in that folder run `npx vercel` (log in, accept the defaults), add the environment variables in the Vercel dashboard, and run `npx vercel --prod`. You can connect GitHub later.
