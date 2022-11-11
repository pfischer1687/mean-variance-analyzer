import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import {
  container,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
  footerLinks,
  footerLinkItem,
  footerLinkText,
} from "./layout.module.css";

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
    <div className={container}>
      <header className={siteTitle}>{data.site.siteMetadata.title}</header>
      <nav>
        <ul className={navLinks}>
          <li className={navLinkItem}>
            <Link to="/" className={navLinkText}>
              Home
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/tutorial" className={navLinkText}>
              Tutorial
            </Link>
          </li>
          <li className={navLinkItem}>
            <Link to="/start" className={navLinkText}>
              Start
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <h1 className={heading}>{pageTitle}</h1>
        {children}
      </main>
      <footer>
        <ul className={footerLinks}>
          <li className={footerLinkItem}>
            <Link to="/about" className={footerLinkText}>
              About
            </Link>
          </li>
          <li className={footerLinkItem}>
            <Link to="/privacy" className={footerLinkText}>
              Privacy & Terms
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default Layout;
