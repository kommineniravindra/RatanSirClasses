const findClassScopes = (sourceCode) => {
  const Token = {
    CODE: 0,
    STRING: 1,
    COMMENT_SINGLE: 2,
    COMMENT_MULTI: 3,
  };

  const resultScopes = [];
  let state = Token.CODE;
  let braceLevel = 0;

  let pendingClass = null; // { className, startIndex, braceLevelAtDef }
  const activeClasses = []; // Stack of { ... }

  let i = 0;
  while (i < sourceCode.length) {
    const char = sourceCode[i];
    const nextChar = sourceCode[i + 1];

    if (state === Token.CODE) {
      if (char === '"') state = Token.STRING;
      else if (char === "/" && nextChar === "/") {
        state = Token.COMMENT_SINGLE;
        i++;
      } else if (char === "/" && nextChar === "*") {
        state = Token.COMMENT_MULTI;
        i++;
      } else if (char === "{") {
        if (pendingClass) {
          activeClasses.push({
            ...pendingClass,
            bodyStartIndex: i + 1, // Start *after* the opening brace
          });
          pendingClass = null;
        } else {
          // If we encounter a { that isn't for a class we are tracking, we just track the loop/if scope implicitly via braceLevel
          // But if we are IN a class, we need to know this { starts a nesting
        }
        braceLevel++;
      } else if (char === "}") {
        braceLevel--;
        if (activeClasses.length > 0) {
          const top = activeClasses[activeClasses.length - 1];
          if (braceLevel === top.braceLevelAtDef) {
            // Class closed
            resultScopes.push({
              className: top.className,
              startIndex: top.startIndex,
              bodyStartIndex: top.bodyStartIndex,
              endIndex: i,
              content: sourceCode.substring(top.startIndex, i + 1), // Full class code
            });
            activeClasses.pop();
          }
        }
      } else if (char === "c") {
        // Detect "class Name"
        if (
          sourceCode.slice(i, i + 6) === "class " &&
          (i === 0 || /[\s}]/.test(sourceCode[i - 1]))
        ) {
          const remainder = sourceCode.slice(i + 6);
          const nameMatch = remainder.match(/^\s*(\w+)/);
          if (nameMatch) {
            pendingClass = {
              className: nameMatch[1],
              startIndex: i,
              braceLevelAtDef: braceLevel,
            };
            i += 5; // Skip "class"
          }
        }
      }
    } else if (state === Token.STRING) {
      if (char === '"' && sourceCode[i - 1] !== "\\") state = Token.CODE;
    } else if (state === Token.COMMENT_SINGLE) {
      if (char === "\n") state = Token.CODE;
    } else if (state === Token.COMMENT_MULTI) {
      if (char === "*" && nextChar === "/") {
        state = Token.CODE;
        i++;
      }
    }
    i++;
  }
  return resultScopes;
};

const findFieldsInScope = (sourceCode, scope) => {
  const { bodyStartIndex, endIndex } = scope;

  const Token = {
    CODE: 0,
    STRING: 1,
    COMMENT_SINGLE: 2,
    COMMENT_MULTI: 3,
  };

  let state = Token.CODE;
  let braceLevel = 0; // Relative to the class body. 0 = class scope. >0 = method/nested scope.
  let buffer = "";
  const fields = [];

  const statementRegex =
    /^\s*(?:(?:public|private|protected|static|final|volatile|transient)\s+)*([a-zA-Z0-9_<>\[\]]+)\s+([a-zA-Z0-9_]+)(?:\s*=.*?)?\s*$/;

  const keywords = new Set([
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "throw",
    "throws",
    "synchronized",
    "class",
    "interface",
    "enum",
    "void",
  ]);

  for (let i = bodyStartIndex; i < endIndex; i++) {
    const char = sourceCode[i];
    const nextChar = sourceCode[i + 1] || "";

    if (state === Token.CODE) {
      if (char === '"') state = Token.STRING;
      else if (char === "'" && nextChar !== "'") {
      } else if (char === "/" && nextChar === "/") {
        state = Token.COMMENT_SINGLE;
        i++;
      } else if (char === "/" && nextChar === "*") {
        state = Token.COMMENT_MULTI;
        i++;
      } else if (char === "{") {
        braceLevel++;
        buffer = "";
      } else if (char === "}") {
        braceLevel--;
        buffer = "";
      } else if (char === ";") {
        if (braceLevel === 0) {
          const trimmed = buffer.trim();
          const match = trimmed.match(statementRegex);
          if (match) {
            const type = match[1];
            const name = match[2];
            if (!keywords.has(type)) {
              fields.push({ type, name });
            }
          }
        }
        buffer = "";
      } else {
        if (braceLevel === 0) {
          buffer += char;
        }
      }
    } else if (state === Token.STRING) {
      if (char === '"' && sourceCode[i - 1] !== "\\") state = Token.CODE;
    } else if (state === Token.COMMENT_SINGLE) {
      if (char === "\n") state = Token.CODE;
    } else if (state === Token.COMMENT_MULTI) {
      if (char === "*" && nextChar === "/") {
        state = Token.CODE;
        i++;
      }
    }
  }
  return fields;
};

/**
 * Generates Java boilerplate code based on existing fields in the class.
 * @param {string} currentCode - The current source code.
 * @param {string} type - The type of code to generate (all, constructor, getters, etc.).
 * @returns {object} { success: boolean, newCode: string, message: string }
 */
export const generateJavaCode = (currentCode, type, cursorIndex = -1) => {
  let scopes = findClassScopes(currentCode);
  let targets = [];

  if (cursorIndex !== -1) {
    const cursorTarget = scopes.find(
      (s) => cursorIndex >= s.startIndex && cursorIndex <= s.endIndex
    );
    if (cursorTarget) {
      targets.push(cursorTarget);
    }
  }

  if (targets.length === 0) {
    targets = scopes;
  }

  if (targets.length === 0) {
    return { success: false, message: "No class found. Define a class first." };
  }

  const importsNeeded = new Set();
  const updates = [];

  for (const scope of targets) {
    const fields = findFieldsInScope(currentCode, scope);

    if (
      fields.length === 0 &&
      type !== "constructor" &&
      type !== "tostring" &&
      type !== "all"
    ) {
      continue;
    }

    // Collect imports
    fields.forEach((f) => {
      if (f.type.startsWith("List") || f.type.startsWith("ArrayList")) {
        importsNeeded.add("import java.util.List;");
        importsNeeded.add("import java.util.ArrayList;");
      }
      if (f.type.startsWith("Map") || f.type.startsWith("HashMap")) {
        importsNeeded.add("import java.util.Map;");
        importsNeeded.add("import java.util.HashMap;");
      }
      if (f.type.startsWith("Set") || f.type.startsWith("HashSet")) {
        importsNeeded.add("import java.util.Set;");
        importsNeeded.add("import java.util.HashSet;");
      }
      if (f.type === "Date") importsNeeded.add("import java.util.Date;");
      if (f.type === "UUID") importsNeeded.add("import java.util.UUID;");
    });

    // Generate Snippet
    const { className } = scope;
    let generated = "\n\n";

    // Constructor
    if (type === "all" || type === "constructor") {
      if (fields.length === 0) {
        generated += `  public ${className}() {\n  }\n\n`;
      } else {
        const params = fields.map((f) => `${f.type} ${f.name}`).join(", ");
        const body = fields
          .map((f) => `    this.${f.name} = ${f.name};`)
          .join("\n");
        generated += `  public ${className}(${params}) {\n${body}\n  }\n\n`;
      }
    }

    // Getters
    if (type === "all" || type === "getters") {
      fields.forEach((f) => {
        const capName = f.name.charAt(0).toUpperCase() + f.name.slice(1);
        generated += `  public ${f.type} get${capName}() {\n    return ${f.name};\n  }\n`;
      });
    }

    // Setters
    if (type === "all" || type === "setters") {
      fields.forEach((f) => {
        const capName = f.name.charAt(0).toUpperCase() + f.name.slice(1);
        generated += `  public void set${capName}(${f.type} ${f.name}) {\n    this.${f.name} = ${f.name};\n  }\n\n`;
      });
    }

    // toString
    if (type === "all" || type === "tostring") {
      if (fields.length === 0) {
        generated += `  @Override\n  public String toString() {\n    return "${className} []";\n  }\n\n`;
      } else {
        const fieldStr = fields
          .map((f) => `"${f.name}=" + ${f.name}`)
          .join(' + ", " + ');
        generated += `  @Override\n  public String toString() {\n    return "${
          className ? className + " [" : "Object ["
        }" + ${fieldStr} + "]";\n  }\n\n`;
      }
    }

    // HashCode & Equals
    if (type === "all" || type === "hashcode-equals") {
      if (fields.length > 0) {
        generated += `  @Override\n  public int hashCode() {\n`;
        generated += `    return java.util.Objects.hash(${fields
          .map((f) => f.name)
          .join(", ")});\n`;
        generated += `  }\n\n`;

        generated += `  @Override\n  public boolean equals(Object obj) {\n`;
        generated += `    if (this == obj) return true;\n`;
        generated += `    if (obj == null || getClass() != obj.getClass()) return false;\n`;
        generated += `    ${className} other = (${className}) obj;\n`;

        const checks = fields
          .map((f) => {
            if (
              [
                "int",
                "long",
                "double",
                "float",
                "boolean",
                "char",
                "byte",
                "short",
              ].includes(f.type)
            ) {
              return `    if (${f.name} != other.${f.name}) return false;`;
            } else {
              return `    if (!java.util.Objects.equals(${f.name}, other.${f.name})) return false;`;
            }
          })
          .join("\n");
        generated += checks + "\n";
        generated += `    return true;\n  }\n\n`;
      }
    }

    updates.push({ className, snippet: generated, oldScope: scope });
  }

  if (updates.length === 0) {
    if (targets.length === 1 && targets[0] === scopes[0]) {
      return { success: false, message: "No suitable fields found." };
    }
    return { success: false, message: "Nothing to generate." };
  }

  let nextCode = currentCode;
  if (importsNeeded.size > 0) {
    const newImports = [];
    importsNeeded.forEach((imp) => {
      if (!nextCode.includes(imp.trim())) {
        newImports.push(imp);
      }
    });
    if (newImports.length > 0) {
      nextCode = newImports.join("\n") + "\n" + nextCode;
    }
  }

  const finalScopes = findClassScopes(nextCode);
  const updatesToApply = [];
  for (const update of updates) {
    const scope = finalScopes.find((s) => s.className === update.className);
    if (scope) {
      updatesToApply.push({ scope, snippet: update.snippet });
    }
  }

  updatesToApply.sort((a, b) => b.scope.endIndex - a.scope.endIndex);

  let finalCode = nextCode;
  for (const item of updatesToApply) {
    const { scope, snippet } = item;
    const contentBefore = finalCode.substring(0, scope.endIndex);
    const contentAfter = finalCode.substring(scope.endIndex);
    finalCode = contentBefore + snippet + contentAfter;
  }

  return { success: true, newCode: finalCode };
};

export const prepareJavaCodeForExecution = (code) => {
  // 1. Strip Package Declarations
  let cleanedCode = code.replace(/^\s*package\s+[\w.]+;\s*$/gm, "");

  // 1b. Check for duplicates imports or extract them
  const importRegex = /^\s*import\s+[\w\s.*]+;\s*$/gm;
  const imports = [];
  let match;
  while ((match = importRegex.exec(cleanedCode)) !== null) {
    if (!imports.includes(match[0])) {
      imports.push(match[0]);
    }
  }

  // Remove imports from code to avoid duplication/misplacement during reorder
  let codeWithoutImports = cleanedCode.replace(importRegex, "").trim();

  // 2. Perform Class Reordering (Logic to put Main class first)
  const scopes = findClassScopes(codeWithoutImports);

  // Find Main Class (Entry Point)
  let mainClass = scopes.find((scope) => {
    const body = scope.content;
    // Support regex for "public static void main" or "static public void main"
    // And standard args variants
    return /(?:public\s+static|static\s+public)\s+void\s+main\s*\(\s*String\s*(?:\[\s*\]|\.\.\.)\s*\w+\s*\)/.test(
      body
    );
  });

  // Fallback 1: If no main method, try to find a public class to name the file
  if (!mainClass) {
    mainClass = scopes.find((scope) => {
      // Check modifiers before class definition
      const prefix = codeWithoutImports.substring(0, scope.startIndex);
      return /public\s+$/.test(prefix.trimEnd());
    });
  }

  // Fallback 2: First class
  if (!mainClass && scopes.length > 0) {
    mainClass = scopes[0];
  }

  let finalReorderedCode = codeWithoutImports;
  let mainClassName = null;

  if (mainClass) {
    mainClassName = mainClass.className;

    // We categorize parts: Main Class, and Others.
    let mainClassCode = "";

    // Extract Main Class Code
    let start = mainClass.startIndex;
    const prefix = codeWithoutImports.substring(0, start);
    const modMatch = prefix.match(/((?:public|final|abstract|strictfp)\s+)*$/);
    if (modMatch && modMatch[0]) {
      start -= modMatch[0].length;
    }
    mainClassCode = codeWithoutImports.substring(start, mainClass.endIndex + 1);

    // Ensure Main Class is Public (good practice for Piston main file)
    if (!mainClassCode.trim().startsWith("public")) {
      mainClassCode = "public " + mainClassCode;
    }

    // Helper to strip public from class defs
    const stripPublic = (str) => str.replace(/public\s+class\s/g, "class ");

    if (scopes[0] !== mainClass) {
      // We calculate before/after based on ORIGINAL indices

      let originalStart = mainClass.startIndex;
      const p = codeWithoutImports.substring(0, originalStart);
      const m = p.match(/((?:public|final|abstract|strictfp)\s+)*$/);
      if (m && m[0]) originalStart -= m[0].length;

      const beforeMain = codeWithoutImports.substring(0, originalStart);
      const afterMain = codeWithoutImports.substring(mainClass.endIndex + 1);

      finalReorderedCode =
        mainClassCode +
        "\n\n" +
        stripPublic(beforeMain) +
        stripPublic(afterMain);
    } else {
      // Main class is already at top.
      // We still need to strip public from SUBSEQUENT classes.
      // The main class ends at mainClass.endIndex.
      const firstPart = codeWithoutImports.substring(0, mainClass.endIndex + 1);
      const rest = codeWithoutImports.substring(mainClass.endIndex + 1);
      finalReorderedCode = firstPart + stripPublic(rest);
    }
  }

  // 3. Re-inject Imports
  const importsStr = imports.join("\n");
  const finalContent = importsStr + "\n\n" + finalReorderedCode;

  return {
    content: finalContent,
    mainClassName: mainClassName,
  };
};
