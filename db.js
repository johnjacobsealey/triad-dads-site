// Drop-in replacement for Claude's artifact-only `window.storage` API.
// Backed by a single "kv_store" table in Supabase (see supabase-setup.sql).
// Same get/set shape as before, minus the personal/shared distinction —
// everything here is site content, so it's always shared.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function assertConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase isn't configured yet. Copy .env.example to .env.local, fill in your project URL and anon key, and restart the dev server. See README.md."
    );
  }
}

function headers(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export const db = {
  async get(key) {
    assertConfigured();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/kv_store?key=eq.${encodeURIComponent(key)}&select=value`,
      { headers: headers() }
    );
    if (!res.ok) throw new Error(`Storage read failed (${res.status})`);
    const rows = await res.json();
    if (!rows.length) return null;
    return { key, value: rows[0].value };
  },

  async set(key, value) {
    assertConfigured();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/kv_store`, {
      method: "POST",
      headers: headers({
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error(`Storage write failed (${res.status})`);
    return { key, value };
  },
};
