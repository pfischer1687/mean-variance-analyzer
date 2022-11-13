import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";

const NotFoundPage = () => {
  return (
    <Layout pageTitle="404: Page not found">
      <p>
        Sorry 😔, we couldn’t find what you were looking for. Please enjoy this
        picture of a cute dog and then click any of the links above or below to
        navigate through the site.
      </p>
      <StaticImage
        alt="Clifford, a reddish-brown pitbull, dozing in a bean bag chair"
        src="../images/clifford.jpg"
      />
    </Layout>
  );
};

export const Head = () => <Seo title="404: Page not found" />;

export default NotFoundPage;
