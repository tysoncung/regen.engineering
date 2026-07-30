// Serves the static site, plus the one piece of behaviour static assets cannot
// provide on their own: redirecting plain HTTP to HTTPS.
//
// The zone-level "Always Use HTTPS" setting does not apply to a Workers custom
// domain, because the request reaches this Worker first. Cloudflare's guidance
// for custom domains is to do the redirect here.

const VERSION = 'v2'

/**
 * Work out the scheme the visitor actually used.
 *
 * `new URL(request.url).protocol` is not reliable at the Cloudflare edge: TLS
 * terminates before the Worker runs, so the URL can read as https even when the
 * visitor arrived over http. The CF-Visitor header carries the original scheme,
 * which is what Cloudflare documents for exactly this case.
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

    const response = await env.ASSETS.fetch(request)

    // Makes deployment observable from outside. Without this there is no way to
    // tell "the Worker is not deployed" apart from "the Worker is deployed but
    // its logic is wrong", which cost real debugging time.
    const out = new Response(response.body, response)
    out.headers.set('x-regen-worker', VERSION)
    return out
  },
}
