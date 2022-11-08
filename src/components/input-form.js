import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import Optimizer from "./optimizer.js";

const minNumAssets = 2;
const maxNumAssets = 20;

// Get JSON asset tickers for dropdown select list
const keys = Object.keys(AssetData);
keys.pop(); // removes "default"
const selectList = keys.map((key) => (
  <option key={key} value={key}>
    {key} ({AssetData[key].title})
  </option>
));

/**
 * @param {function} handleSubmit
 * @param {number} numAssets
 * @param {function} handleChange
 * @param {function} addAsset
 * @param {function} removeAsset
 * @return {JSX}
 */
const generateForm = (
  handleSubmit,
  numAssets,
  handleChange,
  addAsset,
  removeAsset
) => {
  // Generate form for user to choose portfolio assets
  return (
    <>
      <form onSubmit={handleSubmit}>
        {[...Array(numAssets)].map((value, index) => (
          <label key={index}>
            Asset {index + 1}:
            <select index={index} onChange={handleChange}>
              <option value="">--Please choose an option--</option>
              {selectList}
            </select>
            <br />
          </label>
        ))}
        {numAssets < maxNumAssets ? (
          <button type="button" onClick={addAsset}>
            + Add Asset
          </button>
        ) : null}
        {numAssets > minNumAssets ? (
          <button type="button" onClick={removeAsset}>
            - Remove Asset
          </button>
        ) : null}
        <br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

/**
 * @param {number[]} values
 * @return {boolean}
 */
const validateForm = (values) => {
  // Validate that all select tags are filled and have unique values
  let hashSet = new Set();
  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === "") {
      alert("All assets must be filled in.");
      return false;
    }
    if (hashSet.has(values[i])) {
      alert("All assets must be unique.");
      return false;
    }
    hashSet.add(values[i]);
  }
  return true;
};

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      numAssets: minNumAssets,
      values: Array(minNumAssets), // ticker names
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.removeAsset = this.removeAsset.bind(this);
  }

  handleChange(event) {
    let tickers = this.state.values.slice();
    tickers[event.target.attributes.index.nodeValue] = event.target.value;
    this.setState({ values: tickers });
  }

  handleSubmit(event) {
    event.preventDefault();
    let formValidatedQ = validateForm(this.state.values);
    if (formValidatedQ) {
      this.setState((state) => ({
        showForm: false,
      }));
    }
    return;
  }

  addAsset() {
    let tickers = this.state.values.slice();
    tickers.push(undefined);
    this.setState((state) => ({
      numAssets: this.state.numAssets + 1,
      values: tickers,
    }));
  }

  removeAsset() {
    let tickers = this.state.values.slice();
    tickers.pop();
    this.setState((state) => ({
      numAssets: this.state.numAssets - 1,
      values: tickers,
    }));
  }

  render() {
    return (
      <>
        {this.state.showForm ? (
          generateForm(
            this.handleSubmit,
            this.state.numAssets,
            this.handleChange,
            this.addAsset,
            this.removeAsset
          )
        ) : (
          <Optimizer tickers={this.state.values} />
        )}
      </>
    );
  }
}

export default InputForm;
