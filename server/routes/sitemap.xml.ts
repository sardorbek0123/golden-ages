type EntityWithSlug = { slug: string }

const API_BASE_URL = 'https://api.goldenagestravel.com/api'
const locales = ['en', 'ru', 'uz', 'es', 'de', 'fr']
const staticRoutes = ['/', '/about', '/contacts', '/tours', '/culture', '/shop']

function localePath(locale: string, path: string) {
  if (locale === 'en') {
    return path
  }

  return `/${locale}${path === '/' ? '' : path}`
}

function withAlternates(path: string, siteUrl: string) {
  return locales.map(locale => {
    const href = new URL(localePath(locale, path), siteUrl).toString()
    return `<xhtml:link rel="alternate" hreflang="${locale}" href="${href}" />`
  }).join('')
}

function createUrlEntry(path: string, siteUrl: string, lastmod?: string) {
  const loc = new URL(path, siteUrl).toString()
  const lastModified = lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''

  return `<url><loc>${loc}</loc>${lastModified}${withAlternates(path, siteUrl)}<changefreq>weekly</changefreq></url>`
}

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl as string

  const [trips, cities, blogs] = await Promise.all([
    $fetch<{ results: EntityWithSlug[] }>(`${API_BASE_URL}/trips/?limit=500`).catch(() => ({ results: [] })),
    $fetch<{ results: EntityWithSlug[] }>(`${API_BASE_URL}/cities/?limit=500`).catch(() => ({ results: [] })),
    $fetch<{ results: EntityWithSlug[] }>(`${API_BASE_URL}/blogs/?limit=500`).catch(() => ({ results: [] }))
  ])

  const localizedUrls = locales.flatMap(locale => {
    const pages = staticRoutes.map(path => localePath(locale, path))
    const tripPages = trips.results.map(trip => localePath(locale, `/tours/${trip.slug}`))
    const cityPages = cities.results.map(city => localePath(locale, `/cities/${city.slug}`))
    const blogPages = blogs.results.map(blog => localePath(locale, `/culture/${blog.slug}`))

    return [...pages, ...tripPages, ...cityPages, ...blogPages]
  })

  const uniqueUrls = [...new Set(localizedUrls)]
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${uniqueUrls.map(url => createUrlEntry(url, siteUrl)).join('')}</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
