import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import * as styles from "../components/index.module.css";
import { Link } from "gatsby";

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <div className={styles.indexGridContainer}>
        <div className={styles.headerContainer}>
          <h1>Mean-Variance Analyzer</h1>
          <div>
            <p>
              This is a mean-variance analyzer for financial portfolios via
              Monte Carlo simulation. Learn more by following the{" "}
              <Link to="/tutorial">tutorial</Link>.
            </p>
            <button>
              <Link to="/start">Start now</Link>
            </button>
          </div>
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
