const lines = [
  "Step 1:The interested applicant",
  "Step 2: Submit form",
  "1. First step",
  "2) Second step",
  "- Bullet point",
  "• Bullet point",
  "* Bullet point",
  "Just a normal paragraph.",
  "123. A numbered list item with large number"
];
lines.forEach(line => {
  const cleanLine = line
    .replace(/^[-•*]\s*/, '')
    .replace(/^(?:Step\s*\d+\s*[:\.]?|\d+[\.)])\s*/i, '')
    .trim();
  console.log(`Original: "${line}" -> Clean: "${cleanLine}"`);
});
