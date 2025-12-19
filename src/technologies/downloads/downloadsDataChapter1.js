import React from "react";
import { FaDownload, FaGlobe } from "react-icons/fa";

const DownloadCard = ({ title, websiteUrl, downloadUrl, iconUrl }) => {
  return (
    <div className="download-card">
      <div className="download-card-left">
        {iconUrl && <img src={iconUrl} alt={title} className="download-icon" />}
        <h4 className="download-title">{title}</h4>
      </div>
      <div className="download-actions">
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-btn website-btn"
          >
            <FaGlobe /> Website
          </a>
        )}
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-btn download-btn"
          >
            <FaDownload /> Download
          </a>
        )}
      </div>
    </div>
  );
};

export const downloadsDataChapter1 = {
  // ----- Development Tools -----
  "Visual Studio Code": (
    <DownloadCard
      title="Visual Studio Code (VS Code)"
      websiteUrl="https://code.visualstudio.com/"
      downloadUrl="https://code.visualstudio.com/download"
      iconUrl="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg"
    />
  ),
  Postman: (
    <DownloadCard
      title="Postman API Platform"
      websiteUrl="https://www.postman.com/"
      downloadUrl="https://www.postman.com/downloads/"
      iconUrl="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"
    />
  ),
  "Eclipse IDE": (
    <DownloadCard
      title="Eclipse IDE for Java Developers"
      websiteUrl="https://www.eclipse.org/"
      downloadUrl="https://www.eclipse.org/downloads/"
      iconUrl="https://www.vectorlogo.zone/logos/eclipse/eclipse-icon.svg"
    />
  ),
  "Spring Tool Suite (STS)": (
    <DownloadCard
      title="Spring Tool Suite 4"
      websiteUrl="https://spring.io/tools"
      downloadUrl="https://spring.io/tools"
      iconUrl="https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg"
    />
  ),
  "IntelliJ IDEA": (
    <DownloadCard
      title="IntelliJ IDEA Community"
      websiteUrl="https://www.jetbrains.com/idea/"
      downloadUrl="https://www.jetbrains.com/idea/download/"
      iconUrl="https://upload.wikimedia.org/wikipedia/commons/9/9c/IntelliJ_IDEA_Icon.svg"
    />
  ),
  "Git SCM": (
    <DownloadCard
      title="Git Version Control"
      websiteUrl="https://git-scm.com/"
      downloadUrl="https://git-scm.com/downloads"
      iconUrl="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg"
    />
  ),
  "Java JDK": (
    <DownloadCard
      title="Oracle Java JDK"
      websiteUrl="https://www.oracle.com/java/"
      downloadUrl="https://www.oracle.com/java/technologies/downloads/"
      iconUrl="https://www.vectorlogo.zone/logos/java/java-icon.svg"
    />
  ),
  Python: (
    <DownloadCard
      title="Python Programming Language"
      websiteUrl="https://www.python.org/"
      downloadUrl="https://www.python.org/downloads/"
      iconUrl="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
    />
  ),
  PyCharm: (
    <DownloadCard
      title="PyCharm IDE"
      websiteUrl="https://www.jetbrains.com/pycharm/"
      downloadUrl="https://www.jetbrains.com/pycharm/download/"
      iconUrl="https://upload.wikimedia.org/wikipedia/commons/1/1d/PyCharm_Icon.svg"
    />
  ),
  Anaconda: (
    <DownloadCard
      title="Anaconda Distribution"
      websiteUrl="https://www.anaconda.com/"
      downloadUrl="https://www.anaconda.com/download"
      iconUrl="https://upload.wikimedia.org/wikipedia/en/c/cd/Anaconda_Logo.png"
    />
  ),
  "Node.js": (
    <DownloadCard
      title="Node.js Runtime"
      websiteUrl="https://nodejs.org/"
      downloadUrl="https://nodejs.org/en/download/"
      iconUrl="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg"
    />
  ),
  Docker: (
    <DownloadCard
      title="Docker Desktop"
      websiteUrl="https://www.docker.com/"
      downloadUrl="https://docs.docker.com/get-docker/"
      iconUrl="https://www.vectorlogo.zone/logos/docker/docker-icon.svg"
    />
  ),
  "MongoDB Compass": (
    <DownloadCard
      title="MongoDB Compass GUI"
      websiteUrl="https://www.mongodb.com/products/tools/compass"
      downloadUrl="https://www.mongodb.com/try/download/compass"
      iconUrl="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg"
    />
  ),

  "Stack Overflow": (
    <DownloadCard
      title="Stack Overflow Q&A"
      websiteUrl="https://stackoverflow.com/"
      iconUrl="https://www.vectorlogo.zone/logos/stackoverflow/stackoverflow-icon.svg"
    />
  ),
  GitHub: (
    <DownloadCard
      title="GitHub Repositories"
      websiteUrl="https://github.com/"
      iconUrl="https://www.vectorlogo.zone/logos/github/github-icon.svg"
    />
  ),
  GitLab: (
    <DownloadCard
      title="GitLab DevOps Platform"
      websiteUrl="https://about.gitlab.com/"
      iconUrl="https://www.vectorlogo.zone/logos/gitlab/gitlab-icon.svg"
    />
  ),
  Heroku: (
    <DownloadCard
      title="Heroku Cloud Platform"
      websiteUrl="https://www.heroku.com/"
      iconUrl="https://www.vectorlogo.zone/logos/heroku/heroku-icon.svg"
    />
  ),
  Vercel: (
    <DownloadCard
      title="Vercel (Frontend Deployment)"
      websiteUrl="https://vercel.com/"
      iconUrl="https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg"
    />
  ),
  Netlify: (
    <DownloadCard
      title="Netlify (Web Hosting)"
      websiteUrl="https://www.netlify.com/"
      iconUrl="https://www.vectorlogo.zone/logos/netlify/netlify-icon.svg"
    />
  ),
  Render: (
    <DownloadCard
      title="Render Cloud Hosting"
      websiteUrl="https://render.com/"
      iconUrl="https://asset.brandfetch.io/id2alv_1u-/idD6fPZ-vS.svg"
    />
  ),
};
