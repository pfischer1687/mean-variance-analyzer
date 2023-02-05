process.env["NODE_DEV"] = "TEST";
const Utils = require("../utils");

test("toSortedUpper returns a copy of a string array that contains only uppercase non-null strings sorted in alphabetical order", () => {
  const arr = ["", "META", "aapl", undefined];
  const res = ["AAPL", "META"];
  expect(Utils.toSortedUpper(arr)).toStrictEqual(res);
});

test("isUnique returns a boolean value representing whether a string array's values are unique", () => {
  let arr = ["META", "AAPL"];
  expect(Utils.isUnique(arr)).toBe(true);

  arr = ["META", "AAPL", "META"];
  expect(Utils.isUnique(arr)).toBe(false);

  arr = ["META", "AAPL", "meta"];
  expect(Utils.isUnique(arr)).toBe(false);
});

test("arrDotProd returns the dot product of two 1-dimensional arrays", () => {
  let arr1 = [];
  let arr2 = [0, 1, 2];
  expect(() => Utils.arrDotProd(arr1, arr2)).toThrow(Error);

  arr1 = [0, 1];
  arr2 = [2, 3, 4];
  expect(() => Utils.arrDotProd(arr1, arr2)).toThrow(Error);

  arr1 = [0, 1, 2];
  arr2 = [3, 4, 5];
  const res = 14;
  expect(Utils.arrDotProd(arr1, arr2)).toBe(res);
});

test("arrMatProduct returns the product arr^T.mat.arr", () => {
  let arr = [];
  let mat = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  expect(() => Utils.arrMatProduct(arr, mat)).toThrow(Error);

  arr = [0, 1];
  mat = [
    [2, 3, 4],
    [5, 6, 7],
    [8, 9, 10],
  ];
  expect(() => Utils.arrMatProduct(arr, mat)).toThrow(Error);

  arr = [0, 1, 2];
  mat = [
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
  ];
  const res = 87;
  expect(Utils.arrMatProduct(arr, mat)).toBe(res);
});

/**
 * Throws error if an array does not contain normalized, constrained weights (helper function to test Utils.genNormRandWeights)
 * @param {number[]} normRandWeights
 * @param {number} constraint
 * @return {void}
 */
const testNormRandWeights = (normRandWeights, constraint) => {
  let sum = 0;
  for (let i = 0; i < normRandWeights.length; ++i) {
    sum += normRandWeights[i];
    if (normRandWeights[i] > constraint) {
      throw new Error(
        `(normRandWeights[i] = ${normRandWeights[i]}) > (constraint = ${constraint})`
      );
    }
    if (normRandWeights[i] < 0) {
      throw new Error(`(normRandWeights[i] = ${normRandWeights[i]}) < 0`);
    }
  }
  if (sum <= 0.99 || sum >= 1.01) {
    /** Check if normalized (= 1) within +/- 1% tolerance */
    throw new Error(`(sum = ${sum}) < 0.99 || sum > 1.01`);
  }
  return;
};

test("genNormRandWeights returns a normalized (sum = 1) array of positive weights, each less than or equal to a given constraint", () => {
  let size = Utils.MIN_NUM_ASSETS - 1;
  let constraint = 1;
  expect(() => Utils.genNormRandWeights(size, constraint)).toThrow(/<=/);

  size = Utils.MAX_NUM_ASSETS + 1;
  constraint = 1;
  expect(() => Utils.genNormRandWeights(size, constraint)).toThrow(/<=/);

  size = 10;
  constraint = 0.09;
  expect(() => Utils.genNormRandWeights(size, constraint)).toThrow(
    /constraint/
  );

  size = 10;
  constraint = 1.1;
  expect(() => Utils.genNormRandWeights(size, constraint)).toThrow(
    /constraint/
  );

  size = 10;
  constraint = 0.3;
  let normRandWeights = Utils.genNormRandWeights(size, constraint);
  expect(() => testNormRandWeights(normRandWeights, constraint)).not.toThrow(
    Error
  );
});

test("getRiskBinIndex returns the index of the risk bin a given portfolio is in", () => {
  let riskBinBounds = [10, 20, 30, 40, 50];
  let trialPflRisk = 5;
  let res = 1;
  expect(Utils.getRiskBinIndex(riskBinBounds, trialPflRisk)).toBe(res);

  trialPflRisk = 15;
  res = 2;
  expect(Utils.getRiskBinIndex(riskBinBounds, trialPflRisk)).toBe(res);

  trialPflRisk = 25;
  res = 3;
  expect(Utils.getRiskBinIndex(riskBinBounds, trialPflRisk)).toBe(res);

  trialPflRisk = 55;
  res = 6;
  expect(Utils.getRiskBinIndex(riskBinBounds, trialPflRisk)).toBe(res);
});

test("getIndicesOfMaxReturnPerRiskBin returns the indices of the portfolios with the maximum return in each bin of risk", () => {
  let minRiskIndex = 0;
  let riskBinBounds = [25, 50, 75];
  let trialPflRisks = [10, 50, 20, 80, 70, 30, 60, 90, 100, 40];
  let trialPflReturns = [90, 0, 80, 10, 70, 20, 60, 30, 50, 40];
  let res = [0, 0, 9, 4, 8];
  expect(
    Utils.getIndicesOfMaxReturnPerRiskBin(
      minRiskIndex,
      riskBinBounds,
      trialPflRisks,
      trialPflReturns
    )
  ).toStrictEqual(res);

  trialPflReturns = [90, 100, 80, 10, 70, 20, 60, 30, 50, 40];
  res = [0, 0, 1, 4, 8];
  expect(
    Utils.getIndicesOfMaxReturnPerRiskBin(
      minRiskIndex,
      riskBinBounds,
      trialPflRisks,
      trialPflReturns
    )
  ).toStrictEqual(res);
});

test("filterIndicesOfMaxReturnPerRiskBin returns a filtered copy of the indicesOfMaxReturnPerRiskBin array such that it contains no undefined values, copies of the min risk portfolio, or portfolios with more risk than the max return single asset", () => {
  let indicesOfMaxReturnPerRiskBin = [0, 1, 2, 3, undefined];
  let trialPflReturns = [0, 1, 2, 3, 4];
  let res = [0, 1, 2, 3];
  expect(
    Utils.filterIndicesOfMaxReturnPerRiskBin(
      indicesOfMaxReturnPerRiskBin,
      trialPflReturns
    )
  ).toStrictEqual(res);

  indicesOfMaxReturnPerRiskBin = [0, 0, 1, 2, 3];
  trialPflReturns = [0, 1, 2, 3, 4];
  res = [0, 1, 2, 3];
  expect(
    Utils.filterIndicesOfMaxReturnPerRiskBin(
      indicesOfMaxReturnPerRiskBin,
      trialPflReturns
    )
  ).toStrictEqual(res);

  indicesOfMaxReturnPerRiskBin = [0, 1, 2, 3, 5, 6];
  trialPflReturns = [0, 1, 2, 3, 4, 3, 2, 1, 0];
  res = [0, 1, 2, 3, 5];
  expect(
    Utils.filterIndicesOfMaxReturnPerRiskBin(
      indicesOfMaxReturnPerRiskBin,
      trialPflReturns
    )
  ).toStrictEqual(res);
});

test("getSortedMaxSharpeRatioPflWeights returns an array of arrays containing tickers in the highest Sharpe ratio portfolio along with their weights as percentages, sorted from greatest weight to least", () => {
  let trialPflWeightsMatrix = [
    [0.3, 0.2, 0.5],
    [0.5, 0.2, 0.3],
  ];
  let maxSharpeRatio = [0, 0];
  let monteCarloResults = {
    trialPflWeightsMatrix: trialPflWeightsMatrix,
    maxSharpeRatio: maxSharpeRatio,
  };
  let tickers = ["ABC", "DEF", "GHI"];
  let res = [
    ["GHI", 50],
    ["ABC", 30],
    ["DEF", 20],
  ];
  expect(
    Utils.getSortedMaxSharpeRatioPflWeights(monteCarloResults, tickers)
  ).toStrictEqual(res);
});
