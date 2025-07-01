import { GoogleGenAI } from "@google/genai";

// Initialize with API key from .env
const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const generateQuiz = async ({ topic, numQuestions, difficulty }) => {
  try {
    const prompt = `
You are a quiz master. Generate ${numQuestions} multiple choice questions (MCQs) on the topic "${topic}" with "${difficulty}" difficulty.
Each question should have:
- A question
- 4 options (a, b, c, d)
- The correct answer labeled as "Answer: a)", etc.

Use clear formatting.
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash", // ✅ from latest docs
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        thinkingConfig: {
          thinkingBudget: 0 // Optional: disables advanced reasoning to reduce cost/speed
        }
      }
    });

    return result.text;
  } catch (error) {
    console.error("Gemini error ❌:", error);
    return "⚠️ Failed to generate quiz.";
  }
};
