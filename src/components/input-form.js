import * as React from "react";
import * as AssetData from "../../data/asset-data.json";
import Optimizer from "./optimizer.js";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import * as styles from "../components/input-form.module.css";
import { Link } from "gatsby";

export const minNumAssets = 2;
export const maxNumAssets = 15;

const allTickersSet = new Set(Object.keys(AssetData));
allTickersSet.delete("default");

/**
 * @param {string[]} arr
 * @return {string[]}
 */
const filterStrArr = (arr) => {
  // Return a copy of an array that contains only uppercase non-null strings in alphabetical order
  return arr
    .filter(Boolean)
    .map((v) => v.toUpperCase())
    .sort();
};

const InputSchema = Yup.object().shape({
  assets: Yup.array(Yup.string())
    .compact((v) => {
      return v === undefined || !allTickersSet.has(v.toUpperCase());
    })
    .min(2, "Must have at least 2 valid asset tickers")
    .test("Unique", "Asset tickers must be unique", (values) => {
      let fValues = filterStrArr(values);
      return new Set(fValues).size === fValues.length;
    })
    .required("Required"),
  constraintPct: Yup.number()
    .typeError("Must be a number")
    .test("MinAssets", "Must have at least 2 asset tickers", (v, context) => {
      let numAssets = parseFloat(context.parent.assets.length);
      return numAssets >= 2;
    })
    .test(
      "Min",
      "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%",
      (v, context) => {
        let numAssets = parseFloat(context.parent.assets.length);
        return v >= 100 / (numAssets - 1);
      }
    )
    .max(
      100,
      "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%"
    )
    .required("Required"),
  riskFreeRatePct: Yup.number()
    .typeError("Must be a number")
    .min(-50, "Benchmark must be such that: -50% <= benchmark <= 50%")
    .max(50, "Benchmark must be such that: -50% <= benchmark <= 50%")
    .required("Required"),
});

/**
 * @param {class} inputForm
 * @return {JSX}
 */
const genInputForm = (inputForm) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.formLabels}>
        Please enter the sample portfolio's information below.
      </h2>

      <p className={styles.formLabels}>
        If you have any questions, please refer to the{" "}
        <Link to="/tutorial">Tutorial</Link>. Note that by using this site, you
        agree to the <Link to="/terms">Terms of Service</Link>.
      </p>

      <Formik
        initialValues={{
          assets: ["", ""],
          constraintPct: 100,
          riskFreeRatePct: 3.72,
        }}
        validationSchema={InputSchema}
        onSubmit={(values) => {
          inputForm.setState({
            showPlot: true,
            tickers: filterStrArr(values.assets),
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
                <>
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
                          placeholder="Enter ticker"
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
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className={styles.removeButton}
                          >
                            X
                          </button>
                        )}
                        <br />
                      </div>
                    ))}
                    <ErrorMessage
                      name="assets"
                      className={styles.fieldError}
                      component="div"
                    />
                  </div>

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

                  <div>
                    <Field
                      className={styles.formInputs}
                      id="constraintPct"
                      name="constraintPct"
                    />
                    <ErrorMessage
                      name="constraintPct"
                      className={styles.fieldError}
                      component="div"
                    />
                  </div>

                  <label
                    className={styles.formLabels}
                    htmlFor="riskFreeRatePct"
                  >
                    Benchmark (%):{" "}
                  </label>

                  <div>
                    <Field
                      className={styles.formInputs}
                      id="riskFreeRatePct"
                      name="riskFreeRatePct"
                    />
                    <ErrorMessage
                      name="riskFreeRatePct"
                      className={styles.fieldError}
                      component="div"
                    />
                  </div>

                  <div>
                    <button type="submit" className={styles.submitButton}>
                      Submit
                    </button>
                  </div>
                </>
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
