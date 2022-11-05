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
  let res = arrDotProd(arr, firstProduct);
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

  // below should be in for loop of length N only doing 1 for trial sake

  // temporarily setting all weights to 1 to check
  let weightsArr = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    weightsArr[i] = 1;
  }

  // define array dot product and Matrix xfm functions???

  // let pfRetsArr =

  return (
    <>
      <p>
        {arrMatProduct(
          [1, 2],
          [
            [3, 4],
            [5, 6],
          ]
        )}
      </p>
      {arr.map((ticker) => (
        <p key={ticker}>{ticker}</p>
      ))}
    </>
  );
};

export default Optimizer;
