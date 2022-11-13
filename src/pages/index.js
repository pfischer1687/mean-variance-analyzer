import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import * as styles from "../components/index.module.css";

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <div class={styles.indexGridContainer}>
        <div class={styles.headerContainer}>
          <h1>Mean-Variance Analyzer</h1>
          <h2>
            This is a mean-variance analyzer for financial portfolios via Monte
            Carlo simulation.
          </h2>
        </div>
        <StaticImage
          alt="Clifford, a reddish-brown pitbull, dozing in a bean bag chair"
          src="../images/clifford.jpg"
          width={300}
        />
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Home Page" />;

export default IndexPage;
