import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";
import { SRC_CODE_URL, DEV_SITE_URL } from "../utils";

const AboutPage = () => {
  return (
    <Layout pageTitle="About">
      <div className={styles.textContainer}>
        <h2>About Mean-Variance Analyzer</h2>
        <p>
          Welcome to Mean-Variance Analyzer! MVA is an educational tool meant to
          help people new to financial engineering start their journey learning
          about the history of portfolio optimization. Please read the{" "}
          <Link to="/tutorial">tutorial</Link> to learn more! If you are curious
          about how the site works, or share my love of Javascript, you are
          encouraged to take a look at the{" "}
          <a href={SRC_CODE_URL} target="_blank" rel="noreferrer">
            source code
          </a>
          .
        </p>
        <h2>About the Developer</h2>
        <p>
          Hi, I'm Paul - a computational physics graduate student perpetually
          interested in learning more about web development and financial
          engineering. Thank you for using my app, I hope you learn something
          from it! You can learn more about me at my{" "}
          <a href={DEV_SITE_URL} target="_blank" rel="noreferrer">
            website
          </a>
          .
        </p>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="About" />;

export default AboutPage;
