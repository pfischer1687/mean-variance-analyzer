module.exports = {
  siteMetadata: {
    title: "Simple Sharpe Ratio Optimizer",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/markdown/`,
      },
    },
    "gatsby-plugin-mdx",
    "gatsby-transformer-sharp",
  ],
};
