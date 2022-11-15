import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import InputForm from "../components/input-form";

const StartPage = () => {
  return (
    <Layout pageTitle="Start">
      <InputForm /> {/* Includes optimizer component */}
    </Layout>
  );
};

export const Head = () => <Seo title="Start" />;

export default StartPage;
