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
  let firstProduct = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    firstProduct[i] = arrDotProd(mat[i], arr);
  }
  const res = arrDotProd(arr, firstProduct);
  return res;
};

/**
 * @param {number[]} arr
 * @return {number[]}
 */
const genNormRandWeightArr = (arrLength, constraint) => {
  // Returns a normalized (sum = 1) array of positive weights, each less than a constraint
  if (arrLength < 2 || arrLength > 20) {
    throw new Error("Expected 2 <= arrLength <= 20");
  } else if (constraint < 1 / arrLength || constraint > 1) {
    throw new Error("Expected constraint in [1/arrLength, 1]");
  }
  let res = new Array(arrLength);
  let runSum = 0;
  for (let i = 0; i < arrLength; i++) {
    res[i] = Math.random() ** 5; // Exponent helps spread out Markowitz bullet
    runSum += res[i];
  }
  let excessVal = 0;
  for (let i = 0; i < arrLength; i++) {
    res[i] /= runSum;
    if (res[i] > constraint) {
      excessVal += res[i] - constraint;
      res[i] = constraint;
    }
  }
  if (excessVal > 0) {
    let diff;
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
  res.sort(() => Math.random() - 0.5);
  return res;
};

const Optimizer = ({ tickers, children }) => {
  let meanRetArr = new Array(tickers.length);
  for (let i = 0; i < tickers.length; i++) {
    meanRetArr[i] = AssetData[tickers[i]].avgMoRetPct;
  }

  let covMatrix = new Array(tickers.length);
  for (let i = 0; i < tickers.length; i++) {
    covMatrix[i] = new Array(tickers.length);
  }
  for (let i = 0; i < tickers.length; i++) {
    covMatrix[i][i] = AssetData[tickers[i]].var;
  }
  for (let i = 0; i < tickers.length; i++) {
    for (let j = i + 1; j < tickers.length; j++) {
      covMatrix[i][j] = AssetData[tickers[i]].cov[tickers[j]];
      covMatrix[j][i] = covMatrix[i][j];
    }
  }

  // put max weight, other form input variables here
  // he puts N = 10,000
  // weights might want to be like arr.length X N matrix
  // returns is array of length(N)
  // ^ same with risks

  // tmp: change
  const numTrials = 1000;
  const constraint = 1;
  let weightsMat = new Array(numTrials);
  let retArr = new Array(numTrials);
  let riskArr = new Array(numTrials);
  const riskFreeRate = 0;
  let sharpeRatio;
  let maxSharpeRatio = new Array(2); // [val, index]
  let minRisk = new Array(2); // [val, index]
  let maxRisk;
  for (let i = 0; i < numTrials; i++) {
    weightsMat[i] = genNormRandWeightArr(tickers.length, constraint);
    retArr[i] = arrDotProd(meanRetArr, weightsMat[i]);
    riskArr[i] = Math.sqrt(arrMatProduct(weightsMat[i], covMatrix));
    sharpeRatio = (retArr[i] - riskFreeRate) / riskArr[i];
    if (i === 0) {
      minRisk[0] = riskArr[i];
      minRisk[1] = i;
      maxRisk = riskArr[i];
      maxSharpeRatio[0] = sharpeRatio;
      maxSharpeRatio[1] = i;
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

  const noEfficientFrontierRiskBins = 15; //Math.floor(numTrials / 20) + 1;
  const binDividerLength = (maxRisk - minRisk[0]) / noEfficientFrontierRiskBins;
  let binDividerRisks = new Array(noEfficientFrontierRiskBins - 1);
  binDividerRisks[0] = minRisk[0] + binDividerLength;
  for (let i = 1; i < binDividerRisks.length; i++) {
    binDividerRisks[i] = binDividerRisks[i - 1] + binDividerLength;
  }
  let maxReturnPerBinIndexArr = new Array(noEfficientFrontierRiskBins + 1);
  maxReturnPerBinIndexArr[0] = minRisk[1]; // Start efficient frontier at minimum risk
  let riskBinIndex;
  for (let i = 0; i < numTrials; i++) {
    // first determine which bin it's in
    riskBinIndex = 1;
    for (let j = 0; j < binDividerRisks.length; j++) {
      if (riskArr[i] > binDividerRisks[j]) {
        riskBinIndex = j + 2;
      } else {
        break;
      }
    }
    // then check if it's the largest in that bin
    if (maxReturnPerBinIndexArr[riskBinIndex] === undefined) {
      maxReturnPerBinIndexArr[riskBinIndex] = i;
    } else if (retArr[i] > retArr[maxReturnPerBinIndexArr[riskBinIndex]]) {
      maxReturnPerBinIndexArr[riskBinIndex] = i;
    }
  }
  if (maxReturnPerBinIndexArr[0] === maxReturnPerBinIndexArr[1]) {
    maxReturnPerBinIndexArr.shift();
  }
  maxReturnPerBinIndexArr = maxReturnPerBinIndexArr.filter(
    (idx) => idx !== undefined
  );
  maxReturnPerBinIndexArr.pop();
  maxReturnPerBinIndexArr.pop(); // Remove last two less accurate points

  // let testVar = maxReturnPerBinIndexArr.indexOf(maxSharpeRatio[1]);
  // if (testVar !== -1) {
  //   maxReturnPerBinIndexArr.splice(testVar, 1); // Remove max Sharpe ratio
  // }

  // maybe change `arr` to `tickers`?

  ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    ArcElement
  );

  const options = {
    maintainAspectRatio: false,
    events: ["click", "mousemove"],
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Cubic interpolation mode",
      },
      tooltip: {
        filter: function (context) {
          let label = context.dataset.label;
          if (label === "Markowitz Bullet") {
            return false;
          } else {
            return true;
          }
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label;
            if (label === "Max Sharpe Ratio") {
              return [
                `Sharpe Ratio: ${maxSharpeRatio[0].toFixed(2)}`,
                `Monthly Return: ${context.raw.y.toFixed(2)}%`,
                `Standard Deviation: ${context.raw.x.toFixed(2)}%`,
                "Portfolio weights:",
                ...weightsMat[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Efficient Frontier") {
              return [
                `Sharpe Ratio: ${(
                  (retArr[context.raw.idx] - riskFreeRate) /
                  riskArr[context.raw.idx]
                ).toFixed(2)}`,
                `Monthly Return: ${context.raw.y.toFixed(2)}%`,
                `Standard Deviation: ${context.raw.x.toFixed(2)}%`,
                "Portfolio weights:",
                ...weightsMat[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Single Assets") {
              return [
                context.raw.ticker,
                `Monthly Return: ${context.raw.y.toFixed(2)}%`,
                `Standard Deviation: ${context.raw.x.toFixed(2)}%`,
              ];
            }
            return;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      // mode: "index",
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Standard Deviation",
        },
        beginAtZero: true,
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Average Monthly Differential Return (%)",
        },
        beginAtZero: true,
      },
    },
  };

  const data = {
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
        fill: false,
        borderColor: "rgba(0, 0, 255, 1)",
        data: maxReturnPerBinIndexArr.map((idx) => ({
          x: riskArr[idx],
          y: retArr[idx],
          idx: idx,
        })),
        backgroundColor: "rgba(0, 0, 255, 1)",
        // cubicInterpolationMode: "monotone",
        // tension: 0.1,
      },
      {
        type: "scatter",
        label: "Single Assets",
        data: tickers.map((ticker) => ({
          x: Math.sqrt(AssetData[ticker].var),
          y: AssetData[ticker].avgMoRetPct,
          ticker: ticker,
        })),
        backgroundColor: "rgba(255, 100, 100, 1)",
      },
      {
        type: "scatter",
        label: "Markowitz Bullet",
        data: riskArr.map((risk, index) => ({
          x: risk,
          y: retArr[index],
        })),
        backgroundColor: "rgba(0, 255, 255, 1)",
      },
      {
        type: "line",
        label: "Tangency Portfolio",
        data: [
          {
            x: 0,
            y: riskFreeRate,
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

  const pieChartColors = tickers.map(
    (ticker) =>
      `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(
        255 * Math.random()
      )}, ${Math.floor(255 * Math.random())}`
  );

  // Pie chart
  const pieData = {
    labels: tickers,
    datasets: [
      {
        label: "Portfolio Weight Allocations for Max Sharpe Ratio",
        data: weightsMat[maxSharpeRatio[1]].map((weight) => weight * 100),
        backgroundColor: pieChartColors.map((color) => color + ", 0.2)"),
        borderColor: pieChartColors.map((color) => color + ", 1)"),
        borderWidth: 1,
      },
    ],
  };

  //Sharpe ratio info
  const sharpeRatioInfo = [
    `Max Sharpe Ratio: ${maxSharpeRatio[0].toFixed(2)}`,
    `Monthly Return: ${retArr[maxSharpeRatio[1]].toFixed(2)}%`,
    `Standard Deviation: ${riskArr[maxSharpeRatio[1]].toFixed(2)}%`,
    "Portfolio weights:",
    ...weightsMat[maxSharpeRatio[1]].map(
      (weight, index) => `${tickers[index]}: ${(weight * 100).toFixed(2)}%`
    ),
  ];

  return (
    <>
      <div style={{ height: "300px" }}>
        <Chart type="scatter" options={options} data={data} />
      </div>
      <Pie data={pieData} />
      {sharpeRatioInfo.map((Element, index) => (
        <p key={index}>{Element}</p>
      ))}
    </>
  );
};

export default Optimizer;
