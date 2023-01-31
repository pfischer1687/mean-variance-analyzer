import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import InputForm from "../components/input-form";

const StartPage = () => {
  return (
    <Layout pageTitle="Start">
      <InputForm />
    </Layout>
  );
};

export const Head = () => <Seo title="Start" />;

export default StartPage;
