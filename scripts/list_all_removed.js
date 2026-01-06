const fs = require("fs");
const path = require("path");

const cssDir = path.join(__dirname, "../src/css");
const additionalDirs = [path.join(__dirname, "../src/cssdark")];
const allDirs = [cssDir, ...additionalDirs];

let googleFonts = new Set();
let cdnFonts = new Set();

allDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".css"));

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // Google
    let regex =
      /\/\* Removed blocking import: (https:\/\/fonts\.googleapis\.com\/.*?) \*\//gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      try {
        const url = match[1];
        const urlObj = new URL(url);
        const family = urlObj.searchParams.get("family");
        if (family) googleFonts.add(family);
      } catch (e) {}
    }

    // CDN
    regex =
      /\/\* Removed blocking import: (https:\/\/fonts\.cdnfonts\.com\/.*?) \*\//gi;
    while ((match = regex.exec(content)) !== null) {
      cdnFonts.add(match[1]);
    }
  });
});

const googleUrl = Array.from(googleFonts).join("&family=");
let out = `https://fonts.googleapis.com/css2?family=${googleUrl}&display=swap\n`;
out += Array.from(cdnFonts).join("\n");

fs.writeFileSync(path.join(__dirname, "fonts_out.txt"), out);
console.log("Done writing to fonts_out.txt");
