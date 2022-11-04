import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import Optimizer from "./optimizer.js";

// Get JSON asset data for dropdown list
const keys = Object.keys(AssetData);
keys.pop(); // removes "default"
const selectList = keys.map((key) => (
  <option key={key} value={key}>
    {key}
  </option>
));

// Generate the Form for user to choose portfolio assets
const generateForm = (
  handleSubmit,
  NumOfAssets,
  handleChange,
  addAsset,
  removeAsset
) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {[...Array(NumOfAssets)].map((value, index) => (
          <label key={index}>
            Choose an asset:
            <select
              name={`asset${index}`}
              index={index}
              onChange={handleChange}
            >
              <option value="">--Please choose an option--</option>
              {selectList}
            </select>
            <br />
          </label>
        ))}
        <br />
        <input type="submit" value="Submit" />
      </form>
      {NumOfAssets < 30 ? (
        <button onClick={addAsset}>+ Add Asset</button>
      ) : null}
      {NumOfAssets > 7 ? (
        <button onClick={removeAsset}>- Remove Asset</button>
      ) : null}
    </>
  );
};

// Make sure all asset select tags have unique values
const validateForm = (values) => {
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
    this.initNumOfAssets = 7;
    this.state = {
      showForm: true,
      NumOfAssets: this.initNumOfAssets,
      values: Array(this.initNumOfAssets),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.removeAsset = this.removeAsset.bind(this);
  }

  handleChange(event) {
    let arr = this.state.values.slice();
    arr[event.target.attributes.index.nodeValue] = event.target.value;
    this.setState({ values: arr });
  }

  handleSubmit(event) {
    event.preventDefault();
    let formValidatedQ = validateForm(this.state.values);
    if (formValidatedQ) {
      this.setState((state) => ({
        showForm: false,
      }));
    }
  }

  addAsset() {
    let arr = this.state.values.slice();
    arr.push(undefined);
    this.setState((state) => ({
      NumOfAssets: this.state.NumOfAssets + 1,
      values: arr,
    }));
  }

  removeAsset() {
    let arr = this.state.values.slice();
    arr.pop();
    this.setState((state) => ({
      NumOfAssets: this.state.NumOfAssets - 1,
      values: arr,
    }));
  }

  render() {
    return (
      <>
        {this.state.showForm ? (
          generateForm(
            this.handleSubmit,
            this.state.NumOfAssets,
            this.handleChange,
            this.addAsset,
            this.removeAsset
          )
        ) : (
          <Optimizer arr={this.state.values} />
        )}
      </>
    );
  }
}

export default InputForm;
