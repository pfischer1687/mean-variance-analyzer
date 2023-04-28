import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { GET_ASSET_DATA_GH_REPO_URL, F_TR_BILL_RATE } from "../utils";

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
          of interest into the corresponding input fields. You can start typing
          a ticker or company name and, if it is in the preloaded dataset of
          over 100 popular assets, it should appear in the dropdown datalist and
          be clickable (you are encouraged to read more about{" "}
          <a href={GET_ASSET_DATA_GH_REPO_URL} target="_blank" rel="noreferrer">
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
          the default value is the long term average 3-month Treasury bill rate
          at the time of this site's development ({F_TR_BILL_RATE}), but you can
          enter any custom risk-free rate between -50% and 50% as your
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
          maximum Sharpe ratio (or tangency) portfolio, individual assets,
          efficient frontier, Markowitz bullet and capital market line
          (explained on the <Link to="/background">Background</Link> page). You
          can hover over or click on points on the plot to see the portfolios
          that produced each point on the efficient frontier, the allocations
          that produced the tangency portfolio, and the information for each
          individual asset. Below that will be a pie chart visualizing the
          allocations that produced the tangency portfolio along with its
          corresponding information.
        </p>
        <StaticImage
          src="../images/tutorial-scatter.png"
          alt="Sample Markowitz bullet scatter plot"
          className={styles.tutorialImg}
        />
        <StaticImage
          src="../images/tutorial-pie.png"
          alt="Sample tangency portfolio pie chart"
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
