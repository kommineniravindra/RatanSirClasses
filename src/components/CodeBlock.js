import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import '../css/codeblock.css';


// ✅ Import some nice styles
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ✅ Map technologies → language + style
const technologyConfig = {
  html: { lang: 'html', style: prism },
  css: { lang: 'css', style: coy },
  javascript: { lang: 'javascript', style: vscDarkPlus },
  react: { lang: 'jsx', style: duotoneDark },
  java: { lang: 'java', style: atomDark },
  restapi: { lang: 'json', style: okaidia },       // REST usually JSON
  microservices: { lang: 'yaml', style: okaidia }, // configs in YAML
  python: { lang: 'python', style: duotoneDark },
  sql: { lang: 'sql', style: prism },
};

const CodeBlock = ({ technology = "html", children }) => {
  const tech = technology.toLowerCase();
  const { lang, style } = technologyConfig[tech] || { lang: 'text', style: prism };

  return (
    <SyntaxHighlighter language={lang} style={style}   className="code-block">
      {children}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
