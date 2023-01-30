import * as React from "react";
import { Link } from "gatsby";
import * as styles from "./layout.module.css";
import { StaticImage } from "gatsby-plugin-image";

const Layout = ({ pageTitle, children }) => {
  const [hamburgerMenuActive, setHamburgerMenuActive] = React.useState(false);

  return (
    <div>
      {/* Desktop navigation menu */}
      <nav className={styles.navMenu}>
        <ul className={`${styles.navLinks} ${styles.container}`}>
          <li className={`${styles.navLinkHome} ${styles.buttonText}`}>
            <span>
              <Link to="/" className={styles.navLinkText}>
                <StaticImage
                  alt="Small MVA logo"
                  src="../images/mva-logo-small.png"
                  width={60}
                />{" "}
                <div className={styles.homeButtonText}>
                  Mean-Variance Analyzer
                </div>
              </Link>
            </span>
          </li>

          <li className={`${styles.navLinkItem} ${styles.buttonText}`}>
            <Link to="/background" className={styles.navLinkText}>
              <span>Background </span>
            </Link>
          </li>

          <li className={`${styles.navLinkItem} ${styles.buttonText}`}>
            <Link to="/tutorial" className={styles.navLinkText}>
              <span>Tutorial </span>
            </Link>
          </li>

          <li className={`${styles.navLinkItem} ${styles.buttonText}`}>
            <Link to="/start" className={styles.navLinkText}>
              <span>Analyzer</span>
            </Link>
          </li>
        </ul>

        {/* Mobile navigation hamburger button */}
        <button
          id="hamburgerMenuButton"
          aria-label="hamburgerMenuButton"
          className={`${styles.hamburgerMenu} ${
            hamburgerMenuActive ? styles.hamburgerMenuIsActive : ""
          }`}
          onClick={() => setHamburgerMenuActive(!hamburgerMenuActive)}
        >
          <div className={styles.hamburgerMenuBar}></div>
        </button>
      </nav>

      {/* Mobile navigation menu */}
      <nav
        className={`${styles.mobileNavLinks} ${
          hamburgerMenuActive ? styles.mobileNavLinksIsActive : ""
        }`}
      >
        <Link to="/">Home</Link>
        <Link to="/start">Analyzer</Link>
        <Link to="/tutorial">Tutorial</Link>
        <Link to="/background">Background</Link>
      </nav>

      <main className={styles.container}>
        {children}
        <div className={styles.spacer}></div>
      </main>

      <footer style={pageTitle === "About" ? { paddingTop: "1rem" } : null}>
        <ul className={`${styles.footerLinks} ${styles.container}`}>
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
