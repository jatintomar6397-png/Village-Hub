const fs = require('fs');
const { marked } = require('marked');

const mdPath = 'C:\\Users\\thaku\\.gemini\\antigravity\\brain\\992a8904-9367-499a-81dc-d607f896cde6\\Village_Hub_Mini_Project_Report.md';
let md = fs.readFileSync(mdPath, 'utf8');

md = md.replace(/\/C:\/Users/g, 'C:/Users');
md = md.replace(/file:\/\/\/C:\/Users/g, 'C:/Users');

const htmlContent = marked.parse(md);

const html = `
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; }
h1, h2, h3 { text-align: center; }
table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
th, td { border: 1px solid black; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
img { max-width: 650px; height: auto; display: block; margin: 10px auto; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>
`;

fs.writeFileSync('C:\\Users\\thaku\\.gemini\\antigravity\\brain\\992a8904-9367-499a-81dc-d607f896cde6\\report_temp.html', html);
