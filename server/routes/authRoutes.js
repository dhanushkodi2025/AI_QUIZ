const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../db");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;
    const googleId = user.id;
    const name = user.displayName;
    const email = user.emails[0].value;

    try {
      const [rows] = await db.query("SELECT * FROM users WHERE googleId = ?", [googleId]);
      if (rows.length === 0) {
        await db.query("INSERT INTO users (googleId, name, email) VALUES (?, ?, ?)", [googleId, name, email]);
      }

      const token = jwt.sign({ sub: googleId, name, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.redirect(`${process.env.FRONTEND_URL}/home?token=${token}`);
    } catch (err) {
      console.error("❌ Error saving user to DB:", err);
      res.redirect(`${process.env.FRONTEND_URL}/?error=db`);
    }
  }
);

router.post("/save", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { quizName, topic, difficulty, numQuestions, timerPerQuestion, questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid questions format" });
    }

    await db.execute(
      `INSERT INTO quizzes 
        (user_id, user_name, quiz_name, topic, difficulty, num_questions, timer_per_question, questions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.sub,
        decoded.name,
        quizName,
        topic,
        difficulty,
        numQuestions,
        timerPerQuestion,
        JSON.stringify(questions)
      ]
    );

    res.status(200).json({ message: "Quiz saved ✅" });
  } catch (err) {
    console.error("❌ Quiz save failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
