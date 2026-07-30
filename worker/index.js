// Serves the static site, with one piece of behaviour that static assets alone
// cannot provide: redirecting plain HTTP to HTTPS.
//
// The zone-level "Always Use HTTPS" setting does not apply to a Workers custom
// domain, because the request reaches this Worker before that redirect would
// happen. Cloudflare's own guidance for custom domains is to do it here.

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    // www exists only to send people to the apex.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
