import * as React from "react";
import Optimizer from "./optimizer.js";
import * as styles from "../components/input-form.module.css";
import { Link } from "gatsby";
import {
  THREE_MO_TR_BILL_RATE,
  toSortedUpper,
  InputFields,
} from "./input-fields.js";

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlot: false,
      tickers: [],
      constraintPct: 100,
      riskFreeRatePct: THREE_MO_TR_BILL_RATE,
    };
  }

  handleOnSubmit = (values /* FormikValues */) => {
    this.setState({
      showPlot: true,
      tickers: toSortedUpper(values.assets),
      ticker: values.assets,
      constraintPct: values.constraintPct,
      riskFreeRatePct: values.riskFreeRatePct,
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <h2 className={`${styles.headerText}`}>
          Please enter the sample portfolio's information below.
        </h2>

        <p className={`${styles.headerText}`}>
          If you have any questions, please refer to the{" "}
          <Link to="/tutorial">Tutorial</Link>. Note that by using this site,
          you agree to the <Link to="/terms">Terms of Service</Link>.
        </p>
        <InputFields onSubmit={this.handleOnSubmit} />
        {this.state.showPlot && (
          <Optimizer
            tickers={this.state.tickers}
            constraintPct={this.state.constraintPct}
            riskFreeRatePct={this.state.riskFreeRatePct}
          />
        )}
      </div>
    );
  }
}

export default InputForm;
