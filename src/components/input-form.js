import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import Optimizer from "./optimizer.js";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";

export const minNumAssets = 2;
export const maxNumAssets = 20;

const allTickersSet = new Set(Object.keys(AssetData));
allTickersSet.delete("default");

// const selectList = allTickers.map((key) => (
//   <option key={key} value={key}>
//     {key} ({AssetData[key].title})
//   </option>
// ));

// /**
//  * @param {function} handleSubmit
//  * @param {number} numAssets
//  * @param {function} handleChange
//  * @param {function} addAsset
//  * @param {function} removeAsset
//  * @return {JSX}
//  */
// const generateForm = (
//   handleSubmit,
//   numAssets,
//   handleChange,
//   addAsset,
//   removeAsset
// ) => {
//   // Generate form for user to choose portfolio assets
//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         {[...Array(numAssets)].map((value, index) => (
//           <label key={index}>
//             Asset {index + 1}:
//             {/* <select index={index} onChange={handleChange}>
//               <option value="">--Please choose an option--</option>
//               {selectList}
//             </select> */}
//             <input list={`assets-datalist-${index}`} />
//             <datalist id={`assets-datalist-${index}`}>
//               {allTickers.map((ticker, index) => (
//                 <option
//                   key={`option-${index}`}
//                   value={`${ticker} (${AssetData[ticker].title})`}
//                 />
//               ))}
//             </datalist>
//             <br />
//           </label>
//         ))}
//         {numAssets < maxNumAssets ? (
//           <button type="button" onClick={addAsset}>
//             + Add Asset
//           </button>
//         ) : null}
//         {numAssets > minNumAssets ? (
//           <button type="button" onClick={removeAsset}>
//             - Remove Asset
//           </button>
//         ) : null}
//         <br />
//         <label>
//           Max Allocation (%):
//           <input type="text" id="constraintPct" name="constraintPct" />
//         </label>
//         <br />
//         <label>
//           Benchmark (%):
//           <input type="text" id="riskFreeRatePct" name="riskFreeRatePct" />
//         </label>
//         <br />
//         <input type="submit" value="Submit" />
//       </form>
//     </>
//   );
// };

// /**
//  * @param {number[]} values
//  * @return {boolean}
//  */
// const validateForm = (values) => {
//   // Validate that all datalist tags are filled and have unique values
//   let hashSet = new Set();
//   for (let i = 0; i < values.length; i++) {
//     if (values[i] === undefined || values[i] === "") {
//       alert("All assets must be filled in.");
//       return false;
//     }
//     if (hashSet.has(values[i])) {
//       alert("All assets must be unique.");
//       return false;
//     }
//     hashSet.add(values[i]);
//   }

//   return true;
// };

// class InputForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showForm: true,
//       numAssets: minNumAssets,
//       values: Array(minNumAssets), // ticker names
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.addAsset = this.addAsset.bind(this);
//     this.removeAsset = this.removeAsset.bind(this);
//   }

//   handleChange(event) {
//     let tickers = this.state.values.slice();
//     tickers[event.target.attributes.index.nodeValue] = event.target.value;
//     this.setState({ values: tickers });
//   }

//   handleSubmit(event) {
//     event.preventDefault();
//     let formValidatedQ = validateForm(this.state.values);
//     if (formValidatedQ) {
//       this.setState((state) => ({
//         showForm: false,
//       }));
//     }
//     return;
//   }

//   addAsset() {
//     let tickers = this.state.values.slice();
//     tickers.push(undefined);
//     this.setState((state) => ({
//       numAssets: this.state.numAssets + 1,
//       values: tickers,
//     }));
//   }

//   removeAsset() {
//     let tickers = this.state.values.slice();
//     tickers.pop();
//     this.setState((state) => ({
//       numAssets: this.state.numAssets - 1,
//       values: tickers,
//     }));
//   }

//   render() {
//     return (
//       <>
//         {this.state.showForm ? (
//           generateForm(
//             this.handleSubmit,
//             this.state.numAssets,
//             this.handleChange,
//             this.addAsset,
//             this.removeAsset
//           )
//         ) : (
//           <Optimizer tickers={this.state.values} />
//         )}
//       </>
//     );
//   }
// }

// class InputForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showForm: true,
//       numAssets: minNumAssets,
//       values: Array(minNumAssets), // ticker names
//     };
//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.addAsset = this.addAsset.bind(this);
//     this.removeAsset = this.removeAsset.bind(this);
//   }

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    //       this.state = {
    //         showForm: true,
    //         numAssets: minNumAssets,
    //         values: Array(minNumAssets), // ticker names
    //       };
    //       this.handleChange = this.handleChange.bind(this);
    //       this.handleSubmit = this.handleSubmit.bind(this);
    //       this.addAsset = this.addAsset.bind(this);
    //       this.removeAsset = this.removeAsset.bind(this);
  }
  render() {
    return (
      <>
        <Formik
          initialValues={{ assets: ["", ""] }}
          onSubmit={(values) =>
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
            }, 500)
          }
        >
          {({ values }) => (
            <Form>
              <FieldArray
                name="assets"
                render={(arrayHelpers) => (
                  <div>
                    {values.assets.map((value, index) => (
                      <label key={index}>
                        Asset {index + 1}:
                        <Field name={`assets.${index}`} list="assets-list" />
                        <datalist id="assets-list">
                          {Array.from(allTickersSet).map(
                            (ticker, tickerIndex) => (
                              <option key={tickerIndex} value={ticker}>
                                {`${ticker} (${AssetData[ticker].title})`}
                              </option>
                            )
                          )}
                        </datalist>
                        {values.assets.length <= minNumAssets ? null : (
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                        )}
                        <br />
                      </label>
                    ))}
                    {values.assets.length >= maxNumAssets ? null : (
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.insert(values.assets.length, "")
                        }
                      >
                        + Add Asset
                      </button>
                    )}
                    <br />
                    <label htmlFor="constraintPct">
                      Max Allocation (%):
                      <Field name="constraintPct" />
                    </label>
                    <br />
                    <label htmlFor="riskFreeRatePct">
                      Benchmark (%):
                      <Field name="riskFreeRatePct" />
                    </label>
                    <br />
                    <div>
                      <button type="submit">Submit</button>
                    </div>
                  </div>
                )}
              />
            </Form>
          )}
        </Formik>
      </>
    );
  }
}

export default InputForm;
