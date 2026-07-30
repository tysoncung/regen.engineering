// Serves the static site, plus the two things static assets cannot do:
// redirect plain HTTP to HTTPS, and accept the mailing list form.
//
// The zone-level "Always Use HTTPS" setting does not apply to a Workers custom
// domain, because the request reaches this Worker first.
//
// `run_worker_first` in wrangler.jsonc is load-bearing: by default Cloudflare
// serves a matching static file straight from the edge and never invokes this
// Worker at all.

const VERSION = 'v3'

/**
 * The scheme the visitor actually used.
 *
 * `new URL(request.url).protocol` is not reliable at the edge, because TLS
 * terminates before the Worker runs and the URL can read as https even when the
 * visitor arrived over http. CF-Visitor carries the original scheme, which is
 * what Cloudflare documents for this case.
 */
function visitorScheme(request) {
  const cfVisitor = request.headers.get('cf-visitor')
  if (cfVisitor) {
    try {
      const scheme = JSON.parse(cfVisitor).scheme
      if (scheme) return scheme
    } catch {
      // fall through to the other signals
    }
  }
  const forwarded = request.headers.get('x-forwarded-proto')
  if (forwarded) return forwarded.split(',')[0].trim()
  return new URL(request.url).protocol.replace(':', '')
}

const page = (status, heading, body) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${heading} | Regen Engineering</title>
<style>
:root{color-scheme:light dark;--bg:#fdfdfb;--text:#1a1a17;--muted:#6a6a63;--accent:#2c7a58}
@media(prefers-color-scheme:dark){:root{--bg:#0e100f;--text:#e9e9e4;--muted:#9b9b93;--accent:#63c398}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--text);
font:1.0625rem/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;padding:1.5rem}
main{max-width:32rem}h1{font-size:1.6rem;letter-spacing:-.02em;margin:0 0 .75rem}
p{margin:0 0 1.25rem;color:var(--muted)}a{color:var(--accent)}
</style></head><body><main><h1>${heading}</h1><p>${body}</p>
<p><a href="/">Back to the manifesto</a></p></main></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } },
  )

// Deliberately permissive. The job is to reject obvious rubbish, not to police
// the RFC; over-strict validation rejects real addresses.
const looksLikeEmail = (value) =>
  typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(value)

async function subscribe(request, env) {
  const form = await request.formData().catch(() => null)
  const email = form?.get('email')?.toString().trim().toLowerCase()

  if (!looksLikeEmail(email)) {
    return page(400, 'That address did not look right', 'Have another go, or just watch the repository on GitHub instead.')
  }

  // The honeypot is a field hidden from humans by CSS. Bots fill it in.
  if (form.get('company')) return page(200, 'Thank you', 'You are on the list.')

  if (!env.SUBSCRIBERS) {
    // Fail loudly in the logs and gently in the browser, rather than silently
    // dropping an address someone deliberately gave us.
    console.error('SUBSCRIBERS KV binding is missing; subscription dropped')
    return page(
      503,
      'The list is not open yet',
      'Sorry, this is not wired up on my end. Watch <a href="https://github.com/tysoncung/regen.engineering">the repository</a> in the meantime.',
    )
  }

  await env.SUBSCRIBERS.put(
    `sub:${email}`,
    JSON.stringify({
      email,
      at: new Date().toISOString(),
      country: request.headers.get('cf-ipcountry') ?? null,
      ref: form.get('ref')?.toString() ?? null,
    }),
  )

  return page(
    200,
    'Thank you',
    'You will hear from me when there is something worth reading, which will not be often.',
  )
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (visitorScheme(request) === 'http') {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    // www exists only to send people to the apex.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    if (url.pathname === '/subscribe') {
      if (request.method !== 'POST') return page(405, 'Wrong method', 'That endpoint only accepts form posts.')
      return subscribe(request, env)
    }

    const response = await env.ASSETS.fetch(request)

    // Makes deployment observable from outside. Without it there is no way to
    // tell "not deployed" from "deployed but never invoked", which cost real
    // debugging time once already.
    const out = new Response(response.body, response)
    out.headers.set('x-regen-worker', VERSION)
    return out
  },
}
