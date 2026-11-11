// Optional tester email sign-up for /beta/.
// POST /api/tester-signup  { email, consent, website }
// Stores only the email and a timestamp in the TESTERS D1 database.
// Preview deployments bind stinkdoku-android-testers-preview;
// production deployments would bind stinkdoku-android-testers.
// This endpoint never sends email. The client IP is used only as a
// rate-limit key and is not stored.

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,62}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,62}[A-Za-z0-9])?)+$/;
const LIMIT = 5;
const WINDOW_MS = 60_000;

const recent = new Map();

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function jsonError(error, status) {
  return json({ error }, status);
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  return EMAIL_RE.test(email) ? email : null;
}

function allowRequest(request) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const times = (recent.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= LIMIT) {
    recent.set(ip, times);
    return false;
  }
  times.push(now);
  recent.set(ip, times);
  if (recent.size > 2000) {
    for (const [key, stamps] of recent) {
      if (!stamps.length || now - stamps[stamps.length - 1] >= WINDOW_MS) recent.delete(key);
    }
  }
  return true;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.TESTERS) return jsonError('unavailable', 503);
  if (!allowRequest(request)) return jsonError('rate_limited', 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError('bad_request', 400);
  }
  if (!body || typeof body !== 'object') return jsonError('bad_request', 400);

  // Honeypot: a hidden field people never see. Pretend it worked and store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') return json({ ok: true });

  if (body.consent !== true) return jsonError('consent_required', 400);
  const email = normalizeEmail(body.email);
  if (!email) return jsonError('bad_email', 400);

  await env.TESTERS.prepare('insert or ignore into android_testers (email, created_at) values (?, ?)')
    .bind(email, Date.now())
    .run();
  return json({ ok: true });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return jsonError('method', 405);
}
