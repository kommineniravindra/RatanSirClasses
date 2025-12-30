import axios from "axios";

export const runJavascriptCode = async (code, input = "") => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "javascript",
        version: "*",
        files: [{ content: code }],
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
      output: "Error executing JavaScript code.\n" + (error.message || ""),
      error: error.message,
      isError: true,
    };
  }
};

export const checkForJavascriptInput = (code) => {
  if (!code) return false;
  return code.includes("prompt(");
};
