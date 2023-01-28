import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import * as styles from "../components/index.module.css";
import { Link } from "gatsby";

const IndexPage = () => {
  return (
    <Layout pageTitle="Home">
      <div className={styles.indexGridContainer}>
        <div>
          <span className={styles.mvaLogo}>
            <StaticImage
              src="../images/mva-logo-small.png"
              alt="Mean-Variance Analyzer MVA logo"
            />
          </span>
        </div>
        <div className={styles.headerContainer}>
          <h2 className={styles.heroTextTop}>Mean-Variance Analyzer</h2>
          <h2 className={styles.heroTextBottom} aria-hidden="true">
            Mean-Variance Analyzer
          </h2>
          <div>
            <p className={styles.flyingHeroSubtext}>
              Learn about modern portfolio theory - interactively! If you're new
              here, please start by following the{" "}
              <Link to="/tutorial">tutorial</Link>. Otherwise, click the link
              below to get started!
            </p>
            <Link to="/start">
              <button className={styles.flyingButton}>
                <span>Get started!</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Home" />;

export default IndexPage;
