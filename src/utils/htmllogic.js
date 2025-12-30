export const runHtmlCode = (code) => {
  // HTML is typically rendered directly, so this might return the code 'as is'
  // or wrap it in a structure if needed for preview.
  return {
    output: code,
    isError: false,
  };
};
