const fs = require("fs");
const path = require("path");

const cssDir = path.join(__dirname, "../src/css");
const additionalDirs = [path.join(__dirname, "../src/cssdark")];
const allDirs = [cssDir, ...additionalDirs];

let googleFonts = new Set();
let families = new Set();

allDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".css"));

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");
    // Match /* Removed blocking import: URL */
    const regex =
      /\/\* Removed blocking import: (https:\/\/fonts\.googleapis\.com\/.*?) \*\//gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      try {
        const url = match[1];
        const urlObj = new URL(url);
        const family = urlObj.searchParams.get("family");
        if (family) {
          families.add(family);
        }
      } catch (e) {}
    }
  });
});

console.log(Array.from(families).join("&family="));
