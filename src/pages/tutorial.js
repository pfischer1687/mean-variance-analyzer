import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";

const TutorialPage = () => {
  return (
    <Layout pageTitle="Tutorial">
      <div className={styles.textContainer}>
        <h2>Introduction</h2>
        <p>
          By using this you agree to be bound by the{" "}
          <Link to="/terms">Terms of Service</Link>. No guarantee about the
          accuacy of this data. Welcome to Mean-Variance Analyzer! MVA is an
          educational tool meant to help people interested in finance start
          their journey learning about the history of portfolio optimization. In
          1952, economist Harry Markowitz published the article "Portfolio
          Selection" in The Journal of Finance
          <sup>
            <a href="#references">[1]</a>
          </sup>
          . This introduced modern portfolio theory (also called mean-variance
          analysis) where the expected return of a portfolio is maximized for a
          given level of risk, measured by the variance of asset prices. The
          optimized partf of the risk-return spectrum is called the efficient
          frontier.
        </p>
        <p>
          In 1996, the economist William Sharpe published the article "Mutual
          Fund Prformance" in The Journal of Business which laid the foundation
          for the reward-to-variability ratio (now known as the Sharpe ratio)
          <sup>
            <a href="#references">[2]</a>
          </sup>
          . This research grew from his development of the capital asset pricing
          model, for which shared the 1990 Alfred Nobel Memorial Prize in
          Economic Sciences with Markowitz and Merton Miller
          <sup>
            <a href="#references">[3]</a>
          </sup>
          . In 1994, he published the article "The Sharpe Ratio" in The Journal
          of Portfolio Management where detailed the ex ante Sharpe ratio{" "}
          <sup>
            <a href="#references">[4]</a>
          </sup>
          . He first defines the differential return d, as a function of the
          historical return R<sub>F</sub> on fund F and the historical return R
          <sub>B</sub> on a benchmark portfolio or security (most often the
          annualized 3-month Treasury bill secondary market rate, which at the
          time of development was 3.72%
          <sup>
            <a href="#references">[5]</a>
          </sup>
          ):
          <div>
            <img
              className={styles.latexImage}
              src="https://quicklatex.com/cache3/26/ql_2b2abd9bd8d35c251a62f05e825eed26_l3.png"
              alt="Equation for differential return"
            />
          </div>
          The ex ante Sharpe Ratio is then defined as the expected value of d
          divided by sigma<sub>d</sub>, the predicted standard deviation of d:
          <div>
            <img
              className={styles.latexImage}
              src="https://quicklatex.com/cache3/28/ql_99a98af633d649a3f50e2ec80c9dea28_l3.png"
              alt="Equation for ex ante Sharpe ratio"
            />
          </div>
          This web app uses Monte Carlo simulation to generate 500,000 randomly
          generated allocations to a given set of assets in a portfolio. The
          maximum ex ante Sharpe ratio is calculated and plotted on a graph of
          the annualized average historical returns of the portfolio vs. the
          monthly historical standard deviation of the close price (please see
          the <a href="#">source code</a> for more details). The single asset
          data is plotted as well. The efficient fronteir is calculated by
          splitting the risk into 15 equally spaced bins and finding the maximum
          return within each bin. 1,000 of the 500,000 randomly generated
          weighted portfolios are then chosen at random to be plotted to outline
          the hyperbolic shape known as the Markowitz bullet. The tangency
          portfolio draws a straight line from the risk-free rate (or banchmark)
          return to the ex ante Sharpe ratio, representing the line of best
          capital allocation when the risk-free investment is incorporated into
          the portfolio, which in general extends past the ex ante Sharpe ratio,
          but this part is hidden for the sake of being able to better see the
          efficient frontier.
        </p>
        <h2>Tutorial</h2>
        <img src="../images/tutorial-home.png" alt="tmp" />
        <p>
          You can begin by clicking any of the links labeled "start" from the
          home page (above)
        </p>
        <img src="../images/tutorial-input-form.png" alt="tmp" />
        <p>
          This will take you to the input form (above). Fill out the information
          (detailed above). First you fill out asset tickers, but be at least 2
          and they must be already in the data file (only a limited selection
          for educational purposes). Then put the maxcimum allocation to any
          asset in the portfolio. The default is 100%, but often it is
          recommended with a large enough portfolio to never allocate more than
          30% to an individual asset. The number has to be larger than
          100/(#assets - 1) and less than or eaul to 100% Then you can enter the
          benchmark. By default is the the 3 onth T-bill at the time of
          development which is 3.72% but you can enter any value between -50%
          and 50% to benchmark against a specific rate, asset, or portfolio.
        </p>
        <img src="../images/tutorial-optimizer.png" alt="tmp" />
        <p>
          Then if there are no errors in the input fields listed on the form,
          you can press submit and should see the information like the above
          picture. The scatter plot mentions the values discussed in the
          previous section, and the maximum sharpe ratio information is detailed
          below with a pic chart visually representing the allocations to each
          asset in the portfolio.
        </p>
        <p>
          And there you go, it's that easy! Have fun and I hope you learn
          something.
        </p>
        <h2 id="references">References</h2>
        <ol>
          <li>
            Markowitz, H.M. (March 1952). "Portfolio Selection".{" "}
            <i>The Journal of Finance. </i>
            <b>7 </b>(1): 77–91.{" "}
            <a href="https://www.jstor.org/stable/2975974?origin=crossref">
              doi:10.2307/2975974
            </a>
          </li>
          <li>
            Sharpe, W. F. (1966). "Mutual Fund Performance".{" "}
            <i>Journal of Business</i>. <b>39</b> (S1): 119–138.{" "}
            <a href="doi:10.1086/294846">doi:10.1086/294846</a>
          </li>
          <li>
            Press release. NobelPrize.org. Nobel Prize Outreach AB 2022. Fri. 18
            Nov 2022.{" "}
            <a href="https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/">
              https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/
            </a>
          </li>
          <li>
            Sharpe, William F. (1994). "The Sharpe Ratio".{" "}
            <i>The Journal of Portfolio Management. </i>
            <b>21 </b>(1): 49–58.{" "}
            <a href="https://jpm.pm-research.com/content/21/1/49">
              doi:10.3905/jpm.1994.409501
            </a>
            .
          </li>
          <li>
            Board of Governors of the Federal Reserve System (US), 3-Month
            Treasury Bill Secondary Market Rate, Discount Basis [TB3MS],
            retrieved from FRED, Federal Reserve Bank of St. Louis;{" "}
            <a href="https://fred.stlouisfed.org/series/TB3MS">
              https://fred.stlouisfed.org/series/TB3MS
            </a>
            , November 17, 2022.
          </li>
        </ol>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Tutorial" />;

export default TutorialPage;
