const path = require('path');
const queries = require('./src/utils/algolia');
require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: 'Сделано в Саратове',
    description: 'Специалист по веб-разработке.',
    siteUrl: 'https://build-in-saratov.com', // full path to blog - no ending slash
    coverImage: 'img/blog-cover.jpg',
    logo: 'img/logo.svg',
    lang: 'ru',
    domain: 'build-in-saratov.com',
    quora: 'Sergey-Monin',
    twitter: 'act_as_samurai',
    vk: 'id242988580',
    showSubscribe: false,
  },
  plugins: [
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: path.join(__dirname, 'src', 'content'),
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images-grid',
            options: {
              gridGap: '0',
              margin: '20px auto',
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1170,
              quality: 90,
              // Add captions to images
              showCaptions: true,
              // Add webp version
              withWebp: true,
              linkImagesToOriginal: false, // For medium-style zoom to work
            },
          },
        ],
      },
    },
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://build-in-saratov.com',
      },
    },
    'gatsby-remark-images-medium-zoom',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    // SEO-related functionality
    'gatsby-plugin-advanced-sitemap',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-extract-schema',
    'gatsby-plugin-offline',
    // Add algolia search
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000, // default: 1000
      },
    },
    // Add manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Build in Saratov`,
        short_name: `Build in Saratov`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#164194`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `src/apple-touch-icon.png`, // This path is relative to the root of the site.
        include_favicon: true, // Include favicon
      },
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          'G-5W0DYF99WS', // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared accross all trackingIds
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Setting this parameter is also optional
          respectDNT: true,
          // Avoids sending pageview hits from custom paths
          exclude: ['/preview/**'],
        },
      },
    },
  ],
};
