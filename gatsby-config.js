/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: "Mean-Variance Analyzer",
    description: "Learn about modern portfolio theory - interactively!",
    author: "@PaulFis43236408",
    siteUrl: "https://mvanalyzer.dev/",
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mean-Variance Analyzer`,
        short_name: `MVA`,
        start_url: `/`,
        background_color: `#001220`,
        theme_color: `#096002`,
        display: `standalone`,
        icon: "src/images/favicon.png",
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    "gatsby-plugin-offline",
  ],
};
