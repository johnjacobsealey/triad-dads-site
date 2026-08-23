# Triad Dads — deployable site

This is the real, deployable version of the Triad Dads site: same design, city
guides, articles, events, About section, social links, and discussion board
as the Claude prototype — but running on a real backend so it works on your
own domain instead of only inside Claude.

Everything (articles, events, city blurbs, About text, social links, theme
colors/fonts, and the logo) is editable from the Admin panel once it's live,
and now saves to a real database instead of Claude's artifact storage.

## 1. Create a free Supabase project (your database)

1. Go to [supabase.com](https://supabase.com) and create a free account + new project.
2. Once it's created, open **SQL Editor** in the left sidebar, paste in the
   contents of `supabase-setup.sql` from this folder, and run it. This creates
   the one table the site needs.
3. Go to **Settings -> API**. You'll need two values from this page:
   - **Project URL**
   - **anon public** key

## 2. Configure the app locally

1. Copy `.env.example` to a new file named `.env.local`.
2. Paste in your Project URL and anon key from step 1.
3. Install dependencies and run it locally to confirm it works:

   ```
   npm install
   npm run dev
   ```

   Open the URL it prints (usually `http://localhost:5173`). You should see
   the site load with all the default content.

## 3. Change the admin passcode

Open `src/App.jsx` and find this line near the top:

```js
const ADMIN_PASSCODE = "#C0wb0ysnumber1984";
```

Change it to something only you know before you deploy publicly. This is a
simple front-end gate (good for keeping casual visitors out of Admin) — it
is not the same as real server-side authentication, so don't reuse a
password you use anywhere sensitive.

## 4. Deploy it

Push this folder to a GitHub repository, then connect it to **Vercel** or
**Netlify** (both have free tiers and auto-detect Vite projects — no config
needed):

1. Sign up / log in, click "New Project" / "Add new site", and import the
   GitHub repo.
2. In the project's environment variable settings, add the same two values
   from your `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy. You'll get a live URL like `triad-dads-site.vercel.app`.

## 5. Buy the domain and connect it

1. Buy `triaddadsofnc.com` from a registrar — Namecheap, Cloudflare
   Registrar, or Google/Squarespace Domains are all reputable, no-frills
   options.
2. In your Vercel or Netlify project settings, find "Domains" and add
   `triaddadsofnc.com`.
3. It'll give you one or two DNS records to add (usually an A record and/or
   a CNAME). Add those in your registrar's DNS settings.
4. DNS changes can take a few minutes to a few hours to go live. SSL
   (the padlock/https) is issued automatically once it does.

## What changed from the Claude version

- All storage now goes through `src/db.js`, which talks to your Supabase
  table instead of Claude's artifact-only `window.storage`.
- Everything else — city guides, article images, events, About, social
  links, comment threads with delete — works the same way it did before.
- New: **Branding** tab in Admin (site name, tagline, logo upload) and
  **Theme** tab (every color, plus a heading/body font picker) — so you can
  reskin the site without touching code.

## A couple of honest notes

- **Images are stored as embedded data** in the database (not a file/CDN),
  so keep photos reasonably sized — a phone photo straight off a modern
  camera can be several MB, and a handful of those adds up fast in a text
  column. If this becomes a real bottleneck later, ask Claude to wire up
  Supabase Storage (proper file hosting) instead — it's a fairly small
  change from here.
- **The Supabase table is set up with open read/write access**, relying on
  the site's passcode as the only gate. Fine for a small local site with no
  logins; if you want tighter security down the line, ask Claude to help
  add real Supabase authentication.
