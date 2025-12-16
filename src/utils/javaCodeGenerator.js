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

// Helper: Parse fields only at top level of the scope (ignore methods/nested blocks)
const findFieldsInScope = (sourceCode, scope) => {
  const { bodyStartIndex, endIndex } = scope;
  // We only care about the content between { and }
  // Scan carefully again to respect nested braces
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

  // Correct regex for loose field matching (type name [= val];)
  // Matches:  modifiers type name (= val)?;
  // Group 1: type
  // Group 2: name
  const statementRegex =
    /^\s*(?:(?:public|private|protected|static|final|volatile|transient)\s+)*([a-zA-Z0-9_<>\[\]]+)\s+([a-zA-Z0-9_]+)(?:\s*=.*?)?\s*$/;

  // Ignore keywords that look like types
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
        buffer = ""; // Clear buffer on entering block (it was a method sig or something)
      } else if (char === "}") {
        braceLevel--;
        buffer = ""; // Clear buffer on exiting block
      } else if (char === ";") {
        if (braceLevel === 0) {
          // Possible field statement
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
export const generateJavaCode = (currentCode, type) => {
  // 1. Find scopes
  const scopes = findClassScopes(currentCode);

  // 2. Find fields strictly in scope
  let targetScope = null;
  let targetFields = [];

  for (const scope of scopes) {
    const fields = findFieldsInScope(currentCode, scope);
    if (fields.length > 0) {
      targetScope = scope;
      targetFields = fields;
      break; // Pick first class with fields
    }
  }

  // If no fields found, maybe we should default to the FIRST valid class anyway?
  // User might want to generate a constructor for a class with NO fields? (Empty constructor)
  // But usually boilerplate needs fields.
  // Exception: Constructor (can be empty).

  if (!targetScope && scopes.length > 0) {
    // Fallback: Pick the first class if it exists, even if no fields
    targetScope = scopes[0];
  }

  if (!targetScope) {
    return {
      success: false,
      message: "No class found. Define a class first.",
    };
  }

  // If we have a scope but no fields, and user wants getters/setters, warn properly.
  if (
    targetFields.length === 0 &&
    type !== "constructor" &&
    type !== "tostring" &&
    type !== "all"
  ) {
    return {
      success: false,
      message:
        "No fields found in class '" +
        targetScope.className +
        "'. define fields like 'int id;' first.",
    };
  }

  const { className } = targetScope;
  const fields = targetFields;

  let generated = "\n\n";

  // --- Code Generation Strings ---

  // Constructor
  if (type === "all" || type === "constructor") {
    // If no fields, generate empty constructor
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
    if (fields.length === 0)
      return { success: false, message: "Use fields for hashCode/equals." };

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

  // 3. Insert and Import Logic
  let nextCode = currentCode;
  const importsNeeded = new Set();
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

  // Re-run finder (indices might have shifted)
  const newScopes = findClassScopes(nextCode);
  const target = newScopes.find((s) => s.className === className);

  if (target) {
    const finalCode = nextCode.substring(0, target.endIndex) + generated + "}";
    return { success: true, newCode: finalCode };
  }

  // Fallback
  return { success: true, newCode: nextCode + generated };
};
