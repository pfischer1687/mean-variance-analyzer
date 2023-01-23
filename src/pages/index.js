import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import * as styles from "../components/index.module.css";
import { Link } from "gatsby";

const IndexPage = () => {
  // For text flying in from left animation
  React.useEffect(() => {
    const hiddenElements = document.querySelectorAll(`.${styles.hidden}`);
    hiddenElements.forEach((e, index) => {
      e.classList.add(`${styles.show}`);
      e.style.transitionDelay = `${(index + 1) * 500}ms`;
    });
  });

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
            <p className={styles.hidden}>
              Learn about modern portfolio theory - interactively! If you're new
              here, please start by following the{" "}
              <Link to="/tutorial">tutorial</Link>. Otherwise, click the link
              below to get started!
            </p>
            <Link to="/start">
              <button
                id="getStartedButton"
                className={`${styles.hidden} ${styles.buttonText}`}
              >
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
