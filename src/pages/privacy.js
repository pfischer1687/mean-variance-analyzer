import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";

const PrivacyPage = () => {
  return (
    <Layout pageTitle="Privacy">
      <div className={styles.textContainer}>
        <h2>About Mean-Variance Analyzer</h2>
        <p>
          MVA is an educational tool meant to help people interested in finance
          to start their journey in learning about the history of portfolio
          optimization. In 1990, an economist named William F. Sharpe won the
          Nobel Prize for his work on the Capital Asset Pricing Model (CAPM),
          which influenced his proposal of the Sharpe ratio in 1966 which he
          called the reward-to-variability ratio (cite!). Please read the
          toturial (link) to learn more!
        </p>
        <h2>About the Developer</h2>
        <p>
          Hi there! I'm Paul and I am a theoretical physics graduate student who
          is interested in web development and financial engineering. You can
          learn more about me by checking out my website (link).
        </p>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Privacy" />;

export default PrivacyPage;
