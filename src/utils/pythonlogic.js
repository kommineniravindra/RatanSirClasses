import axios from "axios";

export const runPythonCode = async (code, input = "") => {
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "python",
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
      output: "Error executing Python code.\n" + (error.message || ""),
      error: error.message,
      isError: true,
    };
  }
};

export const checkForPythonInput = (code) => {
  if (!code) return false;
  return code.includes("input(");
};
