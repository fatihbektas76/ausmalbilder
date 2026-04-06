/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ausmalbilder-gratis.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/'],
      },
    ],
    additionalSitemaps: [
      'https://ausmalbilder-gratis.com/sitemap-images.xml',
    ],
  },
  transform: async (config, path) => {
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path === '/ausmalbilder' || path === '/blog') {
      priority = 0.9
      changefreq = 'daily'
    } else if (path.split('/').length === 2 && !path.startsWith('/blog')) {
      // Top-level category pages like /tiere, /mandala
      priority = 0.85
      changefreq = 'weekly'
    } else if (path.split('/').length === 3 && !path.startsWith('/blog')) {
      // Sub-category pages like /tiere/pferd
      priority = 0.8
      changefreq = 'weekly'
    } else if (path.split('/').length >= 4) {
      // Individual image pages like /tiere/pferd/pferd-im-galopp
      priority = 0.8
      changefreq = 'monthly'
    } else if (path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'monthly'
    } else if (['/impressum', '/datenschutz', '/agb'].includes(path)) {
      priority = 0.3
      changefreq = 'yearly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
  exclude: ['/admin', '/admin/*', '/api/*'],
}
