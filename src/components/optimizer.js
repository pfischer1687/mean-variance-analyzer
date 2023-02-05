import * as React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import { getOptimizerData } from "../utils";
import * as styles from "./optimizer.module.css";

/**
 * Returns Optimizer React component which runs Monte Carlo simulation of portfolios with random allocations, plots them on an interactive scatter plot, and displays the mean-variance optimal portfolio on an interactive pie chart
 * @param {Object} props
 * @param {string[]} props.tickers
 * @param {number} props.constraint
 * @param {number} props.benchmarkRatePct
 * @param {JSX} props.children
 * @return {JSX}
 */
const Optimizer = ({ tickers, constraint, benchmarkRatePct, children }) => {
  ChartJS.register(...registerables);
  const optimizerData = getOptimizerData(tickers, constraint, benchmarkRatePct);
  return (
    <>
      <div className={styles.scatterPlot}>
        <Chart
          type="scatter"
          options={optimizerData.monteCarloPlotOptions}
          data={optimizerData.monteCarloPlotData}
          color="#FFF"
        />
      </div>
      <div className={styles.pieChartStyle}>
        <div className={styles.pieChartMobileStyle}>
          <div className={styles.pieChartElement}>
            <Pie
              data={optimizerData.pieChartData}
              options={optimizerData.pieChartOptions}
            />
          </div>
        </div>
        <div className={styles.pieChartInfo}>
          <h2>Max Sharpe Ratio Portfolio:</h2>
          {optimizerData.maxSharpeRatioInfo}
        </div>
      </div>
      {children}
    </>
  );
};

export default Optimizer;
