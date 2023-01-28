import * as React from "react";
import * as AssetData from "../../data/asset-data.json";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import * as styles from "../components/input-form.module.css";

export const MIN_NUM_ASSETS = 2;
export const MAX_NUM_ASSETS = 15;
export const THREE_MO_TR_BILL_RATE = 3.72; // November 2022

/**
 * @param {string[]} arr
 * @return {string[]}
 */
export const toSortedUpper = (arr) => {
  // Return a copy of an array that contains only uppercase non-null strings in alphabetical order
  return arr
    .filter(Boolean)
    .map((v) => v.toUpperCase())
    .sort();
};

class AssetCache {
  static #cacheFlag = false;
  static #assetCache = { tickers: new Set(), datalist: [] };

  static #setAssetCache = () => {
    if (!AssetCache.#cacheFlag) {
      let tickerIndex = 0;
      for (let ticker in AssetData) {
        AssetCache.#assetCache.tickers.add(ticker);
        AssetCache.#assetCache.datalist.push(
          <option key={tickerIndex} value={ticker}>
            {`${ticker} (${AssetData[ticker].title})`}
          </option>
        );
        ++tickerIndex;
      }
      AssetCache.#assetCache.tickers.delete("default");
      AssetCache.#assetCache.datalist.pop();
      AssetCache.#cacheFlag = true;
    }
  };
  static getAssetCache = () => {
    AssetCache.#setAssetCache();
    return AssetCache.#assetCache;
  };
}

/**
 * @param {string[]} arr
 * @return {boolean}
 */
const isUnique = (arr) => {
  // Return boolean value representing whether a string array's values are unique by filtering the null values from the array, turning it into a hash set, and then comparing the size of the set to the length of the filtered array (helper function for validationSchema)
  let filtered = toSortedUpper(arr);
  let unique = new Set(filtered);
  return unique.size === filtered.length;
};

/**
 * @callback onSubmitCallback
 * @param {Object} values
 * @param {string[]} values.assets
 * @param {number} values.constraintPct
 * @param {number} values.riskFreeRatePct
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
