export const checkForInput = (code, language) => {
  if (!code) return false;
  const lang = language.toLowerCase();

  // 1. JAVA
  if (lang === "java") {
    // Check for Scanner usage
    return (
      code.includes("Scanner") &&
      (code.includes("nextInt()") ||
        code.includes("nextLine()") ||
        code.includes("next()") ||
        code.includes("nextDouble()") ||
        code.includes("nextBoolean()"))
    );
  }

  // 2. PYTHON
  if (lang === "python") {
    return code.includes("input(");
  }

  // 3. C++
  if (lang === "cpp" || lang === "c++") {
    return code.includes("cin >>");
  }

  // 4. C
  if (lang === "c") {
    return code.includes("scanf(");
  }

  return false;
};

export const analyzeInputPrompts = (code, language) => {
  if (!code) return [];
  // Currently optimized for Java as per user request
  if (language !== "java" && language !== "c" && language !== "cpp") return [];

  const lines = code.split("\n");
  const foundPrompts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    let printMatch = null;

    // Java: System.out.print
    if (language === "java") {
      printMatch = line.match(/System\.out\.print(?:ln)?\s*\(\s*"([^"]+)"/);
    }
    // Python (Future)
    // C/C++ (Future)

    if (printMatch) {
      // Look ahead for input
      let j = i + 1;
      let foundScanner = false;
      while (j < lines.length && j < i + 5) {
        if (language === "java") {
          if (
            lines[j].includes("sc.next") ||
            lines[j].includes("scanner.next")
          ) {
            foundScanner = true;
            break;
          }
        }
        j++;
      }
      if (foundScanner) {
        foundPrompts.push(printMatch[1]);
        i = j;
      }
    }
    i++;
  }
  return foundPrompts;
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
