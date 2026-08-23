-- Run this once in your Supabase project's SQL Editor (left sidebar -> SQL Editor -> New query).
-- It creates the one table the site needs: a simple key/value store for
-- site content (articles, events, cities, theme, branding) and comment threads.

create table if not exists kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table kv_store enable row level security;

-- Public read/write, gated by the passcode in the app itself.
-- This is fine for a small local site with no user accounts, but it does mean
-- anyone who finds your Supabase URL + anon key could write to this table
-- directly (bypassing the site's admin passcode). If that ever matters more
-- than convenience, come back and ask Claude to lock this down with proper
-- Supabase auth instead of open RLS policies.
create policy "public read" on kv_store for select using (true);
create policy "public insert" on kv_store for insert with check (true);
create policy "public update" on kv_store for update using (true);
