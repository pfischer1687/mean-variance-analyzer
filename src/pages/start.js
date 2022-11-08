import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import InputForm from "../components/input-form";

const StartPage = () => {
  return (
    <Layout pageTitle="Start Page">
      <InputForm /> {/* Includes optimizer component */}
    </Layout>
  );
};

export const Head = () => <Seo title="Start Page" />;

export default StartPage;
