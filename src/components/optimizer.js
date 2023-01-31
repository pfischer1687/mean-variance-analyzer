import * as React from "react";
import * as AssetData from "../../data/asset-data.json";
import { Chart as ChartJS, registerables } from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import {
  arrDotProd,
  arrMatProduct,
  genNormRandWeights,
} from "../utils/utils.js";
import * as styles from "./optimizer.module.css";

/**
 * Returns Optimizer React component which runs Monte Carlo simulation of portfolios with random allocations, plots them on an interactive scatter plot, and displays the mean-variance optimal portfolio on an interactive pie chart
 * @param {string[]} tickers
 * @param {number} constraintPct
 * @param {number} riskFreeRatePct
 * @param {JSX} children
 * @return {JSX}
 */
const Optimizer = ({ tickers, constraintPct, riskFreeRatePct, children }) => {
  const numTrials = 500000;
  const numPlotPoints = 1000;
  const maxNumEfficientFrontierRiskBins = 15;
  const constraint = constraintPct / 100;

  let meanRetArr = [];
  for (let i = 0; i < tickers.length; i++) {
    meanRetArr[i] = AssetData[tickers[i]].annRetPct;
  }

  // Begin covariance matrix
  let covMatrix = [];
  for (let i = 0; i < tickers.length; i++) {
    covMatrix[i] = [];
  }

  for (let i = 0; i < tickers.length; i++) {
    covMatrix[i][i] = AssetData[tickers[i]].annVar; // Diagonal elements contain variances
  }

  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      covMatrix[i][j] = AssetData[tickers[i]].cov[tickers[j]];
      covMatrix[j][i] = covMatrix[i][j]; // Off-diagonal elements contain covariances and are symmetric
    }
  }
  // End covariance matrix

  let weightsMat = []; // dim: numTrials x tickers.length
  let retArr = [];
  let riskArr = [];
  let sharpeRatio = 0;
  let maxSharpeRatio = []; // [val, index]
  let minRisk = []; // [val, index]
  let maxRisk = 0;
  for (let i = 0; i < numTrials; i++) {
    weightsMat[i] = genNormRandWeights(tickers.length, constraint);
    retArr[i] = arrDotProd(meanRetArr, weightsMat[i]);
    riskArr[i] = Math.sqrt(arrMatProduct(weightsMat[i], covMatrix));
    sharpeRatio = (retArr[i] - riskFreeRatePct) / riskArr[i];
    if (i === 0) {
      minRisk[0] = riskArr[0];
      minRisk[1] = 0;
      maxRisk = riskArr[0];
      maxSharpeRatio[0] = sharpeRatio;
      maxSharpeRatio[1] = 0;
      continue;
    }
    if (sharpeRatio > maxSharpeRatio[0]) {
      maxSharpeRatio[0] = sharpeRatio;
      maxSharpeRatio[1] = i;
    }
    if (riskArr[i] < minRisk[0]) {
      minRisk[0] = riskArr[i];
      minRisk[1] = i;
    }
    if (riskArr[i] > maxRisk) {
      maxRisk = riskArr[i];
    }
  }

  // Determine efficient frontier by breaking Monte Carlo simulations into "bins" of risk and finding the max
  // return in each risk bin
  const binDividerLength =
    (maxRisk - minRisk[0]) / maxNumEfficientFrontierRiskBins;
  let binDividerRisks = [];
  binDividerRisks[0] = minRisk[0] + binDividerLength;
  for (let i = 1; i < maxNumEfficientFrontierRiskBins - 1; i++) {
    binDividerRisks[i] = binDividerRisks[i - 1] + binDividerLength;
  }

  let maxReturnPerBinIndexArr = [];
  maxReturnPerBinIndexArr[0] = minRisk[1]; // Start efficient frontier at minimum risk
  let riskBinIndex = 0;
  for (let i = 0; i < numTrials; i++) {
    // Determine which risk bin each portfolio is in
    riskBinIndex = 1;
    for (let j = 0; j < binDividerRisks.length; j++) {
      if (riskArr[i] > binDividerRisks[j]) {
        riskBinIndex = j + 2;
      } else {
        break;
      }
    }
    // Check if each portfolio is the largest in its risk bin
    if (maxReturnPerBinIndexArr[riskBinIndex] === undefined) {
      maxReturnPerBinIndexArr[riskBinIndex] = i;
      continue;
    }
    if (retArr[i] > retArr[maxReturnPerBinIndexArr[riskBinIndex]]) {
      maxReturnPerBinIndexArr[riskBinIndex] = i;
    }
  }

  if (maxReturnPerBinIndexArr[0] === maxReturnPerBinIndexArr[1]) {
    maxReturnPerBinIndexArr.shift();
  }
  maxReturnPerBinIndexArr = maxReturnPerBinIndexArr.filter(
    (idx) => idx !== undefined
  );

  // Remove points from efficient frontier where bottom section takes on more risk than the max return asset
  const numValidBinIndices = maxReturnPerBinIndexArr.length - 1;
  for (let i = numValidBinIndices; i > 0; i--) {
    if (
      retArr[maxReturnPerBinIndexArr[i]] < retArr[maxReturnPerBinIndexArr[0]]
    ) {
      maxReturnPerBinIndexArr.pop();
    } else {
      break;
    }
  }

  // Monte Carlo plot
  ChartJS.register(...registerables);
  const monteCarloPlotOptions = {
    maintainAspectRatio: false,
    events: ["click", "mousemove"],
    responsive: true,
    plugins: {
      // Tooltip plot labels
      tooltip: {
        filter: function (context) {
          let label = context.dataset.label;
          if (label === "Markowitz Bullet") {
            return false; // Hide tooltip on Markowitz bullet points
          } else {
            return true;
          }
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label;
            if (label === "Max Sharpe Ratio") {
              return [
                `Sharpe Ratio: ${Number(maxSharpeRatio[0]).toFixed(2)}`,
                `Annualized Return: ${Number(context.raw.y).toFixed(2)}%`,
                `Standard Deviation: ${Number(context.raw.x).toFixed(2)}%`,
                "Portfolio weights:",
                ...weightsMat[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${Number(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Efficient Frontier") {
              return [
                `Sharpe Ratio: ${Number(
                  (retArr[context.raw.idx] - riskFreeRatePct) /
                    riskArr[context.raw.idx]
                ).toFixed(2)}`,
                `Annualized Return: ${Number(context.raw.y).toFixed(2)}%`,
                `Standard Deviation: ${Number(context.raw.x).toFixed(2)}%`,
                "Portfolio weights:",
                ...weightsMat[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${Number(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Single Assets") {
              return [
                context.raw.ticker,
                `Annualized Return: ${Number(context.raw.y).toFixed(2)}%`,
                `Standard Deviation: ${Number(context.raw.x).toFixed(2)}%`,
              ];
            } else if (label === "Tangency Portfolio" && context.raw.x === 0) {
              return [`Benchmark: ${Number(context.raw.y).toFixed(2)}%`];
            }
            return;
          },
        },
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Annualized Standard Deviation (%)",
        },
        beginAtZero: true,
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Annualized Differential Return (%)",
        },
        beginAtZero: true,
      },
    },
  };

  const monteCarloPlotData = {
    datasets: [
      {
        type: "scatter",
        label: "Max Sharpe Ratio",
        data: [
          {
            x: riskArr[maxSharpeRatio[1]],
            y: retArr[maxSharpeRatio[1]],
            idx: maxSharpeRatio[1],
          },
        ],
        hitRadius: 7,
        backgroundColor: "rgba(255, 255, 0, 1)",
      },
      {
        type: "scatter",
        label: "Single Assets",
        data: tickers.map((ticker) => ({
          x: Math.sqrt(AssetData[ticker].annVar),
          y: AssetData[ticker].annRetPct,
          ticker: ticker,
        })),
        hitRadius: 7,
        backgroundColor: "rgba(255, 100, 100, 1)",
      },
      {
        type: "line",
        label: "Efficient Frontier",
        borderColor: "rgba(0, 0, 255, 1)",
        data: maxReturnPerBinIndexArr.map((idx) => ({
          x: riskArr[idx],
          y: retArr[idx],
          idx: idx,
        })),
        hitRadius: 7,
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
      {
        type: "scatter",
        label: "Markowitz Bullet",
        data: [...Array(numPlotPoints)].map((_) => {
          let idx = Math.floor(numTrials * Math.random());
          return { x: riskArr[idx], y: retArr[idx] };
        }),
        backgroundColor: "rgba(0, 255, 255, 1)",
      },
      {
        type: "line",
        label: "Tangency Portfolio",
        data: [
          {
            x: 0,
            y: riskFreeRatePct,
          },
          {
            x: riskArr[maxSharpeRatio[1]],
            y: retArr[maxSharpeRatio[1]],
          },
        ],
        borderColor: "rgba(0, 0, 0, 1)",
      },
    ],
  };

  // Pie chart
  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${Number(context.raw).toFixed(2)}%`;
          },
        },
      },
    },
  };
  const pieChartColors = tickers.map(
    (ticker) =>
      `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(
        255 * Math.random()
      )}, ${Math.floor(255 * Math.random())}`
  );
  const pieChartSortedArr = weightsMat[maxSharpeRatio[1]]
    .map((weight, index) => [tickers[index], weight * 100])
    .sort((arr1, arr2) => arr2[1] - arr1[1]);
  const pieData = {
    labels: pieChartSortedArr.map((arr) => arr[0]),
    datasets: [
      {
        label: "Portfolio Weight Allocations for Max Sharpe Ratio",
        data: pieChartSortedArr.map((arr) => arr[1]),
        backgroundColor: pieChartColors.map((color) => color + ", 0.2)"),
        borderColor: pieChartColors.map((color) => color + ", 1)"),
        borderWidth: 1,
      },
    ],
  };
  const maxSharpeRatioInfo = [
    `Sharpe Ratio: ${Number(maxSharpeRatio[0]).toFixed(2)}`,
    `Annualized Return: ${Number(retArr[maxSharpeRatio[1]]).toFixed(2)}%`,
    `Standard Deviation: ${Number(riskArr[maxSharpeRatio[1]]).toFixed(2)}%`,
    "Portfolio weights:",
    ...pieChartSortedArr.map(
      (arr) => `${arr[0]}: ${Number(arr[1]).toFixed(2)}%`
    ),
  ];

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
            <Pie data={pieData} options={pieChartOptions} />
          </div>
        </div>
        <div className={styles.pieChartInfo}>
          <h2>Max Sharpe Ratio Portfolio:</h2>
          {maxSharpeRatioInfo.map((Element, index) => (
            <p key={index}>{Element}</p>
          ))}
        </div>
      </div>
      {children}
    </>
  );
};

export default Optimizer;
