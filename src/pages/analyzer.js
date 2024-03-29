import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import Optimizer from "../components/optimizer.js";
import * as styles from "../components/analyzer.module.css";
import { Link } from "gatsby";
import { toSortedUpper, getOptimizerData } from "../utils";
import InputFields from "../components/input-fields.js";
import ClipLoader from "react-spinners/ClipLoader";

const AnalyzerPage = () => {
  const [loadingState, setLoadingState] = React.useState({
    showLoading: false,
    showPlot: false,
  });

  const [optimizerData, setOptimizerData] = React.useState({
    monteCarloPlotOptions: {},
    monteCarloPlotData: {},
    pieChartData: {},
    pieChartOptions: {},
    maxSharpeRatioInfo: [],
  });

  const handleOnSubmit = (formValues) => {
    setLoadingState({ showLoading: true, showPlot: false });

    setTimeout(() => {
      const tickers = toSortedUpper(formValues.assets);
      const constraint = formValues.constraintPct / 100;
      const benchmarkRatePct = formValues.benchmarkRatePct;
      const monteCarloSimData = getOptimizerData(
        tickers,
        constraint,
        benchmarkRatePct
      );
      setOptimizerData({
        monteCarloPlotOptions: monteCarloSimData.monteCarloPlotOptions,
        monteCarloPlotData: monteCarloSimData.monteCarloPlotData,
        pieChartData: monteCarloSimData.pieChartData,
        pieChartOptions: monteCarloSimData.pieChartOptions,
        maxSharpeRatioInfo: monteCarloSimData.maxSharpeRatioInfo,
      });

      setLoadingState({ showLoading: false, showPlot: true });
    }, 300);
  };

  return (
    <Layout pageTitle="Analyzer">
      <div className={styles.container}>
        <h2 className={`${styles.headerText}`}>Mean-Variance Analyzer</h2>

        <p className={`${styles.headerText}`}>
          To get started, please enter the asset information for your desired
          portfolio below. For any questions, refer to the{" "}
          <Link to="/tutorial">Tutorial</Link>. Note that by using this site,
          you agree to the <Link to="/terms">Terms of Service</Link>.
        </p>

        <InputFields onSubmit={handleOnSubmit} />

        <div className={styles.loadingSpinner}>
          <ClipLoader
            color={"#60b000"}
            loading={loadingState.showLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>

        {loadingState.showPlot && (
          <Optimizer
            monteCarloPlotOptions={optimizerData.monteCarloPlotOptions}
            monteCarloPlotData={optimizerData.monteCarloPlotData}
            pieChartData={optimizerData.pieChartData}
            pieChartOptions={optimizerData.pieChartOptions}
            maxSharpeRatioInfo={optimizerData.maxSharpeRatioInfo}
          />
        )}
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="Analyzer" />;

export default AnalyzerPage;
