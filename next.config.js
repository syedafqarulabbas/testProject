process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const jssConfig = require('./src/temp/config');
const plugins = require('./src/temp/next-config-plugins') || {};

const publicUrl = jssConfig.publicUrl;

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Remove assetPrefix to fix CSS loading issues
  // assetPrefix: publicUrl,

  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // Make the same PUBLIC_URL available as an environment variable on the client bundle
  env: {
    PUBLIC_URL: publicUrl,
  },

  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en', 'ar'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/styleguide`.
    defaultLocale: jssConfig.defaultLanguage,
  },

  // Enable React Strict Mode
  reactStrictMode: false,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kfiajss.local',
      },
      {
        protocol: 'https',
        hostname: 'uat.kfia.sa',
      },
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'feaas*.blob.core.windows.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'sc104sc.dev.local',
      },
      {
        protocol: 'https',
        hostname: 'uat-cm.dammamairports.sa',
      },
      {
        protocol: 'https',
        hostname: 'prod-cd.dammamairports.sa',
      },
      {
        protocol: 'https',
        hostname: 'daco.cm',
      },
      {
        protocol: 'https',
        hostname: 'kfiasc.dev.local',
      },
      {
        protocol: 'https',
        hostname: 'daco.cd',
      },
    ],
    // Advanced optimization settings
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  async rewrites() {
    // When in connected mode we want to proxy Sitecore paths off to Sitecore
    return [
      // API endpoints
      {
        source: "/sitecore/api/:path*",
        destination: `${jssConfig.sitecoreApiHost}/sitecore/api/:path*?sc_apikey=${jssConfig.sitecoreApiKey}`,
      },
      // media items — routed through custom API proxy to handle TLS certificate issues
      // (Next.js rewrite proxy uses undici and ignores NODE_TLS_REJECT_UNAUTHORIZED)
      {
        source: '/-/:path*',
        destination: '/api/sc-media/:path*',
      },
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // rewrite for Sitecore service pages
      {
        source: '/sitecore/service/:path*',
        destination: `${jssConfig.sitecoreApiHost}/sitecore/service/:path*`,
      },
      // rewrite for Sitecore layouts/system (VisitorIdentification, tracking ASPX, etc)
      // routes through API proxy to handle TLS certificate issues
      {
        source: '/layouts/:path*',
        destination: '/api/layouts/:path*',
      },
    ];
  },
};

module.exports = () => {
  // Run the base config through any configured plugins
  return Object.values(plugins).reduce((acc, plugin) => plugin(acc), nextConfig);

};
