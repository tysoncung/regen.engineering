// Four pages does not justify a build dependency. If the page count grows past
// a handful, replace this with @astrojs/sitemap.
const SITE = 'https://regen.engineering'
const PAGES = ['/', '/start', '/maturity', '/glossary']

export function GET() {
  const urls = PAGES.map(
    (path) => `  <url>
    <loc>${SITE}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  ).join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { 'content-type': 'application/xml' } },
  )
}
