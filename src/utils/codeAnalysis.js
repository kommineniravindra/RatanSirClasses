export const checkForInput = (code, language) => {
  if (!code) return false;
  const lang = language.toLowerCase();

  if (lang === "java") {
    const { checkForJavaInput } = require("./javalogic");
    return checkForJavaInput(code);
  }
  if (lang === "python") {
    const { checkForPythonInput } = require("./pythonlogic");
    return checkForPythonInput(code);
  }
  if (lang === "javascript") {
    const { checkForJavascriptInput } = require("./javascriptlogic");
    return checkForJavascriptInput(code);
  }

  // Legacy Checks
  if (lang === "cpp" || lang === "c++") return code.includes("cin >>");
  if (lang === "c") return code.includes("scanf(");

  return false;
};

export const analyzeInputPrompts = (code, language) => {
  if (!code) return [];
  if (language === "java") {
    const { analyzeJavaPrompts } = require("./javalogic");
    return analyzeJavaPrompts(code);
  }
  return [];
};

/**
 * Analyzes the code for presence of specific keywords.
 * @param {string} code - The student's code.
 * @param {Array} expectedKeywords - List of keywords expected in the code.
 * @returns {object} - { foundKeywords: [], missingKeywords: [], score: number }
 */
export const checkKeywords = (code, expectedKeywords = []) => {
  if (!code || !expectedKeywords || expectedKeywords.length === 0) {
    return { foundKeywords: [], missingKeywords: [], score: 100 };
  }

  // Remove comments and string literals to avoid false positives (basic rudimentary stripping)
  const cleanCode = code
    .replace(/\/\/.*$/gm, "") // line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/"[^"]*"/g, '""'); // strings

  const foundKeywords = [];
  const missingKeywords = [];

  expectedKeywords.forEach((keyword) => {
    // Escape regex special characters
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match whole word boundary to avoid partial matches (e.g. "int" matching "print")
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, "i"); // Case-insensitive? Maybe java is case sensitive, but let's be lenient for now or strict? Java is strict.

    // Using strict case for Java keywords usually, but for user ease maybe case insensitive?
    // Let's stick to case-insensitive for robustness unless strictly required.
    if (new RegExp(escapedKeyword).test(cleanCode)) {
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const score = Math.round(
    (foundKeywords.length / expectedKeywords.length) * 100
  );
  return { foundKeywords, missingKeywords, score };
};
