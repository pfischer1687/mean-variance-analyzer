module.exports = {
  siteMetadata: {
    title: "Mean-Variance Analyzer",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Simple Sharpe Ratio Optimizer`,
        short_name: `SSRO`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: "src/favicon.png",
      },
    },
  ],
};
