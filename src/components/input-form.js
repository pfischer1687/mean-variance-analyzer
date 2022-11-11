import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import Optimizer from "./optimizer.js";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

export const minNumAssets = 2;
export const maxNumAssets = 20;

const allTickersSet = new Set(Object.keys(AssetData));
allTickersSet.delete("default");

/**
 * @param {string[]} arr
 * @return {string[]}
 */
const filterArr = (arr) => {
  return arr
    .filter(Boolean)
    .map((v) => v.toUpperCase())
    .sort();
};

const SignupSchema = Yup.object().shape({
  assets: Yup.array(Yup.string())
    .compact((v) => {
      return v === undefined || !allTickersSet.has(v.toUpperCase());
    })
    .min(2)
    .test("Unique", "Values need to be unique", (values) => {
      let fValues = filterArr(values);
      return new Set(fValues).size === fValues.length;
    })
    .required("Required"),
  constraintPct: Yup.number().min(0).max(100).required("Required"),
  riskFreeRatePct: Yup.number().min(-50).max(50).required("Required"),
});

/**
 * @param {class} inputForm
 * @return {JSX}
 */
const genInputForm = (inputForm) => {
  return (
    <Formik
      initialValues={{
        assets: ["", ""],
        constraintPct: 100,
        riskFreeRatePct: 3.72,
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        inputForm.setState({
          showForm: false,
          tickers: filterArr(values.assets),
          ticker: values.assets,
          constraintPct: values.constraintPct,
          riskFreeRatePct: values.riskFreeRatePct,
        });
      }}
    >
      {({ values }) => (
        <Form>
          <FieldArray name="assets">
            {({ insert, remove }) => (
              <div>
                {values.assets.map((value, index) => (
                  <label key={index}>
                    Asset {index + 1}:
                    <Field name={`assets.${index}`} list="assets-list" />
                    <datalist id="assets-list">
                      {Array.from(allTickersSet).map((ticker, tickerIndex) => (
                        <option key={tickerIndex} value={ticker}>
                          {`${ticker} (${AssetData[ticker].title})`}
                        </option>
                      ))}
                    </datalist>
                    {values.assets.length <= minNumAssets ? null : (
                      <button type="button" onClick={() => remove(index)}>
                        -
                      </button>
                    )}
                    <br />
                  </label>
                ))}
                <ErrorMessage name="assets" className="field-error" />

                {values.assets.length >= maxNumAssets ? null : (
                  <button
                    type="button"
                    onClick={() => insert(values.assets.length, "")}
                  >
                    + Add Asset
                  </button>
                )}
                <br />

                <label htmlFor="constraintPct">Max Allocation (%):</label>
                <Field id="constraintPct" name="constraintPct" />
                <ErrorMessage name="constraintPct" className="field-error" />
                <br />

                <label htmlFor="riskFreeRatePct">Benchmark (%): </label>
                <Field id="riskFreeRatePct" name="riskFreeRatePct" />
                <ErrorMessage name="riskFreeRatePct" className="field-error" />
                <br />

                <div>
                  <button type="submit">Submit</button>
                </div>
              </div>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      tickers: [],
      constraintPct: 100,
      riskFreeRatePct: 3.72,
    };
  }
  render() {
    return (
      <>
        {this.state.showForm ? (
          genInputForm(this)
        ) : (
          <Optimizer
            tickers={this.state.tickers}
            constraintPct={this.state.constraintPct}
            riskFreeRatePct={this.state.riskFreeRatePct}
          />
        )}
      </>
    );
  }
}

export default InputForm;
