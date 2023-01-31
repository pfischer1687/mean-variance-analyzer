import * as React from "react";
import * as AssetData from "../../data/asset-data.json";

export const MIN_NUM_ASSETS = 2;
export const MAX_NUM_ASSETS = 15;
export const THREE_MO_TR_BILL_RATE = 3.72;
export const F_TR_BILL_RATE = `November 2022: ${THREE_MO_TR_BILL_RATE}%`;

/**
 * Returns a copy of an array that contains only uppercase non-null strings in alphabetical order
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
 * Returns a boolean value representing whether a string array's values are unique by filtering the null values from the array, turning it into a hash set, and then comparing the size of the set to the length of the filtered array (helper function for validationSchema in InputFields component)
 * @param {string[]} arr
 * @return {boolean}
 */
export const isUnique = (arr) => {
  let filtered = toSortedUpper(arr);
  let unique = new Set(filtered);
  return unique.size === filtered.length;
};

/** Helper class representing a cache of static asset data (used in InputFields component) */
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
  };

  static getAssetCache = () => {
    AssetCache.#setAssetCache();
    return AssetCache.#assetCache;
  };
}

/**
 * Returns the dot product of two 1-dimensional arrays (helper function in Optimizer component)
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number}
 */
export const arrDotProd = (arr1, arr2) => {
  if (arr1.length === 0 || arr1.length !== arr2.length) {
    throw new Error(
      "Expected two 1-dimensional arrays of numbers of equal length > 0"
    );
  }

  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += arr1[i] * arr2[i];
  }

  return sum;
};

/**
 * Returns the product arr^T.mat.arr (helper function for Optimizer component)
 * @param {number[]} arr
 * @param {number[][]} mat
 * @return {number}
 */
export const arrMatProduct = (arr, mat) => {
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
 * Returns array of random weights (helper function for genNormRandWeights)
 * @param {number} numWeights
 * @return {Object} weights
 * @return {number[]} weights.weights
 * @return {number} weights.sum
 */
const randomWeights = (numWeights) => {
  let weights = [];
  let sum = 0;
  const feigenbaumConst = 4.669201609102991;
  for (let i = 0; i < numWeights; i++) {
    weights[i] = Math.random() ** feigenbaumConst; // Exponent helps spread out Markowitz bullet
    sum += weights[i];
  }

  return {
    weights: weights,
    sum: sum,
  };
};

/**
 * Returns a normalized array of weights by first subjecting an array to a constraint, then redistributing any excess, and then randomly shuffling it to avoid first index bias (helper function for genNormRandWeights)
 * @param {Object} weights
 * @param {number[]} weights.weights
 * @param {number} weights.sum
 * @param {number} constraint
 * @return {number[]}
 */
const normalizeWeights = (weights, constraint) => {
  let excessVal = 0;
  let size = weights.weights.length;
  for (let i = 0; i < size; i++) {
    weights.weights[i] /= weights.sum;
    if (weights.weights[i] > constraint) {
      excessVal += weights.weights[i] - constraint;
      weights.weights[i] = constraint;
    }
  }

  if (excessVal > 0) {
    let diff = 0;
    for (let i = 0; i < size; i++) {
      diff = constraint - weights.weights[i];
      if (diff >= excessVal) {
        weights.weights[i] += excessVal;
        break;
      }
      weights.weights[i] = constraint;
      excessVal -= diff;
    }
  }

  weights.weights.sort(() => Math.random() - 0.5);
  return weights.weights;
};

/**
 * Returns a normalized (sum = 1) array of positive weights, each less than or equal to a given constraint (helper function for Optimizer component)
 * @param {number} size
 * @param {number} constraint
 * @return {number[]}
 */
export const genNormRandWeights = (size, constraint) => {
  if (size < MIN_NUM_ASSETS || size > MAX_NUM_ASSETS) {
    throw new Error(`Expected ${MIN_NUM_ASSETS} <= size <= ${MAX_NUM_ASSETS}`);
  } else if (constraint < 1 / size || constraint > 1) {
    throw new Error("Expected constraint in [1/size, 1]");
  }

  const weights = randomWeights(size);
  let normWeights = normalizeWeights(weights, constraint);
  return normWeights;
};
