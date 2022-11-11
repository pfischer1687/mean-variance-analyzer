import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Chart, Pie } from "react-chartjs-2";
import { minNumAssets, maxNumAssets } from "./input-form.js";

const numTrials = 500000;
const numPlotPoints = 1000;

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number}
 */
const arrDotProd = (arr1, arr2) => {
  // Return the dot product of two 1-dimensional arrays
  if (arr1.length === 0 || arr1.length !== arr2.length) {
    throw new Error(
      "Expected two 1-dimensional arrays of numbers of equal length > 0"
    );
  }

  let prodSum = 0;
  for (let i = 0; i < arr1.length; i++) {
    prodSum += arr1[i] * arr2[i];
  }

  return prodSum;
};

/**
 * @param {number[]} arr
 * @param {number[][]} mat
 * @return {number}
 */
const arrMatProduct = (arr, mat) => {
  // Return the product arr^T.mat.arr
  if (
    arr.length === 0 ||
    arr.length !== mat.length ||
    arr.length !== mat[0].length
  ) {
    throw new Error(
      "Expected one 1-dimensional array and one 2-dimensional array of dimension arr.length x arr.length"
    );
  }

  let firstProduct = [];
  for (let i = 0; i < arr.length; i++) {
    firstProduct[i] = arrDotProd(mat[i], arr);
  }

  return arrDotProd(arr, firstProduct);
};

/**
 * @param {number} arrLength
 * @param {number} constraint
 * @return {number[]}
 */
const genNormRandWeightArr = (arrLength, constraint) => {
  // Returns a normalized (sum = 1) array of positive weights, each less than a constraint
  if (arrLength < minNumAssets || arrLength > maxNumAssets) {
    throw new Error("Expected 2 <= arrLength <= 20");
  } else if (constraint < 1 / arrLength || constraint > 1) {
    throw new Error("Expected constraint in [1/arrLength, 1]");
  }

  // Generate array of random weights
  let res = [];
  let runSum = 0;
  for (let i = 0; i < arrLength; i++) {
    res[i] = Math.random() ** 4.669201609102991; // Exponent helps spread out Markowitz bullet
    runSum += res[i];
  }

  // Normalize array keeping track of any values above the constraint
  let excessVal = 0;
  for (let i = 0; i < arrLength; i++) {
    res[i] /= runSum;
    if (res[i] > constraint) {
      excessVal += res[i] - constraint;
      res[i] = constraint;
    }
  }

  // Redistribute excess if constraint is not met for each element
  if (excessVal > 0) {
    let diff = 0;
    for (let i = 0; i < arrLength; i++) {
      diff = constraint - res[i];
      if (diff >= excessVal) {
        res[i] += excessVal;
        break;
      }
      excessVal -= diff;
      res[i] = constraint;
    }
  }

  // Randomly shuffle final result to avoid first index bias
  res.sort(() => Math.random() - 0.5);
  return res;
};

/**
 * @param {string[]} tickers
 * @param {JSX} children
 * @return {JSX}
 */
const Optimizer = ({ tickers, constraintPct, riskFreeRatePct, children }) => {
  // Returns Optimizer React component which runs Monte Carlo simulation of portfolios with random allocations,
  // plots them, and displays the mean-variance optimal portfolio
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
    weightsMat[i] = genNormRandWeightArr(tickers.length, constraint);
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
  const noEfficientFrontierRiskBins = 15; // Keep small enough to be able to click on individual points
  const binDividerLength = (maxRisk - minRisk[0]) / noEfficientFrontierRiskBins;
  let binDividerRisks = [];
  binDividerRisks[0] = minRisk[0] + binDividerLength;
  for (let i = 1; i < noEfficientFrontierRiskBins - 1; i++) {
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

  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ArcElement
  );

  // Monte Carlo plot
  const monteCarloPlotOptions = {
    maintainAspectRatio: false,
    events: ["click", "mousemove"],
    responsive: true,
    plugins: {
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
        backgroundColor: "rgba(255, 255, 0, 1)",
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
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
      {
        type: "scatter",
        label: "Single Assets",
        data: tickers.map((ticker) => ({
          x: Math.sqrt(AssetData[ticker].annVar),
          y: AssetData[ticker].annRetPct,
          ticker: ticker,
        })),
        backgroundColor: "rgba(255, 100, 100, 1)",
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
    `Max Sharpe Ratio: ${Number(maxSharpeRatio[0]).toFixed(2)}`,
    `Annualized Return: ${Number(retArr[maxSharpeRatio[1]]).toFixed(2)}%`,
    `Standard Deviation: ${Number(riskArr[maxSharpeRatio[1]]).toFixed(2)}%`,
    "Portfolio weights:",
    ...pieChartSortedArr.map(
      (arr) => `${arr[0]}: ${Number(arr[1]).toFixed(2)}%`
    ),
  ];

  return (
    <>
      <div style={{ height: "300px" }}>
        <Chart
          type="scatter"
          options={monteCarloPlotOptions}
          data={monteCarloPlotData}
        />
      </div>
      <Pie data={pieData} />
      {maxSharpeRatioInfo.map((Element, index) => (
        <p key={index}>{Element}</p>
      ))}
    </>
  );
};

export default Optimizer;
