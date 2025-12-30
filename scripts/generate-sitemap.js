const fs = require("fs");
const path = require("path");

const DOMAIN = "https://codepulse-r.com";

const routes = [
  "/",
  "/teachingclasses",
  "/compiler",
  "/online-compiler",
  "/quiz",
  "/exam",

  // Technologies
  "/java",
  "/python",
  "/javascript",
  "/html",
  "/css",
  "/sql",
  "/microservices",
  "/restapi",
  "/react",
  "/git",
  "/downloads",
  // Teaching Classes
  "/teachingclasses/java",
  "/teachingclasses/python",
  "/teachingclasses/c",
  "/teachingclasses/cpp",
  "/teachingclasses/csharp",
  "/teachingclasses/javascript",
  "/teachingclasses/react",
  "/teachingclasses/sql",
  "/teachingclasses/html",
  "/teachingclasses/css",
  "/teachingclasses/git",
  "/teachingclasses/restapi",
  "/teachingclasses/microservices",

  // Learning Courses
  "/learning/course/HTML",
  "/learning/course/CSS",
  "/learning/course/JavaScript",
  "/learning/course/Java",
  "/learning/course/Python",
  "/learning/course/SQL",

  // Online Compiler
  "/online-compiler/java",
  "/online-compiler/python",
  "/online-compiler/javascript",
  "/online-compiler/c",
  "/online-compiler/cpp",
  "/online-compiler/csharp",
  "/online-compiler/html",
  "/online-compiler/css",
  "/online-compiler/sql",
  "/online-compiler/kotlin",
  "/online-compiler/go",
  "/online-compiler/php",
  "/online-compiler/ruby",
  "/online-compiler/swift",
  "/online-compiler/scala",
  "/online-compiler/rust",
  "/online-compiler/typescript",
  "/online-compiler/dart",
  "/online-compiler/bash",
  "/online-compiler/r",
];

const lowerCaseRoutes = routes.map((route) => route.toLowerCase());

// SEO Configuration
const getPageConfig = (path) => {
  if (path === "/") return { priority: "1.0", freq: "daily" };
  if (path.includes("/online-compiler"))
    return { priority: "0.9", freq: "weekly" };
  if (path.includes("/teachingclasses"))
    return { priority: "0.8", freq: "weekly" };
  if (path.includes("/quiz") || path.includes("/exam"))
    return { priority: "0.6", freq: "monthly" };
  if (path.includes("/learning")) return { priority: "0.8", freq: "weekly" };
  return { priority: "0.7", freq: "daily" };
};

// Function to generate the sitemap content
const generateSitemap = () => {
  const urls = lowerCaseRoutes
    .map((route) => {
      const { priority, freq } = getPageConfig(route);
      return `  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// Write the sitemap to the public directory
const sitemapContent = generateSitemap();
const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");

fs.writeFile(outputPath, sitemapContent, (err) => {
  if (err) {
    console.error("❌ Error generating sitemap:", err);
  } else {
    console.log("✅ Sitemap generated successfully at", outputPath);
  }
});
