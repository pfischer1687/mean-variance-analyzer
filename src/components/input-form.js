import * as React from "react";
import * as AssetData from "../../data/tmp.json";

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
  initNumOfAssets,
  handleChange,
  addAsset
) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        {[...Array(initNumOfAssets)].map((value, index) => (
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
      {initNumOfAssets < 30 ? (
        <button onClick={addAsset}>+ Add Asset</button>
      ) : null}
    </>
  );
};

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    // this.initNumOfAssets = 7;
    this.state = {
      showForm: true,
      initNumOfAssets: 7,
      values: Array(7),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.addAsset = this.addAsset.bind(this);
  }

  handleChange(event) {
    let a = this.state.values.slice();
    a[event.target.attributes.index.nodeValue] = event.target.value;
    this.setState({ values: a });
  }

  handleSubmit(event) {
    this.setState((state) => ({
      showForm: false,
    }));
    event.preventDefault();
  }

  addAsset(event) {
    this.setState((state) => ({
      initNumOfAssets: this.state.initNumOfAssets + 1,
    }));
  }

  render() {
    return (
      <>
        {this.state.showForm ? (
          generateForm(
            this.handleSubmit,
            this.state.initNumOfAssets,
            this.handleChange,
            this.addAsset
          )
        ) : (
          <p>{this.state.values}</p>
        )}
      </>
    );
  }
}

export default InputForm;
