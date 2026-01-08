import { languageBoilerplates } from "./languageBoilerplates";

// --- Language Configuration ---
export const languageConfig = {
  java: {
    language: "java",
    aceMode: "java",
    type: "piston",
    boilerplate: languageBoilerplates.Java,
  },
  python: {
    language: "python",
    aceMode: "python",
    type: "piston",
    boilerplate: languageBoilerplates.Python,
  },
  javascript: {
    language: "javascript",
    aceMode: "javascript",
    type: "piston",
    boilerplate: languageBoilerplates.JavaScript,
  },
  sql: {
    language: "sql",
    aceMode: "sql",
    type: "piston", 
    boilerplate: languageBoilerplates.SQL,
  },
  html: {
    language: "html",
    aceMode: "html",
    type: "codepad",
    boilerplate: languageBoilerplates.HTML,
  },
  css: {
    language: "css",
    aceMode: "css",
    type: "codepad",
    boilerplate: languageBoilerplates.CSS,
  },
  restapi: {
    language: "java",
    aceMode: "java",
    type: "piston",
    boilerplate: languageBoilerplates.Java,
  },
  react: { language: "javascript", aceMode: "javascript", type: "none" },
  microservices: { language: "plaintext", aceMode: "text", type: "none" },
  default: { language: "plaintext", aceMode: "text", type: "none" },
};

// --- Exam Codes Map ---
export const examCodeMap = {
  "java-exam1": "JAVA101",
  "java-exam2": "JAVA202",
  "python-exam1": "PYTHON101",
  "python-exam2": "PYTHON202",
  "javascript-exam1": "JS101",
  "javascript-exam2": "JS202",
  "react-exam1": "REACT101",
  "react-exam2": "REACT202",
  "html-exam1": "HTML101",
  // "html-exam2": "HTML202",
  "css-exam1": "CSS101",
  "css-exam2": "CSS202",
  "sql-exam1": "SQL101",
  "sql-exam2": "SQL202",
  "microservices-exam1": "MS101",
  "microservices-exam2": "MS202",
  "restapi-exam1": "REST101",
  "restapi-exam2": "REST202",
};

// --- Exam Configuration (Counts & Marks) ---
const DEFAULT_EXAM_CONFIG = {
  mcqCount: 50,
  blankCount: 50,
  codingCount: 5,
  pseudoCount: 15,
  mcqMarks: 1,
  blankMarks: 1,
  codingMarks: 10,
  pseudoMarks: 1,
};

const EXAM_CONFIGS = {
  default: DEFAULT_EXAM_CONFIG,
  // Add technology specific overrides here
  // example: java: { ...DEFAULT_EXAM_CONFIG, codingCount: 5 }
};

const SECTION_CONFIGS = {
  // Define overrides here using Exam Code (e.g., JAVA101)
  // "JAVA101": { mcqCount: 20, blankCount: 0, codingCount: 2, pseudoCount: 5 },
};

export const getExamConfig = (technology, examId) => {
  const specificKey = `${technology}-${examId}`;
  const examCode = examCodeMap[specificKey];

  if (examCode && SECTION_CONFIGS[examCode]) {
    return { ...DEFAULT_EXAM_CONFIG, ...SECTION_CONFIGS[examCode] };
  }

  // Fallback to technology-specific or default
  return EXAM_CONFIGS[technology] || EXAM_CONFIGS.default;
};

// --- Exam Duration ---
const EXAM_DURATIONS = {
  default: 150, // Minutes
  "java-exam1": 150,
  "sql-exam1": 150,
};

export const getExamDuration = (technology, examId) => {
  const specificKey = `${technology}-${examId}`;
  return (
    (EXAM_DURATIONS[specificKey] ||
      EXAM_DURATIONS[technology] ||
      EXAM_DURATIONS.default) * 60
  ); // Returns seconds
};
