import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords }) => {
  const canonicalUrl = `https://codepulse-r.com${window.location.pathname.toLowerCase()}`;

  return (
    <Helmet>
      <title>
        {title
          ? `${title} | CodePulse-R`
          : "CodePulse-R - Master Coding Skills"}
      </title>
      <meta
        name="description"
        content={
          description ||
          "Learn coding with CodePulse-R - The best platform for mastering programming languages like Java, Python, SQL, and more."
        }
      />
      <meta
        name="keywords"
        content={
          keywords ||
          "coding, programming, java, python, sql, react, tutorial, learn coding, codepulse-r, online compiler, coding exam, programming quiz, tech classes, learn technology"
        }
      />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;
