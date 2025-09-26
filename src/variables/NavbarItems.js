// const navbarItems = [
//   { name: 'Home', icon: 'https://static.javatpoint.com/images/icon/home.png' },
//   { name: 'Java', icon: 'https://static.javatpoint.com/images/icon/java.png' },
//   { name: 'Python', icon: 'https://static.javatpoint.com/images/icon/python.png' },
//   { name: 'JavaScript', icon: 'https://static.javatpoint.com/images/icon/js.png' },
//   { name: 'HTML', icon: 'https://static.javatpoint.com/images/icon/html.png' },
//   { name: 'SQL', icon: 'https://static.javatpoint.com/images/icon/sql.png' },
//  ];

// export default navbarItems;

import { FaHome, FaJava, FaPython, FaHtml5, FaDatabase, FaProjectDiagram, FaReact, FaQuestionCircle, FaCss3Alt, FaCode } from 'react-icons/fa';
import { IoLogoJavascript } from 'react-icons/io5';
import { SiSpringboot } from "react-icons/si";

const navbarItems = [
  { name: 'Home', icon: <FaHome />, type: 'technology' },

  {
    name: 'Frontend',
    type: 'dropdown',
    subItems: [
      { name: 'HTML', icon: <FaHtml5 />, type: 'technology' },
      { name: 'CSS', icon: <FaCss3Alt />, type: 'technology' },
      { name: 'JavaScript', icon: <IoLogoJavascript />, type: 'technology' },
      { name: 'React', icon: <FaReact />, type: 'technology' },
    ],
  },

  { name: 'Java', icon: <FaJava />, type: 'technology' },
  { name: 'RESTAPI', icon: <SiSpringboot />, type: 'technology' },
  { name: 'Microservices', icon: <FaProjectDiagram />, type: 'technology' },
  { name: 'Python', icon: <FaPython />, type: 'technology' },
  { name: 'SQL', icon: <FaDatabase />, type: 'technology' },
  
  { name: 'Q&A', icon: <FaQuestionCircle />, type: 'name' },
  { name: 'DSA', icon: <FaCode />, type: 'name' },
];

export default navbarItems;

