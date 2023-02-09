import * as React from "react";
import * as AssetData from "../../data/asset-data.json";
import * as Yup from "yup";

export const MIN_NUM_ASSETS = 2;
export const MAX_NUM_ASSETS = 15;
export const THREE_MO_TR_BILL_RATE = 4.54;
export const F_TR_BILL_RATE = `Jan 2023: ${THREE_MO_TR_BILL_RATE}%`;
export const NUM_TRIALS = 1000000;
export const NUM_PLOT_POINTS = 1000;
export const MAX_NUM_EFF_FRONT_RISK_BINS = 20;
export const GET_ASSET_DATA_GH_REPO_URL =
  "https://github.com/pfischer1687/get-asset-data-for-mva";
export const SITE_URL = "https://mvanalyzer.dev/";
export const DEV_SITE_URL = "https://paulfischer.dev/";
export const SRC_CODE_URL =
  "https://github.com/pfischer1687/mean-variance-analyzer";

/**
 * Returns a copy of a string array that contains only uppercase non-null strings sorted in alphabetical order
 * @param {string[]} arr
 * @return {string[]}
 */
export const toSortedUpper = (arr) => {
  return arr
    .filter(Boolean)
    .map((v) => v.toUpperCase())
    .sort();
};

/**
 * Returns a boolean value representing whether a string array's values are unique by filtering the null values from the array, turning it into a Set, and then comparing the size of the Set to the length of the filtered array (helper function for ValidationSchema)
 * @param {string[]} arr
 * @return {boolean}
 */
const isUnique = (arr) => {
  let filtered = toSortedUpper(arr);
  let unique = new Set(filtered);
  return unique.size === filtered.length;
};

/** Class representing a cache of static asset data (helper class for InputFields component) */
export class AssetCache {
  static #cacheFlag = false;
  static #assetCache = { tickers: new Set(), datalist: [] };

  static #setAssetCache = () => {
    if (!AssetCache.#cacheFlag) {
      let tickerIndex = 0;
      for (let ticker in AssetData) {
        AssetCache.#assetCache.tickers.add(ticker);
        AssetCache.#assetCache.datalist.push(
          <option key={tickerIndex} value={ticker}>
            {`${ticker} (${AssetData[ticker].title})`}
          </option>
        );
        ++tickerIndex;
      }
      AssetCache.#assetCache.tickers.delete("default");
      AssetCache.#assetCache.datalist.pop();
      AssetCache.#cacheFlag = true;
    }
    return;
  };

  static getAssetCache = () => {
    AssetCache.#setAssetCache();
    return AssetCache.#assetCache;
  };
}

/** Class representing a static form validation schema (helper class for InputFields component) */
export class ValidationSchema {
  static #schemaFlag = false;
  static #schema;

  static #setSchema = () => {
    if (!ValidationSchema.#schemaFlag) {
      ValidationSchema.#schema = Yup.object().shape({
        assets: Yup.array(Yup.string())
          .compact((v) => v === undefined)
          .min(2, "Must have at least 2 asset tickers")
          .test(
            "IsInDatalist",
            "Asset tickers must be in datalist",
            (assets) => {
              for (let ticker of assets) {
                if (
                  !AssetCache.getAssetCache().tickers.has(ticker.toUpperCase())
                )
                  return false;
              }
              return true;
            }
          )
          .test("Unique", "Asset tickers must be unique", (tickers) =>
            isUnique(tickers)
          )
          .required("Required"),
        constraintPct: Yup.number()
          .typeError("Must be a number")
          .test(
            "MinAssets",
            "Must have at least 2 asset tickers",
            (constrPct, context) => {
              let numAssets = parseFloat(context.parent.assets.length);
              return numAssets >= 2;
            }
          )
          .test(
            "Min",
            "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%",
            (constrPct, context) => {
              let numAssets = parseFloat(context.parent.assets.length);
              return constrPct >= 100 / (numAssets - 1);
            }
          )
          .max(
            100,
            "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%"
          )
          .required("Required"),
        benchmarkRatePct: Yup.number()
          .typeError("Must be a number")
          .min(-50, "Benchmark must be such that: -50% <= benchmark <= 50%")
          .max(50, "Benchmark must be such that: -50% <= benchmark <= 50%")
          .required("Required"),
      });
      ValidationSchema.#schemaFlag = true;
    }
    return;
  };

  static getValidationSchema = () => {
    ValidationSchema.#setSchema();
    return ValidationSchema.#schema;
  };
}

/**
 * Returns the dot product of two 1-dimensional arrays
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number}
 */
const arrDotProd = (arr1, arr2) => {
  if (arr1.length === 0 || arr1.length !== arr2.length) {
    throw new Error(
      "Expected two 1-dimensional arrays of numbers of equal length > 0"
    );
  }

  let sum = 0;
  for (let i = 0; i < arr1.length; ++i) {
    sum += arr1[i] * arr2[i];
  }

  return sum;
};

/**
 * Returns the product arr^T.mat.arr (helper function for runMonteCarloSim)
 * @param {number[]} arr
 * @param {number[][]} mat
 * @return {number}
 */
const arrMatProduct = (arr, mat) => {
  if (
    arr.length === 0 ||
    arr.length !== mat.length ||
    arr.length !== mat[0].length
  ) {
    throw new Error(
      "Expected one 1-dimensional array and one 2-dimensional array of dimension arr.length x arr.length"
    );
  }

  let firstProduct = []; /** mat.arr */
  for (let i = 0; i < arr.length; ++i) {
    firstProduct[i] = arrDotProd(mat[i], arr);
  }

  return arrDotProd(arr, firstProduct);
};

/**
 * Returns array of positive random weights (helper function for genNormRandWeights)
 * @param {number} numWeights
 * @return {Object} weights
 * @return {number[]} weights.weights
 * @return {number} weights.sum
 */
const randomWeights = (numWeights) => {
  let weights = [];
  let sum = 0;
  const feigenbaumConst = 4.669201609102991;
  for (let i = 0; i < numWeights; ++i) {
    weights[i] =
      Math.random() **
      feigenbaumConst; /** Exponent helps spread out plot points in Markowitz bullet */
    sum += weights[i];
  }

  return {
    weights: weights,
    sum: sum,
  };
};

/**
 * Returns a normalized array of positive weights by first subjecting the array to a constraint, then redistributing any excess, and then randomly shuffling it to avoid first index bias (helper function for genNormRandWeights)
 * @param {Object} weights
 * @param {number[]} weights.weights
 * @param {number} weights.sum
 * @param {number} constraint
 * @return {number[]}
 */
const normalizeWeights = ({ weights, sum }, constraint) => {
  let excessVal = 0;
  let size = weights.length;
  for (let i = 0; i < size; ++i) {
    weights[i] /= sum;
    if (weights[i] > constraint) {
      excessVal += weights[i] - constraint;
      weights[i] = constraint;
    }
  }

  if (excessVal > 0) {
    let diff = 0;
    for (let i = 0; i < size; ++i) {
      diff = constraint - weights[i];
      if (diff >= excessVal) {
        weights[i] += excessVal;
        break;
      }
      weights[i] = constraint;
      excessVal -= diff;
    }
  }

  weights.sort(() => Math.random() - 0.5);
  return weights;
};

/**
 * Returns a normalized (sum = 1) array of positive (no short-selling) weights, each less than or equal to a given constraint (helper function for runMonteCarloSim)
 * @param {number} size
 * @param {number} constraint
 * @return {number[]}
 */
const genNormRandWeights = (size, constraint) => {
  if (size < MIN_NUM_ASSETS || size > MAX_NUM_ASSETS) {
    throw new Error(`Expected ${MIN_NUM_ASSETS} <= size <= ${MAX_NUM_ASSETS}`);
  } else if (constraint < 1 / size || constraint > 1) {
    throw new Error("Expected constraint in [1/size, 1]");
  }

  const weights = randomWeights(size);
  let normWeights = normalizeWeights(weights, constraint);
  return normWeights;
};

/**
 * Returns the covariance matrix of the maximum period annualized monthly returns contained in AssetData for an array of tickers (helper function for runMonteCarloSim)
 * @param {string[]} tickers
 * @return {number[][]}
 */
const createCovMatrix = (tickers) => {
  /** Initialize 2d array for matrix */
  let covMatrix = [];
  for (let i = 0; i < tickers.length; ++i) {
    covMatrix[i] = [];
  }

  /** Diagonal elements contain variances */
  for (let i = 0; i < tickers.length; ++i) {
    covMatrix[i][i] = AssetData[tickers[i]].annVar;
  }

  /** Off-diagonal elements contain covariances and are symmetric */
  for (let i = 0; i < tickers.length; ++i) {
    for (let j = i + 1; j < tickers.length; ++j) {
      covMatrix[i][j] = AssetData[tickers[i]].cov[tickers[j]];
      covMatrix[j][i] = covMatrix[i][j];
    }
  }

  return covMatrix;
};

/**
 * Returns the results of the Monte Carlo simulation for NUM_TRIALS random portfolio allocations (helper function for getOptimizerData)
 * @param {string[]} tickers
 * @param {number} constraint
 * @param {number} benchmarkRatePct
 * @return {Object} monteCarloResults
 * @return {number[][]} monteCarloResults.trialPflWeightsMatrix [NUM_TRIALS][tickers.length]
 * @return {number[]} monteCarloResults.trialPflReturns
 * @return {number[]} monteCarloResults.trialPflRisks
 * @return {number[]} monteCarloResults.maxSharpeRatio [val, index]
 * @return {number[]} monteCarloResults.minRisk [val, index]
 * @return {number} monteCarloResults.maxRisk
 */
const runMonteCarloSim = (tickers, constraint, benchmarkRatePct) => {
  let meanReturns = tickers.map((ticker) => AssetData[ticker].annRetPct);
  let covMatrix = createCovMatrix(tickers);
  let sharpeRatio = 0;

  let trialPflWeightsMatrix = [];
  let trialPflReturns = [];
  let trialPflRisks = [];
  let maxSharpeRatio = [];
  let minRisk = [];
  let maxRisk = 0;

  for (let i = 0; i < NUM_TRIALS; ++i) {
    trialPflWeightsMatrix[i] = genNormRandWeights(tickers.length, constraint);
    trialPflReturns[i] = arrDotProd(meanReturns, trialPflWeightsMatrix[i]);
    trialPflRisks[i] = Math.sqrt(
      arrMatProduct(trialPflWeightsMatrix[i], covMatrix)
    );
    sharpeRatio = (trialPflReturns[i] - benchmarkRatePct) / trialPflRisks[i];

    if (i === 0) {
      minRisk = [trialPflRisks[0], 0];
      maxRisk = trialPflRisks[0];
      maxSharpeRatio = [sharpeRatio, 0];
      continue;
    }
    if (sharpeRatio > maxSharpeRatio[0]) {
      maxSharpeRatio[0] = sharpeRatio;
      maxSharpeRatio[1] = i;
    }
    if (trialPflRisks[i] < minRisk[0]) {
      minRisk[0] = trialPflRisks[i];
      minRisk[1] = i;
    }
    if (trialPflRisks[i] > maxRisk) {
      maxRisk = trialPflRisks[i];
    }
  }

  return {
    trialPflWeightsMatrix: trialPflWeightsMatrix,
    trialPflReturns: trialPflReturns,
    trialPflRisks: trialPflRisks,
    maxSharpeRatio: maxSharpeRatio,
    minRisk: minRisk,
    maxRisk: maxRisk,
  };
};

/**
 * Returns an array of the risks that bound each of the MAX_NUM_EFF_FRONT_RISK_BINS bins of risk (helper function for getIndicesOfPflsOnEfficientFrontier)
 * @param {number} maxRisk
 * @param {number} minRiskVal
 * @return {number[]} riskBinBounds any portfolios with risk less than riskBinBounds[0] are in the first bin and larger than riskBinBounds[binDividerRisks.length - 1] are in the last bin
 */
const getRiskBinBounds = (maxRisk, minRiskVal) => {
  const binDividerLength = (maxRisk - minRiskVal) / MAX_NUM_EFF_FRONT_RISK_BINS;
  let riskBinBounds = [];
  riskBinBounds[0] = minRiskVal + binDividerLength;
  for (let i = 1; i < MAX_NUM_EFF_FRONT_RISK_BINS - 1; ++i) {
    riskBinBounds[i] = riskBinBounds[i - 1] + binDividerLength;
  }
  return riskBinBounds;
};

/**
 * Returns the index of the risk bin a given portfolio is in (helper function for getIndicesOfMaxReturnPerRiskBin)
 * @param {number[]} riskBinBounds
 * @param {number} trialPflRisk
 * @return {number}
 */
const getRiskBinIndex = (riskBinBounds, trialPflRisk) => {
  let riskBinIndex = 1; /** minimum risk is already at index 0 */
  for (let j = 0; j < riskBinBounds.length; ++j) {
    if (trialPflRisk > riskBinBounds[j]) {
      riskBinIndex = j + 2;
    } else {
      break;
    }
  }
  return riskBinIndex;
};

/**
 * Returns the indices of the portfolios with the maximum return in each bin of risk (helper function for getIndicesOfPflsOnEfficientFrontier)
 * @param {number} minRiskIndex
 * @param {number[]} riskBinBounds
 * @param {number[]} trialPflRisks
 * @param {number[]} trialPflReturns
 * @return {number[]}
 */
const getIndicesOfMaxReturnPerRiskBin = (
  minRiskIndex,
  riskBinBounds,
  trialPflRisks,
  trialPflReturns
) => {
  let indicesOfMaxReturnPerRiskBin = [];
  indicesOfMaxReturnPerRiskBin[0] =
    minRiskIndex; /** Start efficient frontier at minimum risk */
  let riskBinIndex = 1;
  for (let i = 0; i < NUM_TRIALS; ++i) {
    riskBinIndex = getRiskBinIndex(riskBinBounds, trialPflRisks[i]);

    if (indicesOfMaxReturnPerRiskBin[riskBinIndex] === undefined) {
      indicesOfMaxReturnPerRiskBin[riskBinIndex] = i;
      continue;
    } else if (
      trialPflReturns[i] >
      trialPflReturns[indicesOfMaxReturnPerRiskBin[riskBinIndex]]
    ) {
      indicesOfMaxReturnPerRiskBin[riskBinIndex] = i;
    }
  }
  return indicesOfMaxReturnPerRiskBin;
};

/**
 * Returns a filtered copy of the indicesOfMaxReturnPerRiskBin array such that it contains no undefined values, copies of the min risk portfolio, or portfolios with more risk than the max return single asset (helper function for getIndicesOfPflsOnEfficientFrontier)
 * @param {number[]} indicesOfMaxReturnPerRiskBin
 * @param {number[]} trialPflReturns
 * @return {number[]}
 */
const filterIndicesOfMaxReturnPerRiskBin = (
  indicesOfMaxReturnPerRiskBin,
  trialPflReturns
) => {
  indicesOfMaxReturnPerRiskBin = indicesOfMaxReturnPerRiskBin.filter(
    (idx) => idx !== undefined
  );

  if (indicesOfMaxReturnPerRiskBin[0] === indicesOfMaxReturnPerRiskBin[1]) {
    indicesOfMaxReturnPerRiskBin.shift();
  }

  for (let i = 1; i < indicesOfMaxReturnPerRiskBin.length; ++i) {
    if (
      trialPflReturns[indicesOfMaxReturnPerRiskBin[i]] <
      trialPflReturns[indicesOfMaxReturnPerRiskBin[i - 1]]
    ) {
      indicesOfMaxReturnPerRiskBin.splice(i);
      break;
    }
  }

  return indicesOfMaxReturnPerRiskBin;
};

/**
 * Returns indices of portfolios on efficient frontier by breaking Monte Carlo simulations into <= MAX_NUM_EFF_FRONT_RISK_BINS bins of risk and finding the max return in each risk bin (helper function for getOptimizerData)
 * @param {Object} monteCarloResults
 * @param {number} monteCarloResults.maxRisk
 * @param {number[]} monteCarloResults.minRisk [val, index]
 * @param {number[]} monteCarloResults.trialPflRisks
 * @param {number[]} monteCarloResults.trialPflReturns
 * @return {number[]}
 */
const getIndicesOfPflsOnEfficientFrontier = ({
  maxRisk,
  minRisk,
  trialPflRisks,
  trialPflReturns,
}) => {
  let riskBinBounds = getRiskBinBounds(maxRisk, minRisk[0]);
  let indicesOfMaxReturnPerRiskBin = getIndicesOfMaxReturnPerRiskBin(
    minRisk[1],
    riskBinBounds,
    trialPflRisks,
    trialPflReturns
  );
  let filteredIndicesOfMaxReturnPerRiskBin = filterIndicesOfMaxReturnPerRiskBin(
    indicesOfMaxReturnPerRiskBin,
    trialPflReturns
  );
  return filteredIndicesOfMaxReturnPerRiskBin;
};

/**
 * Returns options for scatter plot of Monte Carlo simulation of NUM_TRIALS random portfolios  (helper function for getOptimizerData)
 * @param {Object} monteCarloResults
 * @param {number[]} monteCarloResults.maxSharpeRatio [val, index]
 * @param {number[][]} monteCarloResults.trialPflWeightsMatrix [NUM_TRIALS][tickers.length]
 * @param {number[]} monteCarloResults.trialPflReturns
 * @param {number[]} monteCarloResults.trialPflRisks
 * @param {string[]} tickers
 * @param {number} benchmarkRatePct
 * @return {Object}
 */
const getMonteCarloPlotOptions = (
  { maxSharpeRatio, trialPflWeightsMatrix, trialPflReturns, trialPflRisks },
  tickers,
  benchmarkRatePct
) => {
  return {
    maintainAspectRatio: false,
    events: ["click", "mousemove"],
    responsive: true,
    plugins: {
      /** Tooltip plot labels */
      tooltip: {
        filter: function (context) {
          let label = context.dataset.label;
          if (label === "Markowitz Bullet") {
            return false; /** Hide tooltip on Markowitz bullet points */
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
                "Portfolio Allocations:",
                ...trialPflWeightsMatrix[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${Number(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Efficient Frontier") {
              return [
                `Sharpe Ratio: ${Number(
                  (trialPflReturns[context.raw.idx] - benchmarkRatePct) /
                    trialPflRisks[context.raw.idx]
                ).toFixed(2)}`,
                `Annualized Return: ${Number(context.raw.y).toFixed(2)}%`,
                `Standard Deviation: ${Number(context.raw.x).toFixed(2)}%`,
                "Portfolio Allocations:",
                ...trialPflWeightsMatrix[context.raw.idx].map(
                  (weight, index) =>
                    `  ${tickers[index]}: ${Number(weight * 100).toFixed(2)}%`
                ),
              ];
            } else if (label === "Individual Assets") {
              return [
                context.raw.ticker,
                `Sharpe Ratio: ${Number(
                  (context.raw.y - benchmarkRatePct) / context.raw.x
                ).toFixed(2)}`,
                `Annualized Return: ${Number(context.raw.y).toFixed(2)}%`,
                `Standard Deviation: ${Number(context.raw.x).toFixed(2)}%`,
              ];
            } else if (label === "Capital Market Line" && context.raw.x === 0) {
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
          text: "Annualized Return (%)",
        },
        beginAtZero: true,
      },
    },
  };
};

/**
 * Returns data for scatter plot of Monte Carlo simulation of NUM_TRIALS random portfolios (helper function for getOptimizerData)
 * @param {Object} monteCarloResults
 * @param {number[]} monteCarloResults.maxSharpeRatio [val, index]
 * @param {number[]} monteCarloResults.trialPflRisks
 * @param {number[]} monteCarloResults.trialPflReturns
 * @param {string[]} tickers
 * @param {number[]} indicesOfPflsOnEfficientFrontier
 * @param {number[]} benchmarkRatePct
 * @return {Object}
 */
const getMonteCarloPlotData = (
  { maxSharpeRatio, trialPflRisks, trialPflReturns },
  tickers,
  indicesOfPflsOnEfficientFrontier,
  benchmarkRatePct
) => {
  return {
    datasets: [
      {
        type: "scatter",
        label: "Max Sharpe Ratio",
        data: [
          {
            x: trialPflRisks[maxSharpeRatio[1]],
            y: trialPflReturns[maxSharpeRatio[1]],
            idx: maxSharpeRatio[1],
          },
        ],
        hitRadius: 7,
        backgroundColor: "rgba(255, 255, 0, 1)",
      },
      {
        type: "scatter",
        label: "Individual Assets",
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
        data: indicesOfPflsOnEfficientFrontier.map((idx) => ({
          x: trialPflRisks[idx],
          y: trialPflReturns[idx],
          idx: idx,
        })),
        hitRadius: 7,
        backgroundColor: "rgba(0, 0, 255, 1)",
      },
      {
        type: "scatter",
        label: "Markowitz Bullet",
        data: [...Array(NUM_PLOT_POINTS)].map((_) => {
          let idx = Math.floor(NUM_TRIALS * Math.random());
          return { x: trialPflRisks[idx], y: trialPflReturns[idx] };
        }),
        backgroundColor: "rgba(0, 255, 255, 1)",
      },
      {
        type: "line",
        label: "Capital Market Line",
        data: [
          {
            x: 0,
            y: benchmarkRatePct,
          },
          {
            x: trialPflRisks[maxSharpeRatio[1]],
            y: trialPflReturns[maxSharpeRatio[1]],
          },
        ],
        borderColor: "rgba(0, 0, 0, 1)",
      },
    ],
  };
};

/**
 * Returns options for pie chart of the tangency portfolio with the highest Sharpe ratio from the Monte Carlo simulation  (helper function for getOptimizerData)
 * @return {Object}
 */
const getPieChartOptions = () => {
  return {
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
};

/**
 * Returns an array of arrays containing tickers in the highest Sharpe ratio portfolio along with their weights as percentages, sorted from greatest weight to least (helper function for getOptimizerData)
 * @param {Object} monteCarloResults
 * @param {number[]} monteCarloResults.trialPflWeightsMatrix [NUM_TRIALS][tickers.length]
 * @param {number[]} monteCarloResults.maxSharpeRatio
 * @param {string[]} tickers
 * @return {[string, number][]} [[ticker, weight], ...]
 */
const getSortedMaxSharpeRatioPflWeights = (
  { trialPflWeightsMatrix, maxSharpeRatio },
  tickers
) => {
  let maxSharpeRatioPflWeights = trialPflWeightsMatrix[maxSharpeRatio[1]];
  return maxSharpeRatioPflWeights
    .map((weight, index) => [tickers[index], weight * 100])
    .sort((arr1, arr2) => arr2[1] - arr1[1]);
};

/**
 * Returns data for pie chart of the tangency portfolio (highest Sharpe ratio) from the Monte Carlo simulation (helper function for getOptimizerData)
 * @param {string[]} tickers
 * @param {[string, number][]} sortedMaxSharpeRatioPflWeights [[ticker, weight], ...]
 * @return {Object}
 */
const getPieChartData = (tickers, sortedMaxSharpeRatioPflWeights) => {
  const pieChartColors = tickers.map(
    (ticker) =>
      `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(
        255 * Math.random()
      )}, ${Math.floor(255 * Math.random())}`
  );

  return {
    labels: sortedMaxSharpeRatioPflWeights.map((arr) => arr[0]),
    datasets: [
      {
        label: "Portfolio Allocations for Maximum Sharpe Ratio",
        data: sortedMaxSharpeRatioPflWeights.map((arr) => arr[1]),
        backgroundColor: pieChartColors.map((color) => color + ", 0.2)"),
        borderColor: pieChartColors.map((color) => color + ", 1)"),
        borderWidth: 1,
      },
    ],
  };
};

/**
 * Returns JSX array of information for the highest Sharpe ratio from the Monte Carlo simulation  (helper function for getOptimizerData)
 * @param {Object} monteCarloResults
 * @param {number[]} monteCarloResults.maxSharpeRatio [val, index]
 * @param {number[]} monteCarloResults.trialPflReturns
 * @param {number[]} monteCarloResults.trialPflRisks
 * @param {[string, number][]} sortedMaxSharpeRatioPflWeights [[ticker, weight], ...]
 * @return {JSX[]}
 */
const getMaxSharpeRatioInfo = (
  { maxSharpeRatio, trialPflReturns, trialPflRisks },
  sortedMaxSharpeRatioPflWeights
) => {
  const maxSharpeRatioInfo = [
    `Sharpe Ratio: ${Number(maxSharpeRatio[0]).toFixed(2)}`,
    `Annualized Return: ${Number(trialPflReturns[maxSharpeRatio[1]]).toFixed(
      2
    )}%`,
    `Standard Deviation: ${Number(trialPflRisks[maxSharpeRatio[1]]).toFixed(
      2
    )}%`,
    "Portfolio Allocations:",
    ...sortedMaxSharpeRatioPflWeights.map(
      (arr) =>
        `${arr[0]} (${AssetData[arr[0]].title}): ${Number(arr[1]).toFixed(2)}%`
    ),
  ];

  return maxSharpeRatioInfo.map((Element, index) => (
    <p key={index}>{Element}</p>
  ));
};

/**
 * Returns the data required to plot the scatter and pie charts depicting a Monte Carlo simulation of random allocations to assets in a given financial portfolio subject to a constraint and compared to a benchmark (includes tangency portfolio and efficient frontier - helper function for Optimizer component)
 * @param {string[]} tickers
 * @param {number} constraint
 * @param {number} benchmarkRatePct
 * @return {Object} optimizerData
 * @return {Object} optimizerData.monteCarloPlotOptions
 * @return {Object} optimizerData.monteCarloPlotData
 * @return {Object} optimizerData.pieChartData
 * @return {Object} optimizerData.pieChartOptions
 * @return {Object} optimizerData.maxSharpeRatioInfo
 */
export const getOptimizerData = (tickers, constraint, benchmarkRatePct) => {
  let monteCarloResults = runMonteCarloSim(
    tickers,
    constraint,
    benchmarkRatePct
  );
  let indicesOfPflsOnEfficientFrontier =
    getIndicesOfPflsOnEfficientFrontier(monteCarloResults);
  let sortedMaxSharpeRatioPflWeights = getSortedMaxSharpeRatioPflWeights(
    monteCarloResults,
    tickers
  );

  let monteCarloPlotOptions = getMonteCarloPlotOptions(
    monteCarloResults,
    tickers,
    benchmarkRatePct
  );
  let monteCarloPlotData = getMonteCarloPlotData(
    monteCarloResults,
    tickers,
    indicesOfPflsOnEfficientFrontier,
    benchmarkRatePct
  );
  let pieChartData = getPieChartData(tickers, sortedMaxSharpeRatioPflWeights);
  let pieChartOptions = getPieChartOptions();
  let maxSharpeRatioInfo = getMaxSharpeRatioInfo(
    monteCarloResults,
    sortedMaxSharpeRatioPflWeights
  );

  return {
    monteCarloPlotOptions: monteCarloPlotOptions,
    monteCarloPlotData: monteCarloPlotData,
    pieChartData: pieChartData,
    pieChartOptions: pieChartOptions,
    maxSharpeRatioInfo: maxSharpeRatioInfo,
  };
};

/** Only export helper functions if being run in testing development environment */
if (process.env["NODE_DEV"] === "TEST") {
  module.exports.isUnique = isUnique;
  module.exports.arrDotProd = arrDotProd;
  module.exports.arrMatProduct = arrMatProduct;
  module.exports.genNormRandWeights = genNormRandWeights;
  module.exports.getRiskBinIndex = getRiskBinIndex;
  module.exports.getIndicesOfMaxReturnPerRiskBin =
    getIndicesOfMaxReturnPerRiskBin;
  module.exports.filterIndicesOfMaxReturnPerRiskBin =
    filterIndicesOfMaxReturnPerRiskBin;
  module.exports.getSortedMaxSharpeRatioPflWeights =
    getSortedMaxSharpeRatioPflWeights;
}
