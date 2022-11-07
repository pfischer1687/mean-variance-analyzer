import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// is it possible to graphql query the data^ instead of importing again? what would be faster?

/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number}
 */
const arrDotProd = (arr1, arr2) => {
  // Return the dot product of two 1-dimensional arrays
  if (arr1.length === 0 || arr1.length !== arr2.length) {
    throw new Error("Expected two 1-dimensional arrays");
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
  // Return a normalized (sum = 1) array of weights subject to constraint
  if (arrLength <= 0) {
    throw new Error("Expected one 1-dimensional array");
  }
  let res = new Array(arrLength);
  let runSum = 0;
  for (let i = 0; i < arrLength - 1; i++) {
    res[i] = Math.random() * constraint;
    runSum += res[i];
  }
  if (1 - runSum < 0 || 1 - runSum > constraint) {
    return genNormRandWeightArr(arrLength, constraint);
  }
  res[arrLength - 1] = 1 - runSum;
  return res;
};

const Optimizer = ({ arr, children }) => {
  let meanRetArr = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    meanRetArr[i] = AssetData[arr[i]].avgMoRetPct;
  }

  let covMatrix = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    covMatrix[i] = new Array(arr.length);
  }
  for (let i = 0; i < arr.length; i++) {
    covMatrix[i][i] = AssetData[arr[i]].var;
  }
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      covMatrix[i][j] = AssetData[arr[i]].cov[arr[j]];
      covMatrix[j][i] = covMatrix[i][j];
    }
  }

  // put max weight, other form input variables here
  // he puts N = 10,000
  // weights might want to be like arr.length X N matrix
  // returns is array of length(N)
  // ^ same with risks

  // tmp: change
  const numTrials = 100;
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
    weightsMat[i] = genNormRandWeightArr(arr.length, constraint);
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

  const noEfficientFrontierRiskBins = Math.floor(numTrials / 10) + 1;
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

  // maybe change `arr` to `tickers`?

  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Chart.js Line Chart - Cubic interpolation mode",
      },
      // tooltip: {
      //   enabled: false,
      // },
    },
    interaction: {
      intersect: false,
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
        type: "line",
        label: "Efficient Frontier",
        data: maxReturnPerBinIndexArr.map((idx) => ({
          x: riskArr[idx],
          y: retArr[idx],
        })),
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
      {
        type: "scatter",
        label: "Single Assets",
        data: arr.map((ticker) => ({
          x: Math.sqrt(AssetData[ticker].var),
          y: AssetData[ticker].avgMoRetPct,
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
    ],
  };

  return (
    <>
      <Chart type="scatter" options={options} data={data} />
    </>
  );
};

export default Optimizer;
