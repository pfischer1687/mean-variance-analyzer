import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
// is it possible to graphql query the data^ instead of importing again? what would be faster?

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

  return (
    <>
      {arr.map((ticker) => (
        <p key={ticker}>{ticker}</p>
      ))}
    </>
  );
};

export default Optimizer;
