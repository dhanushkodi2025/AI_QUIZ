export const parseQuiz = (rawText) => {
  const lines = rawText.split("\n").filter(line => line.trim() !== "");
  const result = [];

  let question = "";
  let options = [];
  let correct = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^\*\*Question \d+:\*\*/)) {
      // Save previous question if exists
      if (question && options.length > 0) {
        result.push({ question, options, correct });
        options = [];
        correct = "";
      }
      question = lines[++i]?.trim(); // Get the actual question line after the label
    } else if (line.match(/^[a-dA-D]\)/)) {
      options.push(line.slice(3).trim()); // Remove "a) ", "b) " etc.
    } else if (line.match(/^\*\*Answer: /)) {
      const match = line.match(/\*\*Answer:\s*([a-dA-D])\)?/);
      if (match && match[1]) {
        const correctLetter = match[1].toUpperCase();
        const index = "ABCD".indexOf(correctLetter);
        correct = options[index] || "";
      }
    }
  }

  // Push last question
  if (question && options.length > 0) {
    result.push({ question, options, correct });
  }

  return result;
};
