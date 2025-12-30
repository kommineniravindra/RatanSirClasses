import React from "react";
import SEO from "./SEO";
import "../css/Legal.css";

const TermsOfService = () => {
  return (
    <div className="legal-container">
      <SEO
        title="Terms of Service"
        description="Terms of Service for CodePulse-R. Read our terms and conditions for using our platform."
        keywords="terms of service, terms and conditions, user agreement, codepulse-r"
      />
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <section>
        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms of Use constitute a legally binding agreement made between
          you, whether personally or on behalf of an entity (“you”) and
          CodePulse-R (“we,” “us” or “our”), concerning your access to and use
          of the CodePulse-R website as well as any other media form, media
          channel, mobile website or mobile application related, linked, or
          otherwise connected thereto (collectively, the “Site”).
        </p>
      </section>

      <section>
        <h2>2. Intellectual Property Rights</h2>
        <p>
          Unless otherwise indicated, the Site is our proprietary property and
          all source code, databases, functionality, software, website designs,
          audio, video, text, photographs, and graphics on the Site
          (collectively, the “Content”) and the trademarks, service marks, and
          logos contained therein (the “Marks”) are owned or controlled by us or
          licensed to us, and are protected by copyright and trademark laws and
          various other intellectual property rights.
        </p>
      </section>

      <section>
        <h2>3. User Representations</h2>
        <p>
          By using the Site, you represent and warrant that: (1) all
          registration information you submit will be true, accurate, current,
          and complete; (2) you will maintain the accuracy of such information
          and promptly update such registration information as necessary; (3)
          you have the legal capacity and you agree to comply with these Terms
          of Use; (4) you are not a minor in the jurisdiction in which you
          reside.
        </p>
      </section>

      <section>
        <h2>4. Prohibited Activities</h2>
        <p>
          You may not access or use the Site for any purpose other than that for
          which we make the Site available. The Site may not be used in
          connection with any commercial endeavors except those that are
          specifically endorsed or approved by us.
        </p>
      </section>

      <section>
        <h2>5. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with the laws of India and you irrevocably submit to the exclusive
          jurisdiction of the courts in that State or location.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          In order to resolve a complaint regarding the Site or to receive
          further information regarding use of the Site, please contact us at
          support@codepulse-r.com.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
