export const runCssCode = (code) => {
  // Wraps CSS in style tags for standard preview output if raw CSS is passed
  return {
    output: `<style>${code}</style>`,
    isError: false,
  };
};
