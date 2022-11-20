import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

const numAssets = 10;

const TutorialPage = () => {
  return (
    <Layout pageTitle="Tutorial">
      <div className={styles.textContainer}>
        <h2>Introduction</h2>
        <p>
          Welcome to Mean-Variance Analyzer! MVA is an educational tool meant to
          help students interested in finance start their journey learning about
          the history of portfolio optimization. In 1952, economist Harry
          Markowitz published "Portfolio Selection" which introduced modern
          portfolio theory (MPT), or mean-variance analysis.
          <sup>
            <a href="#references">[1]</a>
          </sup>{" "}
          The goal of MPT is to maximize the expected return of a portfolio for
          a given level of risk - measured by the variance of its asset prices.
          The optimized part of the risk-return spectrum is referred to as the
          efficient frontier.
        </p>
        <p>
          In 1966, economist William Sharpe published "Mutual Fund Performance"
          which defined the reward-to-variability ratio (now known as the Sharpe
          ratio).
          <sup>
            <a href="#references">[2]</a>
          </sup>{" "}
          This research grew from his part in the development of the capital
          asset pricing model (CAPM) for which he shared the 1990 Alfred Nobel
          Memorial Prize in Economic Sciences with Markowitz and Merton Miller.
          <sup>
            <a href="#references">[3]</a>
          </sup>{" "}
          In 1994, he published "The Sharpe Ratio" which defined the ex ante
          Sharpe ratio.
          <sup>
            <a href="#references">[4]</a>
          </sup>{" "}
          To calculate this value, we first define the differential return d as
          a function of the historical return R<sub>F</sub> on fund F and the
          historical return R<sub>B</sub> on a benchmark portfolio or security
          (often the annualized 3 month Treasury bill rate, which at the time of
          this site's development was 3.72%):
          <sup>
            <a href="#references">[5]</a>
          </sup>
        </p>
        <div>
          <StaticImage
            className={styles.latexImageD}
            src="../images/differential-return.png"
            alt="Equation for differential return"
          />
        </div>
        <p>
          The ex ante Sharpe Ratio can then be defined as the expected value of
          d divided by sigma<sub>d</sub>, the predicted standard deviation of d:
        </p>
        <div>
          <StaticImage
            className={styles.latexImageS}
            src="../images/sharpe-ratio.png"
            alt="Equation for ex ante Sharpe ratio"
          />
        </div>
        <p>
          This site contains a preloaded set of data based on {numAssets}{" "}
          popular assets including stocks, ETFs, cryptocurrencies, and more.
          This data contains the annualized returns (in %) from the average
          monthly close price for each asset over its max period, the variance
          of these values, and their covariance with respect to each other
          asset's values. When calculating the Sharpe ratio, it is common to use
          the monthly close prices.
          <sup>
            <a href="#references">[6]</a>
          </sup>{" "}
          Since portfolio optimization is an extension of asset diversification,
          the developer chose to calculate the covariances only over periods
          where both assets had data, while separately still capturing each
          asset's returns and variance over a larger period of time for better
          accuracy (in his amateur opinion). Note that this may negatively
          affect the accuracy of the results and we are not liable for the
          accuracy of this data nor its resulting information as per the{" "}
          <Link to="/terms">Terms of Service</Link>. Please refer to the{" "}
          <a href="https://github.com/pfischer1687/get-json-data-for-mva">
            source code
          </a>{" "}
          for how the data was gathered for more details.{" "}
        </p>
        <p>
          This site uses Monte Carlo simulation to approximate the efficient
          frontier from 500,000 random allocations to a given set of assets
          (please see the site's{" "}
          <a href="https://github.com/pfischer1687/mean-variance-analyzer">
            source code
          </a>{" "}
          for more details). The ex ante Sharpe ratio is calculated via the
          following formula, where mu is the vector of mean returns, Q is the
          covariance matrix, and x are the weights (allocations) such that they
          are all positive and add to 1 (or 100%):
          <sup>
            <a href="#references">[7]</a>
          </sup>
        </p>
        <div>
          <StaticImage
            className={styles.latexImageSCalc}
            src="../images/maximize-sharpe.png"
            alt="Equation for ex ante Sharpe ratio in terms of weights"
          />
        </div>
        <p>
          In our case, the portfolio that produces the largest Sharpe ratio out
          of the 500,000 is plotted on a graph of each portfolio's mean return
          vs. its risk, or standard deviation. The efficient frontier is
          calculated by splitting the risk into 15 equally spaced bins and
          choosing the largest return from within each bin. Note that the
          efficient frontier here is approxmiated via Monte Carlo simulation and
          a more accurate calculation can be done via quadratic programming -
          which is beyond the scope of this tutorial but the reader is
          encouraged to learn more about this after experimenting with the site.
          <sup>
            <a href="#references">[7]</a>
          </sup>{" "}
          1,000 of the 500,000 randomly generated portfolios are chosen at
          random and plotted to outline a hyperbolic shape known as the
          Markowitz bullet, which shows the general distribution of returns as a
          function of different allocations. The tangency portfolio represents
          the line of best capital allocation when the risk-free investment is
          incorporated into the portfolio and can be visualized by drawing a
          straight line from the risk-free rate (or benchmark) to the Sharpe
          ratio. In general, the tangency portfolio extends past the Sharpe
          ratio, but this part is hidden on the site to better see the efficient
          frontier.
        </p>
        <p>
          Note, on this site we only cover one of the earliest and most basic
          formulas for portfolio optimization. The field has grown a lot since
          then and the site is meant only for educational purposes to get the
          reader started on their journey towards eventually learning about how
          portfolio optimization is done in practice today (i.e. this site's
          information can not be considered as financial advice or
          recommendations for any investments as per the{" "}
          <Link to="/terms">Terms of Service</Link>). Standard calculations of
          the annualized ex ante Sharpe ratio have a wide range of criticisms,
          such as how historical returns cannot guarantee an asset's future
          performance, how it assumes a normal distribution of returns which in
          practice may underestimate tail risk, how it does not take into
          account serial correlation of the portfolio's assets which has been
          shown in some cases to overestimate the calculation by over 65%
          <sup>
            <a href="#references">[8]</a>
          </sup>
          , and many more. The reader is encouraged to look into other portfolio
          optimization strategies such as the Sortino ratio (which penalizes
          downside volatility more than upside), the Treynor ratio (which
          measures the risk by its beta, or how its volatility correlates with
          the market's), the Black-Litterman model (which takes into account an
          investor's beliefs about the future of an asset's returns), and many
          more.
          <sup>
            <a href="#references">[9]</a>
          </sup>
        </p>
        <h2>Tutorial</h2>
        <StaticImage src="../images/tutorial-home.png" alt="tmp" />
        <p>
          You can begin by clicking any of the links labeled "start" from the
          home page (above)
        </p>
        <StaticImage src="../images/tutorial-input-form.png" alt="tmp" />
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
        <StaticImage src="../images/tutorial-optimizer.png" alt="tmp" />
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
            .
          </li>
          <li>
            Sharpe, W. F. (1966). "Mutual Fund Performance".{" "}
            <i>Journal of Business</i>. <b>39</b> (S1): 119–138.{" "}
            <a href="doi:10.1086/294846">doi:10.1086/294846</a>.
          </li>
          <li>
            Press release. NobelPrize.org. Nobel Prize Outreach AB 2022. Fri. 18
            Nov 2022.{" "}
            <a href="https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/">
              https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/
            </a>
            .
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
          <li>
            Fernando, Jason. "Sharpe Ratio Formula and Definition with
            Examples." Investopedia. June 06, 2022.{" "}
            <a href="https://www.investopedia.com/terms/s/sharperatio.asp">
              https://www.investopedia.com/terms/s/sharperatio.asp
            </a>
          </li>
          <li>
            "Maximizing the Sharpe ratio." IEOR 4500.{" "}
            <a href="https://people.stat.sc.edu/sshen/events/backtesting/reference/maximizing%20the%20sharpe%20ratio.pdf">
              https://people.stat.sc.edu/sshen/events/backtesting/reference/maximizing%20the%20sharpe%20ratio.pdf
            </a>
            .
          </li>
          <li>
            Lo, Andrew W. "The statistics of Sharpe ratios." Financial analysts
            journal 58, no. 4 (2002): 36-52.{" "}
            <a href="https://www.tandfonline.com/doi/abs/10.2469/faj.v58.n4.2453">
              doi:10.2469/faj.v58.n4.2453
            </a>
            .
          </li>
          <li>
            Idzorek, Thomas M. "A step-by-step guide to the Black-Litterman
            model." July 20, 2004.{" "}
            <a href="https://people.duke.edu/~charvey/Teaching/BA453_2006/Idzorek_onBL.pdf">
              https://people.duke.edu/~charvey/Teaching/BA453_2006/Idzorek_onBL.pdf
            </a>
          </li>
        </ol>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Tutorial" />;

export default TutorialPage;
