import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

const PrivacyPage = () => {
  return (
    <Layout pageTitle="Privacy">
      <p>
        Hi there! I'm the proud creator of this site, which I built with Gatsby.
      </p>
    </Layout>
  );
};

export const Head = () => <Seo title="Privacy" />;

export default PrivacyPage;
