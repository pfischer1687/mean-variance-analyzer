import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
// is it possible to graphql query the data^ instead of importing again? what would be faster?

const Optimizer = ({ arr, children }) => {
  return (
    <div>
      <p>{arr}</p>
    </div>
  );
};

export default Optimizer;
