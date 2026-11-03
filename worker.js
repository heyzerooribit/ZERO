// Cloudflare Worker: tells the ZERØ site whether your TikTok is live right now.
// Set these in Cloudflare (Worker > Settings > Variables and Secrets):
//   TIKTOK_USERNAME  your TikTok username, no @        (text)
//   TIKTOK_API_KEY   your tik.tools API key             (secret)
//   ALLOWED_ORIGIN   optional, your site address, e.g. https://yourname.github.io
//   CACHE_SECONDS    optional, how long to remember an answer (default 120). Higher = fewer checks.
const API = 'https://api.tik.tools';

// Looks for a true/false "is_live" or "alive" anywhere in the response.
function findLive(x) {
  if (!x || typeof x !== 'object') return null;
  if (typeof x.is_live === 'boolean') return x.is_live;
  if (typeof x.alive === 'boolean') return x.alive;
  for (const k in x) { const v = findLive(x[k]); if (v !== null) return v; }
  return null;
}

async function check(env) {
  const user = String(env.TIKTOK_USERNAME || '').replace(/^@/, '').trim();
  if (!user || !env.TIKTOK_API_KEY) return { live: null, error: 'not configured' };
  const headers = { 'x-api-key': env.TIKTOK_API_KEY };
  try { // first choice: the bulk check, which takes usernames directly
    const r = await fetch(API + '/webcast/bulk_live_check', {
      method: 'POST', headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ usernames: [user] })
    });
    if (r.ok) { const v = findLive(await r.json()); if (v !== null) return { live: v }; }
  } catch (e) {}
  try { // backup: the quick single-user check
    const r = await fetch(API + '/webcast/live_status?uniqueId=' + encodeURIComponent(user), { headers });
    if (r.ok) { const v = findLive(await r.json()); if (v !== null) return { live: v }; }
  } catch (e) {}
  return { live: null, error: 'could not check' };
}

export default {
  async fetch(req, env, ctx) {
    const ttl = Math.max(30, parseInt(env.CACHE_SECONDS, 10) || 120);
    const cors = {
      'access-control-allow-origin': env.ALLOWED_ORIGIN || '*',
      'access-control-allow-methods': 'GET',
      'cache-control': 'public, max-age=' + ttl
    };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    const key = new Request(new URL(req.url).origin + '/status');
    if (cache) { const hit = await cache.match(key); if (hit) return hit; }
    const out = await check(env); out.checkedAt = Date.now();
    const res = new Response(JSON.stringify(out), { headers: { ...cors, 'content-type': 'application/json' } });
    if (cache && out.live !== null) ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  }
};
