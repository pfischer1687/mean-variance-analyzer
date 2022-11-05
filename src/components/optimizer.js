import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
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
  const numTrials = 5;
  const constraint = 0.3;
  let retArr = new Array(numTrials);
  let riskArr = new Array(numTrials);
  let weightsMat = new Array(numTrials);
  for (let i = 0; i < numTrials; i++) {
    weightsMat[i] = genNormRandWeightArr(arr.length, constraint);
  }

  return (
    <>
      {arr.map((ticker) => (
        <p key={ticker}>{ticker}</p>
      ))}
    </>
  );
};

export default Optimizer;
