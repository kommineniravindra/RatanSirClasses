import React, { useState, useEffect, useMemo } from "react";
import {FaHome,FaChartLine,FaUserCircle,FaBook,FaBars,FaDatabase,FaCss3Alt,FaJava,FaJs,FaPython,FaTasks,FaCommentDots,FaSignOutAlt,FaCheck,FaHtml5,} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import "../css/StartLearning.css";
import Feedback from "./Feedback";
import Certificates from "./Certificates";
import Progress from "./Progress";
import AceEditor from "react-ace";
import ace from "ace-builds";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";

import "ace-builds/src-noconflict/ext-language_tools";
ace.config.set("basePath","https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");
ace.config.set("workerPath","https://cdn.jsdelivr.net/npm/ace-builds@1.35.0/src-noconflict/");

// ----------------- Config & Helpers -----------------
const ExamConfig = { codingMarks: 10 };
const calculatePartialMarks = (expectedOutput, userOutput, maxMarks) => {
  const normalize = (text) => text.toLowerCase().match(/\b\w+\b/g) || [];
  const expectedTokens = normalize(expectedOutput);
  const userTokens = normalize(userOutput);

  if (expectedTokens.length === 0) return 0;

  let matchedTokens = 0;
  const usedIndices = new Set();

  for (const expToken of expectedTokens) {
    for (let j = 0; j < userTokens.length; j++) {
      if (!usedIndices.has(j) && expToken === userTokens[j]) {
        matchedTokens++;
        usedIndices.add(j);
        break;
      }
    }
  }

  const matchPercentage = matchedTokens / expectedTokens.length;
  return Math.floor(maxMarks * matchPercentage);
};

const normalizeWhitespace = (s) => (s || "").replace(/\s+/g, " ").trim();

const evaluateOutputs = (expectedRaw, actualRaw, maxMarks) => {
  const expected =
    expectedRaw === undefined || expectedRaw === null
      ? ""
      : String(expectedRaw);
  const actual =
    actualRaw === undefined || actualRaw === null ? "" : String(actualRaw);

  if (!actual.trim()) {
    return { score: 0, reason: "No output produced (empty or error)." };
  }

  if (actual === expected) {
    return { score: maxMarks, reason: "Exact match." };
  }

  if (normalizeWhitespace(actual) === normalizeWhitespace(expected)) {
    return { score: Math.round(maxMarks * 0.9), reason: "Whitespace match." };
  }

  if (actual.toLowerCase() === expected.toLowerCase()) {
    return {
      score: Math.round(maxMarks * 0.8),
      reason: "Case-insensitive match.",
    };
  }

  const maybeNum = (s) => {
    const n = Number(String(s).trim());
    return Number.isFinite(n) ? n : null;
  };
  const expectedNum = maybeNum(expected);
  const actualNum = maybeNum(actual);
  if (expectedNum !== null && actualNum !== null) {
    const diff = Math.abs(expectedNum - actualNum);
    const rel = expectedNum === 0 ? diff : Math.abs(diff / expectedNum);
    const tolerance = 1e-6;
    if (rel <= tolerance) {
      return { score: maxMarks, reason: "Numeric match within tolerance." };
    }
    if (rel <= 0.01) {
      return {
        score: Math.round(maxMarks * 0.8),
        reason: `Numeric close (rel ${rel}).`,
      };
    }
    if (rel <= 0.1) {
      return {
        score: Math.round(maxMarks * 0.6),
        reason: `Numeric partial (rel ${rel}).`,
      };
    }
  }

  const partial = calculatePartialMarks(expected, actual, maxMarks);
  if (partial > 0) {
    return {
      score: partial,
      reason: `Partial token match (${partial}/${maxMarks}).`,
    };
  }

  return { score: 0, reason: "No meaningful match." };
};

const createPreviewContent = (code, language) => {
  if (language === "html") {
    return code;
  }
  if (language === "css") {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${code}</style></head><body><h1>CSS Preview</h1><p>This text is styled by your CSS.</p></body></html>`;
  }
  return "";
};

// ----------------- Quiz contexts (bundled JSON files) -----------------
const quizContexts = {
  html: require.context("../quiz/html", false, /CodingChapter\d+\.json$/),
  css: require.context("../quiz/css", false, /CodingChapter\d+\.json$/),
  javascript: require.context("../quiz/javascript", false, /CodingChapter\d+\.json$/),
  java: require.context("../quiz/java", false, /CodingChapter\d+\.json$/),
  python: require.context("../quiz/python", false, /CodingChapter\d+\.json$/),
  sql: require.context("../quiz/sql", false, /CodingChapter\d+\.json$/),
};

const getChapterInfo = (context) => {
  const keys = context.keys()
                      .filter((key) => key.match(/CodingChapter\d+\.json$/));
  const chapterKeys = keys
                      .map((key) => Number(key.match(/CodingChapter(\d+)\.json$/)[1]))
                      .sort((a, b) => a - b);
  const chapters = chapterKeys.map((keyNum) => {
    try {
      const data = context(`./CodingChapter${keyNum}.json`);
      return {
        num: keyNum,
        title: data[0]?.chapterTitle || `Chapter ${keyNum}`,
      };
    } catch {
      return { num: keyNum, title: `Chapter ${keyNum}` };
    }
  });
  return { count: keys.length, keys, chapterKeys, chapters };
};

const chapterInfoByLang = {};
Object.entries(quizContexts).forEach(([lang, ctx]) => {
  chapterInfoByLang[lang] = getChapterInfo(ctx);
});

// Judge0 config
const JUDGE0_API = "https://ce.judge0.com";
const JUDGE0_LANG_IDS = { javascript: 63, java: 62, python: 71, sql: 82, };
const CODEPAD_LANGS = ["html", "css"];

// Ace mode mapping
const getAceMode = (course) => {
  const lang = (course || "").toLowerCase();
  switch (lang) {
    case "html":
      return "html";
    case "css":
      return "css";
    case "javascript":
      return "javascript";
    case "java":
      return "java";
    case "python":
      return "python";
    case "sql":
      return "sql";
    default:
      return "text";
  }
};

const languageBoilerplates = {
  HTML: `<!DOCTYPE html>\n<html>\n<head>\n<title>Welcome</title>\n</head>\n<body>\n\n\n</body>\n</html>`,
  CSS: `body {\nfont-family: Arial, sans-serif;\ncolor: #333;\n}\n\n.container {\npadding: 20px;\nborder: 1px solid #ccc;\n}`,
  JavaScript: `function solveProblem() {\n// Write your code here\nconsole.log("Hello from JavaScript!");\n}\n\nsolveProblem();`,
  Java: `public class Main {\npublic static void main(String[] args) {\n// Write your Java code here\nSystem.out.println("Hello from Java!");\n}\n}`,
  Python: `def solve_problem():\n# Write your Python code here\nprint("Hello from Python!")\n\nif __name__ == "__main__":\nsolve_problem()`,
  SQL: `-- Write your SQL query here\nSELECT 'SQL Query Ready';`,
};

// ----------------- Component -----------------
function StartLearning() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null); 
  const [selectedExample, setSelectedExample] = useState(null);
  const [questionData, setQuestionData] = useState(null);

  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const [courseContests, setCourseContests] = useState({});
  const [chapterExampleCounts, setChapterExampleCounts] = useState({});
  const [currentChapterData, setCurrentChapterData] = useState([]);

  const [userProfile, setUserProfile] = useState({ studentName: "Student", _id: null, email: null, mobile: null, college: null, qualification: null, passingYear: null, cgpa: null, });
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const allCourseMaxMarks = useMemo(() => {
    const maxMarksMap = {};
    Object.entries(chapterInfoByLang).forEach(([lang, info]) => {
      let totalExamples = 0;
      const context = quizContexts[lang];
      info.chapterKeys.forEach((chapterNum) => {
        try {
          const key = `./CodingChapter${chapterNum}.json`;
          const data = context(key);
          totalExamples += Array.isArray(data) ? data.length : 0;
        } catch (e) {
        }
      });
      maxMarksMap[lang] = totalExamples * ExamConfig.codingMarks;
    });
    return maxMarksMap;
  }, []);

  // ----------------- Fetch profile -----------------
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserProfile((prev) => ({  ...prev, studentName: "Guest", _id: null, }));
        return;
      }

      if (userProfile._id && activeSection !== "Profile") return;

      setIsProfileLoading(true);
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const profileResponse = await axios.get(
          "/api/auth/profile",
          authHeaders
        );
        const profileData =
          profileResponse.data.user || profileResponse.data || {};
        setUserProfile((prev) => ({
          ...prev,
          ...profileData,
          studentName: profileData.studentName || "User",
          _id: profileData._id || null,
        }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
          }).then(() => {
            handleLogout(false);
          });
        }
        setUserProfile((prev) => ({
          ...prev,
          studentName: "Guest",
          _id: null,
        }));
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, [activeSection]);

  // ----------------- Load counts and scores -----------------
  useEffect(() => {
    if (selectedCourse) {
      if (userProfile?._id) {
        fetchCourseTotal(userProfile._id, selectedCourse, true);
      }
      fetchChapterExampleCounts(selectedCourse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, userProfile?._id]);

  // Load descriptions when the selected chapter changes
  useEffect(() => {
    if (selectedCourse && expandedChapter) {
      try {
        const key = `./CodingChapter${expandedChapter}.json`;
        const context = quizContexts[selectedCourse.toLowerCase()];
        const data = context(key);
        setCurrentChapterData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading chapter data:", err);
        setCurrentChapterData([]);
      }
    } else {
      setCurrentChapterData([]); 
    }
  }, [selectedCourse, expandedChapter]);

  const fetchChapterExampleCounts = (course) => {
    const lang = (course || "").toLowerCase();
    const info = chapterInfoByLang[lang];
    const counts = {};
    if (!info) return setChapterExampleCounts({});
    info.chapterKeys.forEach((chapterNum) => {
      try {
        const key = `./CodingChapter${chapterNum}.json`;
        const context = quizContexts[lang];
        const data = context(key);
        counts[chapterNum] = Array.isArray(data) ? data.length : 0;
      } catch (err) {
        console.warn(
          `Could not load questions for ${course} Chapter ${chapterNum}:`,
          err
        );
        counts[chapterNum] = 0;
      }
    });
    setChapterExampleCounts(counts);
  };

  // ----------------- Sequential learning helpers -----------------
  const isExampleCompleted = (chapter, example) => {
    const key = `ch${chapter}-ex${example}`;
    const contest = courseContests[key];
    return (contest?.marks || 0) >= ExamConfig.codingMarks;
  };

  const isChapterCompleted = (chapterNum, totalExamplesInChapter) => {
    if (totalExamplesInChapter === 0) return false;
    const numToTest =
      totalExamplesInChapter || chapterExampleCounts[chapterNum] || 0;
    if (numToTest === 0) return false;

    for (let i = 1; i <= numToTest; i++) {
      if (!isExampleCompleted(chapterNum, i)) return false;
    }
    return true;
  };

  const isChapterUnlocked = (chapterNum, info) => {
    if (
      !info ||
      !Array.isArray(info.chapterKeys) ||
      info.chapterKeys.length === 0
    )
      return false;
    if (chapterNum === info.chapterKeys[0]) return true;
    const currentIndex = info.chapterKeys.indexOf(chapterNum);
    if (currentIndex <= 0) return false;
    const previousChapterNum = info.chapterKeys[currentIndex - 1];
    const totalExamplesInPreviousChapter =
      chapterExampleCounts[previousChapterNum] || 0;
    return isChapterCompleted(
      previousChapterNum,
      totalExamplesInPreviousChapter
    );
  };

  const isExampleUnlocked = (chapterNum, exampleNum) => {
    if (exampleNum === 1) return true;
    const previousExampleNum = exampleNum - 1;
    return isExampleCompleted(chapterNum, previousExampleNum);
  };

  // ----------------- Logout -----------------
  const handleLogout = (showConfirmation = true) => {
    const performLogout = () => {
      localStorage.removeItem("token");
      setUserProfile({
        studentName: "Student",
        _id: null,
        email: null,
        mobile: null,
        college: null,
        qualification: null,
        passingYear: null,
        cgpa: null,
      });
      window.location.reload();
    };

    if (showConfirmation) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your session.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Logout",
      }).then((result) => {
        if (result.isConfirmed) performLogout();
      });
    } else {
      performLogout();
    }
  };

  // ----------------- Static UI data -----------------
 const courses = [{ id: 1, title: "HTML", icon: <FaHtml5 />, color: "#e44c26ff", description: "Structure the web with HTML tags." },
                  { id: 2, title: "CSS", icon: <FaCss3Alt />, color: "#2965f1ff", description: "Style pages beautifully with CSS." }, 
                  { id: 3, title: "JavaScript", icon: <FaJs />, color: "#edd011ff", description: "Make web pages dynamic." }, 
                  { id: 4, title: "Java", icon: <FaJava />, color: "#5382A1", description: "Master object-oriented programming." }, 
                  { id: 5, title: "Python", icon: <FaPython />, color: "#306998", description: "Write powerful Python scripts." }, 
                  { id: 6, title: "SQL", icon: <FaDatabase />, color: "#8f0000ff", description: "Query databases effectively." }
                 ];

  const menuItems = [{ name: "Dashboard", icon: <FaHome />, action: "setSection" },
                     { name: "My Courses", icon: <FaBook />, action: "setSection" },
                     { name: "Profile", icon: <FaUserCircle />, action: "setSection" },
                     { name: "Progress", icon: <FaChartLine />, action: "setSection" },
                     { name: "certificates", icon: <FaTasks />, action: "setSection" },
                     { name: "feedback", icon: <FaCommentDots />, action: "setSection" },
                     { name: "Logout", icon: <FaSignOutAlt />, action: "logout" },
                    ];

  // ----------------- Load question -----------------
  const loadQuestionData = (course, chapter, example) => {
    try {
      const key = `./CodingChapter${chapter}.json`;
      const context = quizContexts[course.toLowerCase()];
      if (!context) throw new Error(`No quiz data found for ${course}`);
      const data = context(key);
      const question = data[example - 1] || null;
      setQuestionData(question);

      const contestKey = `ch${chapter}-ex${example}`;
      const savedContest = courseContests[contestKey];

      const initialCode =
        savedContest?.code ||
        question?.initialCode ||
        languageBoilerplates[course] ||
        "";

      setCode(initialCode);
      setOutput("");
      setShowOutput(false);
      setEvaluationResult(null);
    } catch (err) {
      console.error("Error loading question:", err);
      setQuestionData(null);
      setCode("");
      setOutput("");
      setEvaluationResult(null);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setExpandedChapter(null); 
    setSelectedExample(null);
    setQuestionData(null);
    setCourseContests({});
    setChapterExampleCounts({});
    setActiveSection("My Courses");
  };

  const handleChapterToggle = (chapter) => {
    if (expandedChapter === chapter) {
      setExpandedChapter(null); // Close if already open
    } else {
      setExpandedChapter(chapter); // Open new one
    }
  };

  const handleExampleClick = (chapter, example) => {
    setSelectedExample(example);
    loadQuestionData(selectedCourse, chapter, example);
  };

  const handleBack = () => {
    if (questionData) {
      setQuestionData(null);
      setSelectedExample(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
      setExpandedChapter(null);
      setActiveSection("Dashboard");
    }
  };

  // ----------------- Submit final -----------------
  const handleFinalSubmit = async () => {
    if (!evaluationResult) {
      Swal.fire({
        title: "Cannot Save Yet",
        text: "Please click 'Run' first to test your code and generate a result before Saving.",
        icon: "info",
      });
      return;
    }

    const maxMarks = questionData?.maxMarks || ExamConfig.codingMarks;
    const currentScore = evaluationResult.score;

    if (currentScore < maxMarks) {
      Swal.fire({
        title: "Score Too Low",
        text: `You must achieve the full score of ${maxMarks}/${maxMarks} to successfully complete and save this exercise.Please improve your code.`,
        icon: "warning",
      });
      return;
    }

    const userId = userProfile?._id;
    if (!userId) {
      Swal.fire({
        title: "Submission Error",
        text: "User profile not loaded. Cannot Save. Please check your login status.",
        icon: "error",
      });
      return;
    }

    const contestData = {
      course: selectedCourse,
      chapter: Number(expandedChapter),
      example: Number(selectedExample),
      marks: currentScore,
      code: code,
    };

    try {
      await axios.post(`/api/contests/${userId}`, contestData);

      Swal.fire({
        title: `Saved! 🎉`,
        html: ` <p><b>Exercise-</b> ${selectedExample} of <b>Chapter- </b> ${expandedChapter} in ${selectedCourse} submitted.</p>`,
        icon: "success",
      }).then(() => {
        fetchCourseTotal(userId, selectedCourse, true);

        const totalExamples = chapterExampleCounts[expandedChapter] || 0;
        const nextExample = Number(selectedExample) + 1;

        if (nextExample <= totalExamples) {
          handleExampleClick(expandedChapter, nextExample);
        } else {
          setQuestionData(null);
          setSelectedExample(null);
        }
        setEvaluationResult(null);
      });
    } catch (error) {
      console.error(
        "Error submitting contest result:",
        error.response?.data || error
      );
      Swal.fire({
        title: "Submission Failed!",
        text: `There was an error saving your score. Error: ${
          error.response?.data?.details ||
          error.response?.data?.message ||
          "Check network/server logs."
        }`,
        icon: "error",
      });
    }
  };

  // ----------------- Evaluate / Run Code -----------------
  const handleEvaluateCode = async () => {
    if (!questionData) {
      Swal.fire(
        "No question loaded",
        "Please open an example before running.",
        "info"
      );
      return;
    }

    if (!code || !code.trim()) {
      Swal.fire({
        title: "Empty Code",
        text: "Please write some code first! Empty submissions receive 0 marks.",
        icon: "warning",
      });
      setEvaluationResult({
        score: 0,
        message: "Empty code. 0 marks.",
        isCorrect: false,
        userOutput: "",
        expectedOutput: questionData.sampleOutput || "N/A",
      });
      setShowOutput(true);
      setOutput("");
      return;
    }

    const langKey = selectedCourse?.toLowerCase();
    const isCodepad = CODEPAD_LANGS.includes(langKey);
    const maxMarks = questionData.maxMarks || ExamConfig.codingMarks;
    const expectedOutput = (questionData.sampleOutput || "").toString();

    setIsRunning(true);
    setShowOutput(true);
    setEvaluationResult(null);
    setOutput(
      isCodepad ? "Generating Live Preview..." : "Evaluating with Judge0..."
    );

    try {
      if (isCodepad) {
        if (expectedOutput && expectedOutput.trim().length > 0) {
          const actualFromCode = code;
          const { score, reason } = evaluateOutputs(
            expectedOutput,
            actualFromCode,
            maxMarks
          );
          setOutput(createPreviewContent(code, langKey));
          setEvaluationResult({
            score,
            message:
              score === maxMarks
                ? `Test executed successfully! ✅`
                : `Output generated with issues. ⚠️`,
            isCorrect: score >= Math.ceil(maxMarks * 0.5),
            userOutput: actualFromCode,
            expectedOutput,
          });
        } else {
          setOutput(createPreviewContent(code, langKey));
          setEvaluationResult({
            score: 0,
            message:
              "No expected output available to auto-grade.",
            isCorrect: false,
            userOutput: code,
            expectedOutput: "N/A",
          });
        }
        setIsRunning(false);
        return;
      }

      const language_id = JUDGE0_LANG_IDS[langKey] || 63;
      const res = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=true`,
        { source_code: code, language_id, stdin: questionData?.sampleInput || "",},
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;
      let userOutput = "";
      if (data.status && data.status.id === 3) {
        userOutput = data.stdout ?? "";
      } else {
        userOutput = data.stderr || data.compile_output || data.stdout || "";
      }

      const cleanedUserOutput = (userOutput || "").toString().trim();
      setOutput(userOutput || "");

      let finalScore = 0;
      let resultMessage = "";

      if (data.status && data.status.id === 3) {
        const { score, reason } = evaluateOutputs(
          expectedOutput,
          cleanedUserOutput,
          maxMarks
        );
        finalScore = score;
        resultMessage =
          score === maxMarks
            ? `✅ Correct! ${reason}`
            : `⚠️ Partial / Incorrect — ${reason}`;
      } else if (data.status && data.status.id === 6) {
        finalScore = 0;
        resultMessage = `❌ Compilation Error. ${
          data.compile_output ? "See compiler output." : ""
        }`;
      } else if (data.status && data.status.id === 11) {
        finalScore = 0;
        resultMessage = `❌ Runtime Error. ${
          data.stderr ? "See runtime output." : ""
        }`;
      } else {
        finalScore = 0;
        resultMessage = `⚠️ Execution Failed: ${
          data.status ? data.status.description : "Unknown error"
        }.`;
      }

      setEvaluationResult({
        score: finalScore,
        message: resultMessage,
        isCorrect: finalScore > 0,
        userOutput: cleanedUserOutput || userOutput || "No output",
        expectedOutput: questionData.sampleOutput || "N/A",
      });
    } catch (err) {
      console.error("API Error:", err);
      setOutput("⚠️ Error during evaluation.");
      setEvaluationResult({
        score: 0,
        message: "⚠️ Network or API error during evaluation. Please try again.",
        isCorrect: false,
        userOutput: "N/A",
        expectedOutput: questionData?.sampleOutput || "N/A",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // ----------------- Fetch course totals (contests) -----------------
  const fetchCourseTotal = async (userId, course, silent = false) => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `/api/contests/${userId}/course?course=${course}`
      );
      const { contests } = res.data;

      const contestsMap = {};
      (contests || []).forEach((c) => {
        contestsMap[`ch${c.chapter}-ex${c.example}`] = c;
      });
      setCourseContests(contestsMap);
    } catch (error) {
      console.error(
        "Error fetching course total:",
        error.response?.data || error
      );
    }
  };

  // ----------------- ⭐️ NEW Progress Bar Component ⭐️ -----------------
  const renderCourseProgress = () => {
    const totalExamplesInCourse = Object.values(chapterExampleCounts).reduce(
      (a, b) => a + b,
      0
    );
    const totalCompletedInCourse = Object.values(courseContests).filter(
      (c) => c.marks >= ExamConfig.codingMarks
    ).length;

    let percentage = 0;
    if (totalExamplesInCourse > 0) {
      percentage = (totalCompletedInCourse / totalExamplesInCourse) * 100;
    }

    return (
      <div className="course-progress-sidebar">
        <h3>Course Progress</h3>
        <div className="progress-stats">
          <span className="progress-percentage">{Math.round(percentage)}%</span>
          <span className="progress-fraction">
            {totalCompletedInCourse} / {totalExamplesInCourse}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // ----------------- Render Content -----------------
  const renderMainContent = () => {
    if (activeSection === "certificates") return <Certificates />;
    if (activeSection === "feedback") return <Feedback />;
    if (activeSection === "Progress") {
      if (!userProfile._id && !isProfileLoading) {
        return (
          <p className="learning-info-box">
            Please log in to view your progress.
          </p>
        );
      }
      return (
        <Progress
          userId={userProfile._id}
          allCourseMaxMarks={allCourseMaxMarks}
        />
      );
    }

    if (activeSection === "My Courses") {
      // VIEW 1: A specific exercise is open
      if (selectedCourse && selectedExample && questionData) {
        const langType = selectedCourse.toLowerCase();
        const isCodepad = CODEPAD_LANGS.includes(langType);
        const aceMode = getAceMode(selectedCourse);

        const evaluateButtonText = isRunning
          ? isCodepad
            ? "Running Live Preview..."
            : "Evaluating with Judge0..."
          : "Run";

        return (
          <div className="learning-question-view">
            <button className="learning-back-btn" onClick={handleBack}>
              ← Back to Chapters
            </button>
            <h2 className="learning-content-header">
              {selectedCourse} Chapter {expandedChapter} : Exercise{" "}
              {selectedExample}
            </h2>

            <div className="question-compiler-columns">
              <div className="question-area-left-column">
                <div className="learning-question-card">
                  <h3>Question</h3>
                  <p>{questionData.question}</p>

                  <h4 className="sample-header">📥 Sample Input:</h4>
                  <pre>{questionData.sampleInput || "N/A"}</pre>

                  <h4 className="sample-header">📤 Expected Output:</h4>
                  <pre>{questionData.sampleOutput || "N/A"}</pre>
                </div>
              </div>

              <div className="compiler-area-right">
                <div className="compiler-area">
                  <div className="compiler-buttons dual-button-group">
                    <h4>💻 Code Editor ({selectedCourse})</h4>
                    <button
                      className="evaluate-code-btn"
                      onClick={handleEvaluateCode}
                      disabled={isRunning}
                    >
                      {evaluateButtonText}
                    </button>

                    <button
                      className="complete-chapter-btn"
                      onClick={handleFinalSubmit}
                      disabled={isRunning || !evaluationResult}
                    >
                      🎉Save
                    </button>
                  </div>
                  <AceEditor
                    mode={aceMode}
                    theme="monokai"
                    name="code-editor"
                    value={code}
                    onChange={setCode}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 4,
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'Consolas', monospace",
                    }}
                    style={{
                      width: "100%",
                      height: "350px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </div>

                {evaluationResult && (
                  <div
                    className={`evaluation-result-box ${
                      evaluationResult.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <h3>📊 Evaluation Summary</h3>
                    <p>
                      <strong>Status:</strong> {evaluationResult.message}
                    </p>

                    {!isCodepad && (
                      <div className="evaluation-details-section">
                        <h4>Your Code's Output:</h4>
                        <pre
                          className="evaluation-details"
                          style={{ whiteSpace: "pre-wrap" }}
                        >
                          {evaluationResult.userOutput || "No output generated"}
                        </pre>
                        {evaluationResult.score <
                          (questionData.maxMarks || ExamConfig.codingMarks) && (
                          <>
                            <h4>Expected Answer Output:</h4>
                            <pre
                              className="evaluation-details"
                              style={{ whiteSpace: "pre-wrap" }}
                            >
                              {evaluationResult.expectedOutput}
                            </pre>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {showOutput && (
                  <div className="output-box-container">
                    <h4>🧾Output/Preview:</h4>
                    {isCodepad ? (
                      <iframe
                        title="Preview"
                        srcDoc={output}
                        style={{
                          width: "100%",
                          height: "80%",
                          border: "1px solid #000000ff",
                          borderRadius: "8px",
                          background: "#fff",
                        }}
                      />
                    ) : (
                      <pre className="compiler-output">{output}</pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      // ⭐️ VIEW 2: Stepper Accordion Chapter List
      if (selectedCourse) {
        const lang = selectedCourse.toLowerCase();
        const info = chapterInfoByLang[lang] || {
          count: 0,
          chapterKeys: [],
          chapters: [],
        };

        return (
          <div className="learning-chapters-container">
            {/* <FaTrophy className="animated-icon trophy" />
<FaStar className="animated-icon star" />
<FaMedal className="animated-icon medal" />
<FaAward className="animated-icon award" />
<FaCertificate className="animated-icon certificate" /> */}
            <button className="learning-back-btn" onClick={handleBack}>
              ← Back to Courses
            </button>
            <h2 className="learning-content-header">
              <span>{selectedCourse} Course </span>
            </h2>

            <div className="course-content-layout">
              {/* --- Left Column: Stepper Accordion --- */}
              <div className="chapter-accordion-container">
                {info.chapters.map((chapter) => {
                  const chapterNum = chapter.num;
                  const totalExamplesInChapter =
                    chapterExampleCounts[chapterNum] || 0;
                  const chapterIsCompleted = isChapterCompleted(
                    chapterNum,
                    totalExamplesInChapter
                  );
                  const chapterIsUnlocked = isChapterUnlocked(chapterNum, info);
                  const isActive = expandedChapter === chapterNum;

                  let statusClass = "";
                  if (isActive) statusClass = "open";
                  if (chapterIsCompleted) statusClass += " completed-chapter";
                  if (!chapterIsUnlocked) statusClass += " locked-chapter";

                  return (
                    <div
                      key={chapterNum}
                      className={`chapter-accordion-item ${statusClass}`}
                    >
                      <div className="chapter-number">
                        {chapterIsCompleted ? <FaCheck /> : chapterNum}
                      </div>

                      <div
                        className="chapter-accordion-header"
                        onClick={() =>
                          chapterIsUnlocked
                            ? handleChapterToggle(chapterNum)
                            : Swal.fire(
                                "Chapter Locked!",
                                "Please complete all examples in the previous chapter to unlock this one.",
                                "info"
                              )
                        }
                      >
                        <h3>{chapter.title} </h3>

                        <span className="chapter-toggle-icon">
                          {isActive ? "−" : "+"}
                        </span>
                      </div>

                      <div
                        className={`chapter-accordion-content ${
                          isActive ? "open" : ""
                        }`}
                      >
                        {/* ⭐️ JSX for exercises UPDATED for 3-column layout */}
                        {isActive &&
                          currentChapterData.map((exercise, index) => {
                            const exerciseNum = index + 1;
                            const description = exercise.description || "N/A";

                            const isCompleted = isExampleCompleted(
                              expandedChapter,
                              exerciseNum
                            );
                            const isUnlocked = isExampleUnlocked(
                              expandedChapter,
                              exerciseNum
                            );

                            const exerciseClassName = `exercise-item ${
                              !isUnlocked
                                ? "locked"
                                : isCompleted
                                ? "completed"
                                : ""
                            }`;

                            const handleExerciseAction = () => {
                              if (!isUnlocked) {
                                Swal.fire(
                                  "Exercise Locked!",
                                  `Please complete Exercise ${
                                    exerciseNum - 1
                                  } with a full score to unlock this one.`,
                                  "info"
                                );
                              } else {
                                handleExampleClick(
                                  expandedChapter,
                                  exerciseNum
                                );
                              }
                            };

                            return (
                              <div key={index} className={exerciseClassName}>
                                <h4 className="exercise-title">
                                  Exercise {exerciseNum}: {exercise.title || ""}
                                </h4>
                                <p className="exercise-description">
                                  {description}
                                </p>
                                <button
                                  className="exercise-start-btn"
                                  onClick={handleExerciseAction}
                                  disabled={!isUnlocked}
                                >
                                  {isUnlocked
                                    ? isCompleted
                                      ? "Review"
                                      : "Start"
                                    : "Locked"}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* --- Right Column: Progress Sidebar --- */}
              {renderCourseProgress()}
            </div>
          </div>
        );
      }

      // VIEW 3: Course Grid (Fallback)
      return (
        <div className="learning-courses-section">
          <h1 className="upgraded-catalog-header">📚 Available Courses</h1>

          {/* Using the same grid container class for consistent styling */}
          <div className="upgraded-courses-container">
            {courses.map((course) => (
              <div
                key={course.id}
                className="upgraded-course-card"
                // Pass color for the unique corner background element and button
                style={{ "--upgraded-accent": course.color }}
                onClick={() => handleCourseClick(course.title)}
              >
                {/* 1. LAYERED BACKGROUND ACCENT */}
                <div className="card-background-accent"></div>

                {/* 2. MAIN CONTENT LAYER */}
                <div className="upgraded-card-content">
                  <span className="upgraded-icon-box">{course.icon}</span>

                  <div className="text-details-area">
                    <h3 className="upgraded-course-title">{course.title}</h3>
                    <p className="upgraded-course-description">
                      {course.description}
                    </p>
                  </div>

                  <div className="upgraded-footer">
                    {/* Neutral label for content type */}
                    <span className="upgraded-label">Module Content</span>

                    {/* Updated CTA button */}
                    <button className="upgraded-cta-btn">Access Now →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // VIEW 4: Dashboard / Profile
    if (activeSection === "Dashboard" || activeSection === "Profile") {
      const profile = userProfile || {};
      const greetingName = profile.studentName || "Student";

      if (isProfileLoading)
        return <h1 className="learning-content-header">Loading Profile...</h1>;

      return (
        <div className="learning-dashboard">
          <h1 className="learning-content-header">
            👋 Welcome, {greetingName}
          </h1>

          <div className="profile-details-card">
            <h2>
              <FaUserCircle /> My Profile Details
            </h2>
            <div className="profile-grid">
              <div className="profile-item">
                <strong>Student Name:</strong>{" "}
                <span>{profile.studentName || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Email:</strong> <span>{profile.email || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Mobile:</strong> <span>{profile.mobile || "N/A"}</span>
              </div>

              <div className="profile-item academic-header">
                <h3>Academic Information</h3>
              </div>
              <div className="profile-item">
                <strong>College Name:</strong>{" "}
                <span>{profile.college || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Qualification:</strong>{" "}
                <span>{profile.qualification || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>Year of Passing:</strong>{" "}
                <span>{profile.passingYear || "N/A"}</span>
              </div>
              <div className="profile-item">
                <strong>CGPA:</strong> <span>{profile.cgpa || "N/A"}</span>
              </div>
            </div>
          </div>

          {activeSection === "Dashboard" && (
            <div className="dashboard-courses-preview">
              <h2 className="upgraded-catalog-header">
                ✨ Available Courses
              </h2>

              <div className="upgraded-courses-container">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="upgraded-course-card"
                    style={{ "--upgraded-accent": course.color }}
                    onClick={() => handleCourseClick(course.title)}
                  >
                    {/* The unique background element for depth and color */}
                    <div className="card-background-accent"></div>
                    {/* Main content layer that sits on top */}
                    <div className="upgraded-card-content">
                      <span className="upgraded-icon-box">{course.icon}</span>

                      <div className="text-details-area">
                        <h3 className="upgraded-course-title">
                          {course.title}
                        </h3>
                        <p className="upgraded-course-description">
                          {course.description}
                        </p>
                      </div>

                      <div className="upgraded-footer">
                        {/* Removed 'Certified' tag. Using 'Module' as a neutral label. */}
                        <span className="upgraded-label">Module Content</span>
                        <button className="upgraded-cta-btn">
                          Access Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="learning-info-box">
            {activeSection === "Dashboard"
              ? "Click on any course card above to view chapters and start coding!"
              : "Verify your stored academic and contact information."}
          </p>
        </div>
      );
    }

    return <h1 className="learning-content-header">Coming Soon...</h1>;
  };

  const handleMenuItemClick = (item) => {
    if (item.action === "logout") {
      handleLogout();
      return;
    }
    setActiveSection(item.name);
    setSelectedCourse(null);
    setExpandedChapter(null);
    setSelectedExample(null);
    setQuestionData(null);
  };

  return (
    <div className="learning-container">
      {/* --- Sidebar --- */}
      <aside
        className={`learning-sidebar ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="learning-sidebar-header">
          {isSidebarOpen ? (
            "CodePulse-R Portal"
          ) : (
            <FaBars className="menu-icon" />
          )}
        </div>
        <ul className="learning-menu-list">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`learning-menu-item ${
                activeSection === item.name ? "active" : ""
              }`}
              onClick={() => handleMenuItemClick(item)}
            >
              <span className="menu-icon">{item.icon}</span>
              {isSidebarOpen && (
                <span className="learning-menu-text">{item.name}</span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* --- Main Content --- */}
      <main className="learning-main-content">{renderMainContent()}</main>
    </div>
  );
}

export default StartLearning;
