/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://godot4games.com',
  generateRobotsTxt: true, // (Optional) Generates a robots.txt file
  sitemapSize: 5000, // Split sitemaps after reaching the limit
  changefreq: 'weekly', // Set default change frequency to weekly
  priority: 0.7, // Set default priority
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }, // Allow all other pages
      { userAgent: '*', disallow: '/checkout' }, // Disallow the checkout page
      { userAgent: '*', disallow: '/confirm-email' }, // Disallow the confirm email page
      { userAgent: '*', disallow: '/login-callback' }, // Disallow the discord OAuth2 login callback
      { userAgent: '*', disallow: '/discord-callback' }, // Disallow the discord OAuth2 login callback
      { userAgent: '*', disallow: '/orders/*/payment' }, // Disallow payment pages
      { userAgent: '*', disallow: '/my-games' } // Disallow game shelf page
    ]
  }
}
