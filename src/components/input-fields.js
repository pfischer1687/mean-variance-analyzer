import * as React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as styles from "./analyzer.module.css";
import {
  MIN_NUM_ASSETS,
  MAX_NUM_ASSETS,
  THREE_MO_TR_BILL_RATE,
  AssetCache,
  ValidationSchema,
} from "../utils";

/**
 * @callback onSubmitCallback
 * @param {Object} formValues
 * @param {string[]} formValues.assets
 * @param {number} formValues.constraintPct
 * @param {number} formValues.benchmarkRatePct
 */

/**
 * @param {Object} props
 * @param {onSubmitCallback} props.onSubmit
 * @return {JSX}
 */
const InputFields = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{
        assets: ["", ""],
        constraintPct: 100,
        benchmarkRatePct: THREE_MO_TR_BILL_RATE,
      }}
      validationSchema={ValidationSchema.getValidationSchema()}
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

                <label className={styles.formLabels} htmlFor="benchmarkRatePct">
                  Benchmark (%):{" "}
                </label>

                <div>
                  <Field
                    className={styles.formInputs}
                    id="benchmarkRatePct"
                    name="benchmarkRatePct"
                  />
                  <ErrorMessage
                    name="benchmarkRatePct"
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
