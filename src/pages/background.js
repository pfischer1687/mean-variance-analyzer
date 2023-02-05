import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";
import { Link } from "gatsby";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import {
  NUM_TRIALS,
  NUM_PLOT_POINTS,
  MAX_NUM_EFF_FRONT_RISK_BINS,
} from "../utils";

const BackgroundPage = () => {
  return (
    <Layout pageTitle="Background">
      <div className={styles.textContainer}>
        <h2>Background</h2>
        <p>
          In 1952, economist Harry Markowitz published "Portfolio Selection"
          which first introduced modern portfolio theory (MPT), or mean-variance
          analysis.
          <sup>
            <Link to="#references">[1]</Link>
          </sup>{" "}
          The goal of MPT is to maximize the expected return of a portfolio for
          a given level of risk, as measured by the variance of its asset
          prices. The optimized part of the risk-return spectrum (i.e. the
          portfolios whose allocations provide the highest return for a given
          level of risk) is referred to as the efficient frontier.
        </p>
        <p>
          In 1966, economist William Sharpe published "Mutual Fund Performance"
          which defined the reward-to-variability ratio (now known as the Sharpe
          ratio).
          <sup>
            <Link to="#references">[2]</Link>
          </sup>{" "}
          This research grew from his part in the development of the capital
          asset pricing model (CAPM) for which he shared the 1990 Alfred Nobel
          Memorial Prize in Economic Sciences with Markowitz and Merton Miller.
          <sup>
            <Link to="#references">[3]</Link>
          </sup>{" "}
          In 1994, he published "The Sharpe Ratio" which defined the ex post
          (historic) Sharpe ratio S<sub>h</sub>.
          <sup>
            <Link to="#references">[4]</Link>
          </sup>{" "}
          To calculate this value, we first define the differential return D
          <sub>t</sub> in period t as the difference between the historical
          return R<sub>Ft</sub> on fund F and the return R<sub>Bt</sub> on a
          benchmark (often the annualized 3 month Treasury bill rate, also
          called the risk-free rate):
          <sup>
            <Link to="#references">[5]</Link>
          </sup>
        </p>
        <BlockMath>{String.raw`D_t\equiv R_{Ft}-R_{Bt}.`}</BlockMath>
        <p>
          We then define <span className={styles.overline}>D</span> as the
          average value of D<sub>t</sub> over the time period from t=1 to T:
        </p>
        <BlockMath>{String.raw`\overline{D}\equiv\frac{1}{T}\sum_{t=1}^TD_t.`}</BlockMath>
        <p>
          We can define the standard deviation during the period σ<sub>D</sub>{" "}
          as:
        </p>
        <BlockMath>{String.raw`\sigma_D\equiv\sqrt{\frac{\sum_{t=1}^T(D_t-\overline{D})^2}{T-1}}.`}</BlockMath>
        <p>
          We can then define the ex post Sharpe Ratio as the ratio of the
          historic average differential return to its standard deviation:
        </p>
        <BlockMath>{String.raw`S_h\equiv\frac{\overline{D}}{\sigma_D}.`}</BlockMath>
        <p>
          This site contains a preloaded set of data from over 100 popular
          assets including stocks, ETFs, cryptocurrencies, and more. The data
          contains the annualized monthly returns of the historic close prices
          for each asset over their maximum periods, the variances of these
          values, and the covariances of these values with respect to each
          others' values. When calculating the Sharpe ratio, it is common to use
          the assets' monthly close prices.
          <sup>
            <Link to="#references">[6]</Link>
          </sup>{" "}
          Since portfolio optimization is an extension of asset diversification,
          the developer chose to calculate the covariances only over periods
          where both assets had data, while still capturing each individual
          assets' returns and variances over their maximum time periods. Note
          that this choice may affect the accuracy of the results, and as a
          purely educational app we are not liable for the accuracy of this data
          nor its resulting information as per the{" "}
          <Link to="/terms">Terms of Service</Link>. Please refer to the{" "}
          <a
            href="https://github.com/pfischer1687/get-json-data-for-mva"
            target="_blank"
            rel="noreferrer"
          >
            source code
          </a>{" "}
          for how this data was gathered for more details.{" "}
        </p>
        <p>
          This site uses Monte Carlo simulation to approximate the efficient
          frontier from {NUM_TRIALS.toLocaleString()} random allocations (please
          see the site's{" "}
          <a
            href="https://github.com/pfischer1687/mean-variance-analyzer"
            target="_blank"
            rel="noreferrer"
          >
            source code
          </a>{" "}
          for more details). The ex post Sharpe ratio is calculated via the
          following formula, where &mu; is the vector of mean returns, Q is the
          covariance matrix, and x is the vector of weights (or allocations)
          such that they are all positive and add to 1 (or 100%):
          <sup>
            <Link to="#references">[7]</Link>
          </sup>
        </p>
        <BlockMath>{String.raw`S_h=\frac{\mu^Tx-R_{Bt}}{\sqrt{x^TQx}}.`}</BlockMath>
        <p>
          In our case, the portfolio that produces the highest Sharpe ratio out
          of the {NUM_TRIALS.toLocaleString()} is plotted on a graph of historic
          average return vs. standard deviation. The efficient frontier is
          calculated by splitting the risk into at most{" "}
          {MAX_NUM_EFF_FRONT_RISK_BINS.toLocaleString()} equally spaced bins and
          choosing the largest return from within each bin. Note that the
          efficient frontier here is approxmiated via Monte Carlo simulation and
          a more accurate calculation can be done via quadratic programming;
          however, this is beyond the scope of this educational web app and the
          reader is encouraged to learn more about this after experimenting with
          the site.
          <sup>
            <Link to="#references">[7]</Link>
          </sup>{" "}
          {NUM_PLOT_POINTS.toLocaleString()} of the{" "}
          {NUM_TRIALS.toLocaleString()} randomly generated portfolios are chosen
          at random and plotted to outline the hyperbolic shape known as the
          Markowitz bullet which shows the general distribution of returns and
          risks as a function of the possible portfolio allocations.
        </p>
        <p>
          The capital market line (CML) is a straight line drawn from the
          benchmark rate to the portfolio on the efficient frontier with the
          highest Sharpe ratio, also known as the tangency portfolio. The CML
          represents the capital allocation line with the highest slope (equal
          to the highest Sharpe ratio). Points on the CML to the left of the
          tangency portfolio represent incorporating lending at the benchmark
          rate into the portfolio. Points to the right incorporate borrowing,
          <sup>
            <Link to="#references">[8]</Link>
          </sup>{" "}
          and higher returns may be made from incorporating short selling,
          <sup>
            <Link to="#references">[9]</Link>
          </sup>{" "}
          but these concepts are beyond the scope of this app and the reader is
          encouraged to learn more about them after experimenting with the site.
        </p>
        <p>
          On this site we only cover one of the earliest and most basic theories
          of portfolio optimization. The field has grown a lot since then and
          the site is meant for educational purposes to get the reader started
          on their journey towards learning how portfolio optimization is done
          in practice today (i.e. the site's information cannot be considered
          financial advice or recommendations for any investments as per the{" "}
          <Link to="/terms">Terms of Service</Link>). Standard calculations of
          the annualized ex post Sharpe ratio have a wide range of criticisms,
          such as how historical returns cannot guarantee an asset's future
          performance, how it assumes a normal distribution of returns which in
          practice may underestimate tail risk, how it does not take into
          account serial correlation of the portfolio's assets which has been
          shown in some cases to overestimate the calculation by over 65%,
          <sup>
            <Link to="#references">[10]</Link>
          </sup>{" "}
          and many more. The reader is encouraged to look into other similar
          quantities and models such as the Sortino ratio (which penalizes
          downside volatility more than upside), the Treynor ratio (which
          measures risk via the beta (&beta;), or how its volatility correlates
          with the market's), the Black-Litterman model (which takes into
          account an investor's beliefs about the future of an asset's returns),
          <sup>
            <Link to="#references">[11]</Link>
          </sup>{" "}
          among many more.
        </p>
        <h2 id="references">References</h2>
        <ol>
          <li>
            Markowitz, H.M. (March 1952). "Portfolio Selection".{" "}
            <i>The Journal of Finance. </i>
            <b>7 </b>(1): 77–91.{" "}
            <a
              href="https://www.jstor.org/stable/2975974?origin=crossref"
              target="_blank"
              rel="noreferrer"
            >
              doi:10.2307/2975974
            </a>
            .
          </li>
          <li>
            Sharpe, W. F. (1966). "Mutual Fund Performance".{" "}
            <i>Journal of Business</i>. <b>39</b> (S1): 119–138.{" "}
            <a href="doi:10.1086/294846" target="_blank" rel="noreferrer">
              doi:10.1086/294846
            </a>
            .
          </li>
          <li>
            Press release. NobelPrize.org. Nobel Prize Outreach AB 2022. Fri. 18
            Nov 2022.{" "}
            <span className={styles.refLink}>
              <a
                href="https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/"
                target="_blank"
                rel="noreferrer"
              >
                https://www.nobelprize.org/prizes/economic-sciences/1990/press-release/
              </a>
            </span>
            .
          </li>
          <li>
            Sharpe, William F. (1994). "The Sharpe Ratio".{" "}
            <i>The Journal of Portfolio Management. </i>
            <b>21 </b>(1): 49–58.{" "}
            <a
              href="https://jpm.pm-research.com/content/21/1/49"
              target="_blank"
              rel="noreferrer"
            >
              doi:10.3905/jpm.1994.409501
            </a>
            .
          </li>
          <li>
            Board of Governors of the Federal Reserve System (US), 3-Month
            Treasury Bill Secondary Market Rate, Discount Basis [TB3MS],
            retrieved from FRED, Federal Reserve Bank of St. Louis. November 17,
            2022.{" "}
            <span className={styles.refLink}>
              <a
                href="https://fred.stlouisfed.org/series/TB3MS"
                target="_blank"
                rel="noreferrer"
              >
                https://fred.stlouisfed.org/series/TB3MS
              </a>
            </span>
            .
          </li>
          <li>
            Fernando, Jason. "Sharpe Ratio Formula and Definition with
            Examples." Investopedia. June 06, 2022.{" "}
            <span className={styles.refLink}>
              <a
                href="https://www.investopedia.com/terms/s/sharperatio.asp"
                target="_blank"
                rel="noreferrer"
              >
                https://www.investopedia.com/terms/s/sharperatio.asp
              </a>
            </span>
            .
          </li>
          <li>
            "Maximizing the Sharpe ratio." IEOR 4500.{" "}
            <span className={styles.refLink}>
              <a
                href="https://people.stat.sc.edu/sshen/events/backtesting/reference/maximizing%20the%20sharpe%20ratio.pdf"
                target="_blank"
                rel="noreferrer"
              >
                https://people.stat.sc.edu/sshen/events/backtesting/reference/maximizing%20the%20sharpe%20ratio.pdf
              </a>
            </span>
            .
          </li>
          <li>
            "Lee, M. C., & Su, L. E. (2014). Capital market line based on
            efficient frontier of portfolio with borrowing and lending rate.
            Universal Journal of Accounting and Finance, 2(4), 69-76.{" "}
            <span className={styles.refLink}>
              <a
                href="https://www.researchgate.net/profile/Ming-Chang-Lee-2/publication/264547651_Capital_market_line_based_on_efficient_frontier_of_portfolio_with_borrowing_and_lending_rate/links/53e493160cf25d674e94daa8/Capital-Market-Line-Based-on-Efficient-Frontier-of-Portfolio-with-Borrowing-and-Lending-Rate.pdf"
                target="_blank"
                rel="noreferrer"
              >
                doi:10.13189/ujaf.2014.020401
              </a>
            </span>
            .
          </li>
          <li>
            Jacobs, B. I., Levy, K. N., & Markowitz, H. M. (2005). Portfolio
            optimization with factors, scenarios, and realistic short positions.
            Operations Research, 53(4), 586-599.{" "}
            <a
              href="https://doi.org/10.1287/opre.1050.0212"
              target="_blank"
              rel="noreferrer"
            >
              doi:10.1287/opre.1050.0212
            </a>
            .
          </li>
          <li>
            Lo, Andrew W. "The statistics of Sharpe ratios." Financial analysts
            journal 58, no. 4 (2002): 36-52.{" "}
            <a
              href="https://www.tandfonline.com/doi/abs/10.2469/faj.v58.n4.2453"
              target="_blank"
              rel="noreferrer"
            >
              doi:10.2469/faj.v58.n4.2453
            </a>
            .
          </li>
          <li>
            Idzorek, Thomas M. "A step-by-step guide to the Black-Litterman
            model." July 20, 2004.{" "}
            <span className={styles.refLink}>
              <a
                href="https://people.duke.edu/~charvey/Teaching/BA453_2006/Idzorek_onBL.pdf"
                target="_blank"
                rel="noreferrer"
              >
                https://people.duke.edu/~charvey/Teaching/BA453_2006/Idzorek_onBL.pdf
              </a>
            </span>
            .
          </li>
        </ol>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Background" />;

export default BackgroundPage;
