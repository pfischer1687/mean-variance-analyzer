import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import * as styles from "./layout.module.css";
import { StaticImage } from "gatsby-plugin-image";

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={styles.container}>
      <nav>
        <ul className={styles.navLinks}>
          <li className={`${styles.navLinkHome} ${styles.buttonText}`}>
            <span>
              <Link to="/" className={styles.navLinkText}>
                <StaticImage
                  alt="Clifford, a reddish-brown pitbull, dozing in a bean bag chair"
                  src="../images/mva-logo-small.png"
                  width={60}
                />{" "}
                Mean-Variance Analyzer
              </Link>
            </span>
          </li>
          <li className={`${styles.navLinkItem} ${styles.buttonText}`}>
            <Link to="/tutorial" className={styles.navLinkText}>
              <span>Tutorial </span>
            </Link>
          </li>
          <li className={`${styles.navLinkItem} ${styles.buttonText}`}>
            <Link to="/start" className={styles.navLinkText}>
              <span>Start </span>
            </Link>
          </li>
        </ul>
      </nav>
      {/* <header className={styles.siteTitle}>
        {data.site.siteMetadata.title}
      </header> */}
      <main>
        {/* <h1 className={styles.heading}>{pageTitle}</h1> */}
        {children}
        <div className={styles.spacer}></div>
      </main>
      <footer>
        <ul className={styles.footerLinks}>
          <li className={styles.footerCopyright}>© 2022 All rights reserved</li>
          <li className={styles.footerLinkItem}>
            <Link to="/about" className={styles.footerLinkText}>
              About
            </Link>
          </li>
          <li className={styles.footerLinkItem}>
            <Link to="/privacy" className={styles.footerLinkText}>
              Privacy & Terms
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Layout;
