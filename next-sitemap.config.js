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
        disallow: ['/api/', '/_next/'],
      },
    ],
    additionalSitemaps: [
      'https://ausmalbilder-gratis.com/sitemap-images.xml',
    ],
  },
  transform: async (config, path) => {
    // Higher priority for main pages
    let priority = 0.7
    let changefreq = 'weekly'

    if (path === '/') {
      priority = 1.0
      changefreq = 'daily'
    } else if (path === '/ausmalbilder' || path === '/mandala') {
      priority = 0.9
      changefreq = 'daily'
    } else if (path.includes('/tiere/pferd/') && path.split('/').length > 3) {
      priority = 0.8
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
