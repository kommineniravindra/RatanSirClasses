import React from "react";
import SEO from "./SEO";
import "../css/Legal.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for CodePulse-R. Learn how we collect, use, and protect your data."
        keywords="privacy policy, data protection, cookies policy, gdpr, codepulse-r"
      />
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to CodePulse-R. We are committed to protecting your personal
          information and your right to privacy. If you have any questions or
          concerns about our policy, or our practices with regards to your
          personal information, please contact us.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us
          when registering at the Services expressing an interest in obtaining
          information about us or our products and services, when participating
          in activities on the Services (such as posting in forums or entering
          competitions, contests or giveaways) or otherwise contacting us.
        </p>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>
          We use personal information collected via our Services for a variety
          of business purposes described below. We process your personal
          information for these purposes in reliance on our legitimate business
          interests, in order to enter into or perform a contract with you, with
          your consent, and/or for compliance with our legal obligations.
        </p>
        <ul>
          <li>To send you marketing and promotional communications.</li>
          <li>To fulfill and manage your orders.</li>
          <li>To post testimonials.</li>
          <li>To deliver targeted advertising to you.</li>
        </ul>
      </section>

      <section>
        <h2>4. Cookies and Web Beacons</h2>
        <p>
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to access or store information. Specific information about
          how we use such technologies and how you can refuse certain cookies is
          set out in our Cookie Notice.
        </p>
      </section>

      <section>
        <h2>5. Advertising Partners Privacy Policies</h2>
        <p>
          You may consult this list to find the Privacy Policy for each of the
          advertising partners of CodePulse-R.
        </p>
        <p>
          Third-party ad servers or ad networks use technologies like cookies,
          JavaScript, or Web Beacons that are used in their respective
          advertisements and links that appear on CodePulse-R, which are sent
          directly to users' browsers. They automatically receive your IP
          address when this occurs. These technologies are used to measure the
          effectiveness of their advertising campaigns and/or to personalize the
          advertising content that you see on websites that you visit.
        </p>
        <p>
          Note that CodePulse-R has no access to or control over these cookies
          that are used by third-party advertisers.
        </p>
      </section>

      <section>
        <h2>6. Google AdSense & DoubleClick Cookie</h2>
        <p>
          Google is one of a third-party vendor on our site. It also uses
          cookies, known as DART cookies, to serve ads to our site visitors
          based upon their visit to www.codepulse-r.com and other sites on the
          internet.
        </p>
        <p>
          However, visitors may choose to decline the use of DART cookies by
          visiting the Google ad and content network Privacy Policy at the
          following URL –{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noreferrer"
          >
            https://policies.google.com/technologies/ads
          </a>
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have questions or comments about this policy, you may email us
          at support@codepulse-r.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
