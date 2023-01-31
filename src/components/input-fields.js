import * as React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import * as styles from "./analyzer.module.css";
import {
  MIN_NUM_ASSETS,
  MAX_NUM_ASSETS,
  THREE_MO_TR_BILL_RATE,
  isUnique,
  AssetCache,
} from "../utils/utils.js";

/**
 * @callback onSubmitCallback
 * @param {Object} formValues
 * @param {string[]} formValues.assets
 * @param {number} formValues.constraintPct
 * @param {number} formValues.riskFreeRatePct
 */

/**
 * @param {onSubmitCallback} onSubmit
 * @return {JSX}
 */
const InputFields = ({ onSubmit }) => {
  let validationSchema = yup.object().shape({
    assets: yup
      .array(yup.string())
      .compact((v) => v === undefined)
      .min(2, "Must have at least 2 asset tickers")
      .test("IsInDatalist", "Asset tickers must be in datalist", (assets) => {
        for (let ticker of assets) {
          if (!AssetCache.getAssetCache().tickers.has(ticker.toUpperCase()))
            return false;
        }
        return true;
      })
      .test("Unique", "Asset tickers must be unique", (tickers) =>
        isUnique(tickers)
      )
      .required("Required"),
    constraintPct: yup
      .number()
      .typeError("Must be a number")
      .test(
        "MinAssets",
        "Must have at least 2 asset tickers",
        (constrPct, context) => {
          let numAssets = parseFloat(context.parent.assets.length);
          return numAssets >= 2;
        }
      )
      .test(
        "Min",
        "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%",
        (constrPct, context) => {
          let numAssets = parseFloat(context.parent.assets.length);
          return constrPct >= 100 / (numAssets - 1);
        }
      )
      .max(
        100,
        "Max allocation must be such that: 100% / (#assets - 1) <= allocation <= 100%"
      )
      .required("Required"),
    riskFreeRatePct: yup
      .number()
      .typeError("Must be a number")
      .min(-50, "Benchmark must be such that: -50% <= benchmark <= 50%")
      .max(50, "Benchmark must be such that: -50% <= benchmark <= 50%")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{
        assets: ["", ""],
        constraintPct: 100,
        riskFreeRatePct: THREE_MO_TR_BILL_RATE,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
                        {AssetCache.getAssetCache().datalist}
                      </datalist>

                      {values.assets.length > MIN_NUM_ASSETS && (
                        <button
                          id="removeAssetButton"
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

                {values.assets.length < MAX_NUM_ASSETS && (
                  <button
                    id="addAssetButton"
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

                <label className={styles.formLabels} htmlFor="riskFreeRatePct">
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
                  <button
                    id="submitAssetsButton"
                    type="submit"
                    className={styles.submitButton}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default InputFields;
