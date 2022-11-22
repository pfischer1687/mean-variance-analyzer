import * as React from "react";
import { Link } from "gatsby";
import * as styles from "./layout.module.css";
import { StaticImage } from "gatsby-plugin-image";

const Layout = ({ pageTitle, children }) => {
  React.useEffect(() => {
    const hamburgerMenuBtn = document.querySelector(`.${styles.hamburgerMenu}`);
    const mobileMenu = document.querySelector(`.${styles.mobileNavLinks}`);
    hamburgerMenuBtn.addEventListener("click", () => {
      hamburgerMenuBtn.classList.toggle(styles.hamburgerMenuIsActive);
      mobileMenu.classList.toggle(styles.mobileNavLinksIsActive);
    });
  });

  return (
    <div>
      {/* Desktop navigation menu */}
      <nav>
        <ul className={styles.navLinks}>
          <li className={`${styles.navLinkHome} ${styles.buttonText}`}>
            {pageTitle === "Home" ? (
              <a href="/" className={styles.navLinkText}>
                <StaticImage
                  alt="Clifford, a reddish-brown pitbull, dozing in a bean bag chair"
                  src="../images/mva-logo-small.png"
                  width={60}
                />{" "}
                <div className={styles.homeButtonText}>
                  Mean-Variance Analyzer
                </div>
              </a>
            ) : (
              <Link to="/" className={styles.navLinkText}>
                <StaticImage
                  alt="Clifford, a reddish-brown pitbull, dozing in a bean bag chair"
                  src="../images/mva-logo-small.png"
                  width={60}
                />{" "}
                <div className={styles.homeButtonText}>
                  Mean-Variance Analyzer
                </div>
              </Link>
            )}
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
        {/* Mobile navigation menu */}
        <button className={styles.hamburgerMenu}>
          <div className={styles.hamburgerMenuBar}></div>
        </button>
      </nav>

      <nav className={styles.mobileNavLinks}>
        {pageTitle === "Home" ? <a href="/">Home</a> : <Link to="/">Home</Link>}

        {pageTitle === "Tutorial" ? (
          <a href="/tutorial">Tutorial</a>
        ) : (
          <Link to="/tutorial">Tutorial</Link>
        )}
        {pageTitle === "Start" ? (
          <a href="/start">Start now</a>
        ) : (
          <Link to="/start">Start now</Link>
        )}
      </nav>
      {/* <header className={styles.siteTitle}>
        {data.site.siteMetadata.title}
      </header> */}
      <main className={styles.container}>
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
            <Link to="/terms" className={styles.footerLinkText}>
              Terms of Service
            </Link>
          </li>
          <li className={styles.footerLinkItem}>
            <Link to="/privacy" className={styles.footerLinkText}>
              Privacy Policy
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Layout;
