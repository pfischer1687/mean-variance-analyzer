import * as React from "react";
import * as AssetData from "../../data/asset-data-test.json";
import Optimizer from "./optimizer.js";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import * as styles from "../components/input-form.module.css";

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
  constraintPct: Yup.number()
    .test("Min", "Values must be >= 100/(# assets - 1)", (v, context) => {
      let numAssets = parseFloat(context.parent.assets.length);
      return numAssets >= 2 && v >= 100 / (numAssets - 1);
    })
    .max(100)
    .required("Required"),
  riskFreeRatePct: Yup.number().min(-50).max(50).required("Required"),
});

/**
 * @param {class} inputForm
 * @return {JSX}
 */
const genInputForm = (inputForm) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.formLabels}>Please enter the information:</h2>
      <Formik
        initialValues={{
          assets: ["", ""],
          constraintPct: 100,
          riskFreeRatePct: 3.72,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 500));
          inputForm.setState({
            showPlot: true,
            tickers: filterArr(values.assets),
            ticker: values.assets,
            constraintPct: values.constraintPct,
            riskFreeRatePct: values.riskFreeRatePct,
          });
        }}
      >
        {({ values, errors, touched }) => (
          <Form>
            <FieldArray name="assets">
              {({ insert, remove }) => (
                <div>
                  {values.assets.map((value, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`assets.${index}`}
                        className={styles.formLabels}
                      >
                        Asset {index + 1}:{" "}
                      </label>
                      <br />
                      <Field
                        id={`assets.${index}`}
                        name={`assets.${index}`}
                        list="assets-list"
                        className={styles.formInputs}
                      />
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
                        <button type="button" onClick={() => remove(index)}>
                          -
                        </button>
                      )}
                      <br />
                    </div>
                  ))}
                  <ErrorMessage name="assets" className="field-error" />
                  <ErrorMessage name="tmp" />

                  {values.assets.length >= maxNumAssets ? null : (
                    <button
                      className={styles.addAssetButton}
                      type="button"
                      onClick={() => insert(values.assets.length, "")}
                    >
                      + Add Asset
                    </button>
                  )}
                  <br />

                  <label className={styles.formLabels} htmlFor="constraintPct">
                    Max Allocation (%):
                  </label>
                  <Field
                    className={styles.formInputs}
                    id="constraintPct"
                    name="constraintPct"
                  />
                  <ErrorMessage name="constraintPct" className="field-error" />
                  <br />

                  <label
                    className={styles.formLabels}
                    htmlFor="riskFreeRatePct"
                  >
                    Benchmark (%):{" "}
                  </label>
                  <Field
                    className={styles.formInputs}
                    id="riskFreeRatePct"
                    name="riskFreeRatePct"
                  />
                  <ErrorMessage
                    name="riskFreeRatePct"
                    className="field-error"
                  />
                  <br />

                  <div>
                    <button type="submit" className={styles.submitButton}>
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </div>
  );
};

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlot: false,
      tickers: [],
      constraintPct: 100,
      riskFreeRatePct: 3.72,
    };
  }
  render() {
    return (
      <>
        {genInputForm(this)}
        {this.state.showPlot ? (
          <Optimizer
            tickers={this.state.tickers}
            constraintPct={this.state.constraintPct}
            riskFreeRatePct={this.state.riskFreeRatePct}
          />
        ) : null}
      </>
    );
  }
}

export default InputForm;
