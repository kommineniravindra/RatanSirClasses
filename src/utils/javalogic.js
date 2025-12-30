import axios from "axios";
import { prepareJavaCodeForExecution } from "./javaCodeGenerator";

export const runJavaCode = async (code, input = "") => {
  try {
    const prepared = prepareJavaCodeForExecution(code);
    const codeToSend = prepared.content;
    // If mainClassName is detected, use it as filename, else default to Main.java
    const fileName = prepared.mainClassName
      ? `${prepared.mainClassName}.java`
      : "Main.java";

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "java",
        version: "*",
        files: [{ content: codeToSend, name: fileName }],
        stdin: input,
      }
    );

    const { run } = response.data;
    return {
      output: run.output,
      error: run.stderr || null,
      isError: !!run.stderr,
    };
  } catch (error) {
    return {
      output: "Error executing Java code.\n" + (error.message || ""),
      error: error.message,
      isError: true,
    };
  }
};

export const checkForJavaInput = (code) => {
  if (!code) return false;
  return (
    (code.includes("Scanner") || code.includes("import java.util.Scanner")) &&
    code.includes("System.in") &&
    (code.includes("next") || code.includes("nextLine"))
  );
};

export const analyzeJavaPrompts = (codeString) => {
  if (!codeString) return [];
  const prompts = [];
  // Basic regex to find string literals in System.out.print/println
  const printRegex = /System\.out\.print(?:ln)?\s*\(\s*"([^"]+)"\s*\)/g;
  let match;
  while ((match = printRegex.exec(codeString)) !== null) {
    prompts.push(match[1]);
  }
  // Heuristic: If Scanning is present
  if (!codeString.includes("Scanner")) return [];
  return prompts;
};
