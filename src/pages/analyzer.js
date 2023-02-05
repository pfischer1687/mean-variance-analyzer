import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import Optimizer from "../components/optimizer.js";
import * as styles from "../components/analyzer.module.css";
import { Link } from "gatsby";
import { THREE_MO_TR_BILL_RATE, toSortedUpper } from "../utils";
import InputFields from "../components/input-fields.js";

const AnalyzerPage = () => {
  const [inputFormState, setInputFormState] = React.useState({
    showPlot: false,
    tickers: [],
    constraintPct: 100,
    benchmarkRatePct: THREE_MO_TR_BILL_RATE,
  });

  const handleOnSubmit = (formValues) => {
    setInputFormState({
      ...inputFormState,
      showPlot: true,
      tickers: toSortedUpper(formValues.assets),
      ticker: formValues.assets,
      constraintPct: formValues.constraintPct,
      benchmarkRatePct: formValues.benchmarkRatePct,
    });
  };

  return (
    <Layout pageTitle="Analyzer">
      <div className={styles.container}>
        <h2 className={`${styles.headerText}`}>
          Please enter the sample portfolio's information below.
        </h2>

        <p className={`${styles.headerText}`}>
          If you have any questions, please refer to the{" "}
          <Link to="/tutorial">Tutorial</Link>. Note that by using this site,
          you agree to the <Link to="/terms">Terms of Service</Link>.
        </p>
        <InputFields onSubmit={handleOnSubmit} />
        {inputFormState.showPlot && (
          <Optimizer
            tickers={inputFormState.tickers}
            constraint={inputFormState.constraintPct / 100}
            benchmarkRatePct={inputFormState.benchmarkRatePct}
          />
        )}
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Analyzer" />;

export default AnalyzerPage;
