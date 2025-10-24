export const getDefaultStyles = (theme: string = 'default'): string => {
  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Noto Serif JP', serif;
      font-size: 12pt;
      line-height: 1.8;
      color: #333;
      background: white;
      padding: 20mm;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      line-height: 1.4;
      page-break-after: avoid;
    }

    h1 {
      font-size: 2em;
      border-bottom: 3px solid #333;
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.5em;
      border-bottom: 2px solid #666;
      padding-bottom: 0.2em;
    }

    h3 {
      font-size: 1.25em;
      border-left: 4px solid #333;
      padding-left: 0.5em;
    }

    p {
      margin-bottom: 1em;
      text-align: justify;
    }

    code {
      font-family: 'Courier New', Consolas, monospace;
      background-color: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }

    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin: 1em 0;
      page-break-inside: avoid;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      font-size: 0.85em;
      line-height: 1.5;
    }

    ul, ol {
      margin-left: 2em;
      margin-bottom: 1em;
    }

    li {
      margin-bottom: 0.5em;
    }

    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 1em;
      margin: 1em 0;
      color: #666;
      font-style: italic;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 700;
      font-family: 'Noto Sans JP', sans-serif;
    }

    a {
      color: #0066cc;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1em auto;
      page-break-inside: avoid;
    }

    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 2em 0;
    }

    @media print {
      body {
        padding: 0;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
      }

      pre, table, img {
        page-break-inside: avoid;
      }
    }
  `;

  const themeStyles = {
    default: '',
    academic: `
      body {
        font-size: 11pt;
        line-height: 1.6;
      }
      h1 {
        text-align: center;
        border-bottom: none;
        margin-top: 2em;
      }
      h2 {
        margin-top: 2em;
      }
    `,
    business: `
      body {
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 10pt;
        line-height: 1.6;
      }
      h1, h2, h3 {
        color: #1a1a1a;
      }
      h1 {
        background-color: #f0f0f0;
        padding: 0.5em;
        border-bottom: none;
      }
    `
  };

  return baseStyles + (themeStyles[theme as keyof typeof themeStyles] || '');
};
