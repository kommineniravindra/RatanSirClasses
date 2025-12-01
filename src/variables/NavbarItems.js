import {
  FaHome,
  FaJava,
  FaPython,
  FaHtml5,
  FaDatabase,
  FaProjectDiagram,
  FaReact,
  FaQuestionCircle,
  FaCss3Alt,
  FaCode,
  FaEnvelope,
  FaUser,
  FaGit,
  FaGitAlt,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { SiSpringboot } from "react-icons/si";

const navbarItems = [
  { name: "Home", icon: <FaHome />, type: "Home" },

  {
    name: "Frontend",
    type: "dropdown",
    subItems: [
      { name: "HTML", icon: <FaHtml5 />, type: "technology" },
      { name: "CSS", icon: <FaCss3Alt />, type: "technology" },
      { name: "JavaScript", icon: <IoLogoJavascript />, type: "technology" },
      { name: "React", icon: <FaReact />, type: "technology" },
    ],
  },
  {
    name: "Backend",
    type: "dropdown",
    subItems: [
      { name: "Java", icon: <FaJava />, type: "technology" },
      { name: "Python", icon: <FaPython />, type: "technology" },
    ],
  },
  ,
  {
    name: "Tools",
    type: "dropdown",
    subItems: [{ name: "GIT", icon: <FaGitAlt />, type: "technology" }],
  },

  { name: "RESTAPI", icon: <SiSpringboot />, type: "technology" },
  { name: "Microservices", icon: <FaProjectDiagram />, type: "technology" },
  { name: "SQL", icon: <FaDatabase />, type: "technology" },

  // { name: "Q&A", icon: <FaQuestionCircle />, type: "Q&A" },
  { name: "DSA", icon: <FaCode />, type: "DSA" },
  { name: "AboutUs", icon: <FaUser />, type: "AboutUs" },
  { name: "ContactUs", icon: <FaEnvelope />, type: "ContactUs" },
];

export default navbarItems;
