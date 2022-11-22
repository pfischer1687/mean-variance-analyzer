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
          help people new to financial engineering start their journey learning
          about the history of portfolio optimization. In 1952, economist Harry
          Markowitz published "Portfolio Selection" which introduced modern
          portfolio theory (MPT), or mean-variance analysis.
          <sup>
            <a href="#references">[1]</a>
          </sup>{" "}
          The goal of MPT is to maximize the expected return of a portfolio for
          a given level of risk - which is measured by the variance of its asset
          prices. The optimized part of the risk-return spectrum is referred to
          as the efficient frontier.
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
          In 1994, he published "The Sharpe Ratio" which defined the ex post, or
          historic Sharpe ratio S<sub>h</sub>.
          <sup>
            <a href="#references">[4]</a>
          </sup>{" "}
          To calculate this value, we must first define the differential return
          D<sub>t</sub> of an asset in period t as the difference between the
          historical return R<sub>Ft</sub> on fund F and the return R
          <sub>Bt</sub> on a benchmark portfolio or security (often the
          annualized 3 month Treasury bill rate):
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
          We then define D-bar as the average value of D<sub>t</sub> over the
          time period from t=1 to T:
        </p>
        <div>
          <StaticImage
            className={styles.latexImageA}
            src="../images/average-return.png"
            alt="Equation for average differential return"
          />
        </div>
        <p>
          We define the standard deviation during the period σ<sub>D</sub> as:
        </p>
        <div>
          <StaticImage
            className={styles.latexImageSt}
            src="../images/standard-deviation.png"
            alt="Equation for standard deviation"
          />
        </div>
        <p>
          We can then define the ex post Sharpe Ratio as the ratio of the
          historic average differential return to its standard deviation:
        </p>
        <div>
          <StaticImage
            className={styles.latexImageS}
            src="../images/sharpe-ratio.png"
            alt="Equation for ex post Sharpe ratio"
          />
        </div>
        <p>
          This site contains a preloaded set of data from {numAssets} popular
          assets including stocks, ETFs, cryptocurrencies, and more. This data
          contains the annualized monthly returns from the historic close prices
          for each asset over their max periods, the variances of these values,
          and the covariances of these values with respect to each others'
          values. When calculating the Sharpe ratio, it is common to use the
          assets' monthly close prices.
          <sup>
            <a href="#references">[6]</a>
          </sup>{" "}
          Since portfolio optimization is an extension of asset diversification,
          the developer chose to calculate the covariances only over periods
          where both assets had data, while still capturing each individual
          assets' returns and variances over their max time periods. Note that
          this may affect the accuracy of the results and we are not liable for
          the accuracy of this data nor its resulting information as per the{" "}
          <Link to="/terms">Terms of Service</Link>. Please refer to the{" "}
          <a href="https://github.com/pfischer1687/get-json-data-for-mva">
            source code
          </a>{" "}
          for how this data was gathered for more details.{" "}
        </p>
        <p>
          This site uses Monte Carlo simulation to approximate the efficient
          frontier from 500,000 random allocations (please see the site's{" "}
          <a href="https://github.com/pfischer1687/mean-variance-analyzer">
            source code
          </a>{" "}
          for more details). The ex post Sharpe ratio is calculated via the
          following formula, where mu is the vector of mean returns, Q is the
          covariance matrix, and x is the vector of weights (or allocations)
          such that they are all positive and add to 1 (or 100%):
          <sup>
            <a href="#references">[7]</a>
          </sup>
        </p>
        <div>
          <StaticImage
            className={styles.latexImageSCalc}
            src="../images/maximize-sharpe.png"
            alt="Equation for ex post Sharpe ratio in terms of weights"
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
          however, this is beyond the scope of this tutorial and the reader is
          encouraged to learn more about this after experimenting with the site.
          <sup>
            <a href="#references">[7]</a>
          </sup>{" "}
          1,000 of the 500,000 randomly generated portfolios are chosen at
          random and plotted to outline a hyperbolic shape known as the
          Markowitz bullet which shows the general distribution of differential
          returns and their risks as a function of the different allocations.
          The tangency portfolio represents the line of best capital allocation
          when the risk-free (or benchmark) investment is incorporated into the
          portfolio and can be visualized by drawing a straight line from the
          risk-free rate to the Sharpe ratio. In general, the tangency portfolio
          extends past the Sharpe ratio, but this part is hidden on the site to
          better see the efficient frontier.
        </p>
        <p>
          Note, on this site we only cover one of the earliest and most basic
          formulas for portfolio optimization. The field has grown a lot since
          then and the site is meant only for educational purposes to get the
          reader started on their journey towards eventually learning about how
          portfolio optimization is done in practice today (in other words, this
          site's information cannot be considered financial advice or
          recommendations for any investments as per the{" "}
          <Link to="/terms">Terms of Service</Link>). Standard calculations of
          the annualized ex post Sharpe ratio have a wide range of criticisms,
          such as how historical returns cannot guarantee an asset's future
          performance, how it assumes a normal distribution of returns which in
          practice may underestimate tail risk, how it does not take into
          account serial correlation of the portfolio's assets which has been
          shown in some cases to overestimate the calculation by over 65%
          <sup>
            <a href="#references">[8]</a>
          </sup>
          , and many more. The reader is encouraged to look into other similar
          quantities and models such as the Sortino ratio (which penalizes
          downside volatility more than upside), the Treynor ratio (which
          measures the risk by its beta, or how its volatility correlates with
          the market's), the Black-Litterman model (which takes into account an
          investor's beliefs about the future of an asset's returns), among many
          more.
          <sup>
            <a href="#references">[9]</a>
          </sup>
        </p>
        <h2>Tutorial</h2>
        <p>
          To get started, click either the "Get started!" link on the home page
          (below) or the "Start" link in the navigation menu.
        </p>
        <StaticImage
          src="../images/tutorial-home.png"
          alt="MVA home screen"
          className={styles.tutorialImg}
        />
        <p>
          This should take you to the start page input form (below). Enter all
          the assets of interest into the corrsponding input fields. You can
          start typing a ticker or company name and if it is in the preloaded
          dataset it should appear in the dropdown datalist and be clickable.
          You must enter at least two unique tickers from the dataset and you
          can press the "+ Add Asset" button to add up to 20 assets. It is
          recommended to choose assets of the same class (i.e. stocks or
          cryptocurrencies) since it is hard to compare assets of different
          classes (you are encouraged, however, to see for yourself why this may
          be the case). Once you have chosen all your assets, you have the
          option to set the maximum allocation that can be given to any
          individual asset in the portfolio (the default is 100%). This number
          must be larger than 100% / (#assets - 1) and less than or equal to
          100%. Then you have the option to enter a custom benchmark. The
          default value is the the 3 month Treasury bill rate at the time of
          this site's development (November 2022: 3.72%
          <sup>
            <a href="#references">[5]</a>
          </sup>
          ) but you can enter any value between -50% and 50% to use a custom
          rate, asset, or portfolio as your benchmark.
        </p>
        <StaticImage
          src="../images/tutorial-input-form.png"
          alt="Start page input form"
        />
        <p>
          If there are no errors in the input fields, a scatter plot should
          appear (below) giving a visual representation of the approximated
          maximum Sharpe ratio, single asset returns, efficient frontier,
          Markowitz bullet and tangency portfolio (as explained in the previous
          section). Below that will be a pie chart visualizing the allocations
          that produced the maximum sharpe ratio and its corresponding
          information.
        </p>
        <StaticImage
          src="../images/tutorial-optimizer.png"
          alt="Sample Markowitz bullet scatter plot with optimal Sharpe ratio pie chart"
        />
        <p>
          Now you're ready to have some fun experimenting! Thank you for
          visiting this site and reading the tutorial. I hope you enjoy it and
          learn something new!
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
