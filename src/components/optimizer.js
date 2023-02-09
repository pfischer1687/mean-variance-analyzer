import * as React from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import * as styles from "./optimizer.module.css";

/**
 * Returns Optimizer React component which runs Monte Carlo simulation of portfolios with random allocations, plots them on an interactive scatter plot, and displays the mean-variance optimal portfolio on an interactive pie chart
 * @param {Object} props
 * @param {Object} props.monteCarloPlotOptions
 * @param {Object} props.monteCarloPlotData
 * @param {Object} props.pieChartData
 * @param {Object} props.pieChartOptions
 * @param {JSX[]} props.maxSharpeRatioInfo
 * @param {JSX} props.children
 * @return {JSX}
 */
const Optimizer = ({
  monteCarloPlotOptions,
  monteCarloPlotData,
  pieChartData,
  pieChartOptions,
  maxSharpeRatioInfo,
  children,
}) => {
  ChartJS.register(...registerables);
  return (
    <>
      <div className={styles.scatterPlot}>
        <Chart
          type="scatter"
          options={monteCarloPlotOptions}
          data={monteCarloPlotData}
          color="#FFF"
        />
      </div>
      <div className={styles.pieChartStyle}>
        <div className={styles.pieChartMobileStyle}>
          <div className={styles.pieChartElement}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
        <div className={styles.pieChartInfo}>
          <h2>Max Sharpe Ratio Portfolio:</h2>
          {maxSharpeRatioInfo}
        </div>
      </div>
      {children}
    </>
  );
};

export default Optimizer;
