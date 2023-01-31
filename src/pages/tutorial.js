import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { F_TR_BILL_RATE } from "../components/input-fields.js";

const TutorialPage = () => {
  return (
    <Layout pageTitle="Tutorial">
      <div className={styles.textContainer}>
        <h2>Tutorial</h2>
        <p>
          Welcome to Mean-Variance Analyzer! MVA is an educational tool meant to
          help people new to financial engineering start their journey learning
          about the history of portfolio optimization. To get started, click
          either the "Get started!" link on the home page (below) or the
          "Analyzer" link in the navigation menu.
        </p>
        <StaticImage
          src="../images/tutorial-home.png"
          alt="MVA home screen"
          className={styles.tutorialImg}
        />
        <p>
          This should take you to the input form (below). Enter all the assets
          of interest into the corrsponding input fields. You can start typing a
          ticker or company name and if it is in the preloaded dataset of over
          100 popular assets it should appear in the dropdown datalist and be
          clickable (you are encouraged to read more about{" "}
          <a
            href="https://github.com/pfischer1687/get-json-data-for-mva"
            target="_blank"
            rel="noreferrer"
          >
            how the data was collected
          </a>{" "}
          - note that the developer is not liable for the accuracy or freshness
          of any data or information given on the site as per the{" "}
          <Link to="/terms">Terms of Service</Link>). You must enter at least
          two unique tickers from the dataset and you can press the "+ Add
          Asset" button to add up to 15 assets. Once you have chosen all your
          assets, you have the option to set the maximum allocation that can be
          given to any individual asset in the portfolio (the default is 100%).
          This number must be larger than 100% / (#assets - 1) and less than or
          equal to 100%. Then you have the option to enter a custom benchmark -
          the default value is the the 3 month Treasury bill rate at the time of
          this site's development ({F_TR_BILL_RATE}) but you can enter any value
          between -50% and 50% to use a custom rate, asset, or portfolio as your
          benchmark.
        </p>
        <StaticImage
          src="../images/tutorial-input-form.png"
          alt="Analyzer page input form"
          className={styles.tutorialImg}
        />
        <p>
          If there are no errors in the input fields, a scatter plot will appear
          (example below) giving a visual representation of the approximated
          maximum Sharpe ratio, single asset returns, efficient frontier,
          Markowitz bullet and tangency portfolio (explained on the{" "}
          <Link to="/background">Background</Link> page). You can hover over or
          click on points on the plot to see the portfolios that produced each
          point on the efficient frontier, the max Sharpe ratio and the
          information for each single asset. Below that will be a pie chart
          visualizing the allocations that produced the maximum sharpe ratio
          with its corresponding information.
        </p>
        <StaticImage
          src="../images/tutorial-optimizer.png"
          alt="Sample Markowitz bullet scatter plot with optimal Sharpe ratio pie chart"
          className={styles.tutorialImg}
        />
        <p>
          Now you're ready to have some fun experimenting. Thank you for
          visiting this site and reading the tutorial. I hope you enjoy it and
          learn something new!
        </p>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Tutorial" />;

export default TutorialPage;
