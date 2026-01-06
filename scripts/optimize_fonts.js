const fs = require("fs");
const path = require("path");

const cssDir = path.join(__dirname, "../src/css");
const additionalDirs = [path.join(__dirname, "../src/cssdark")]; // check cssdark too
const allDirs = [cssDir, ...additionalDirs];

let googleFonts = new Set();
let cdnFonts = new Set();

allDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".css"));

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, "utf8");
    let initialContent = content;

    // Regex for Google Fonts
    const googleRegex =
      /@import\s+url\(['"](https:\/\/fonts\.googleapis\.com\/.*?)['"]\);?/gi;
    content = content.replace(googleRegex, (match, url) => {
      console.log(`Found Google Font in ${file}: ${url}`);
      try {
        const urlObj = new URL(url);
        const family = urlObj.searchParams.get("family");
        if (family) googleFonts.add(family);
      } catch (e) {
        console.error("Error parsing URL:", url);
      }
      return `/* Removed blocking import: ${url} */`;
    });

    // Regex for CDN Fonts
    const cdnRegex =
      /@import\s+url\(['"](https:\/\/fonts\.cdnfonts\.com\/.*?)['"]\);?/gi;
    content = content.replace(cdnRegex, (match, url) => {
      console.log(`Found CDN Font in ${file}: ${url}`);
      cdnFonts.add(url);
      return `/* Removed blocking import: ${url} */`;
    });

    if (content !== initialContent) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated ${file}`);
    }
  });
});

console.log("\n--- CONSOLIDATED GOOGLE FONTS ---");
const families = Array.from(googleFonts).join("&family=");
// Note: Some families might have specific weights in the string like "Roboto:wght@400;700"
// The API supports multiple family params: family=A&family=B
const finalUrl = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
console.log(`<link href="${finalUrl}" rel="stylesheet">`);

console.log("\n--- CDN FONTS (Check manually if needed) ---");
Array.from(cdnFonts).forEach((f) =>
  console.log(`<link href="${f}" rel="stylesheet">`)
);
