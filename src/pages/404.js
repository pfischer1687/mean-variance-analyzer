import * as React from "react";
import Layout from "../components/layout";
import { StaticImage } from "gatsby-plugin-image";
import Seo from "../components/seo";
import * as styles from "../components/about.module.css";

const NotFoundPage = () => {
  return (
    <Layout pageTitle="404: Page not found">
      <div className={styles.textContainer}>
        <h2>404: Page Not Found</h2>
        <p>
          Sorry, we couldn’t find what you were looking for. Please enjoy this
          picture of a cute dog and then click any of the navigation links above
          or footer links below to navigate through the site.
        </p>
        <StaticImage
          alt="Cute gray dog lying in a driveway with its tongue sticking out"
          src="../images/dog-pic.jpg"
        />
        <p>
          Photo by{" "}
          <a
            href="https://unsplash.com/@mutedtone?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Christopher Ayme
          </a>{" "}
          on{" "}
          <a
            href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </p>
      </div>
    </Layout>
  );
};

export const Head = () => <Seo title="404: Page not found" />;

export default NotFoundPage;
