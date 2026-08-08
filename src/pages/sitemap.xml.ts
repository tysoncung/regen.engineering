// Derived from the pages directory rather than listed by hand.
//
// The list used to be hardcoded, with a note saying four pages did not justify a
// build dependency. That was a fair call and it had the failure mode it was
// always going to have: adding a fifth page left it out of the sitemap silently,
// and nothing anywhere said so.
//
// This is the third hardcoded-fact bug in this project in a week. The validator
// banner said v0.1 through six releases, the site footer said version 0.2 while
// the manifesto said 0.3, and this. None of them needed a dependency to fix,
// only deriving the value from the thing it was supposed to describe.

const SITE = 'https://regen.engineering'

// Eager, so this resolves at build time and the sitemap is static.
const modules = import.meta.glob('./**/*.{astro,md}', { eager: true })

const paths = Object.keys(modules)
  .map((file) =>
    file
      .replace(/^\.\//, '/')
      .replace(/\.(astro|md)$/, '')
      .replace(/\/index$/, '/'),
  )
  .map((p) => (p === '' ? '/' : p))
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)))

export function GET() {
  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${SITE}${path === '/' ? '/' : path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
    )
    .join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { 'content-type': 'application/xml' } },
  )
}
