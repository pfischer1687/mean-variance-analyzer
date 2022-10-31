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

const createSelectItems = (num, handleChange) => {
  return [...Array(num)].map((value, index) => (
    <select
      name={`asset${index}`}
      key={index}
      index={index}
      onChange={handleChange}
    >
      <option value="">--Please choose an option--</option>
      {selectList}
    </select>
  ));
};

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.initNumOfAssets = 7;
    this.state = { showForm: true, values: Array(this.initNumOfAssets) };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    return (
      <>
        {this.state.showForm ? (
          <form onSubmit={this.handleSubmit}>
            <label>
              Choose an asset:
              {/* <select onChange={this.handleChange}>
                <option value="">--Please choose an option--</option>
                {selectList}
              </select> */}
              {createSelectItems(this.initNumOfAssets, this.handleChange)}
            </label>
            <input type="submit" value="Submit" />
          </form>
        ) : (
          <p>{this.state.values}</p>
        )}
      </>
    );
  }
}

export default InputForm;
