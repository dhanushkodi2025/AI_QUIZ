import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { generateQuiz } from "../lib/gemini";
import { parseQuiz } from "../lib/parseQuiz"; // ✅ Make sure this exists
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [quizName, setQuizName] = useState("");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("Easy");
  const [timerPerQuestion, setTimerPerQuestion] = useState(0);
  const [quizOutput, setQuizOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const handleToken = (tokenToUse) => {
    try {
      const decoded = jwtDecode(tokenToUse);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        handleLogout();
        return;
      }
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      handleLogout();
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        handleToken(token);
      } else {
        setUser(null);
        navigate("/", { replace: true });
      }
    };

    checkAuth();
    window.addEventListener("popstate", checkAuth);
    return () => window.removeEventListener("popstate", checkAuth);
  }, []);

  useEffect(() => {
    if (user?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = user.exp - currentTime;
      if (expiresIn <= 0) {
        handleLogout();
        return;
      }
      const timer = setTimeout(handleLogout, expiresIn * 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "token" && event.newValue === null) handleLogout();
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  const saveQuizToDB = async ({
    quizName,
    topic,
    difficulty,
    numQuestions,
    timerPerQuestion,
    questions
  }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post("http://localhost:5000/auth/save", {
        quizName,
        topic,
        difficulty,
        numQuestions,
        timerPerQuestion,
        questions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Quiz saved to DB:", res.data);
    } catch (err) {
      console.error("❌ Save to DB failed:", err.response?.data || err.message);
    }
  };

  const handleGenerate = async () => {
    if (!quizName || !topic) return alert("Fill quiz name and topic");

    setLoading(true);
    try {
      const rawQuiz = await generateQuiz({ topic, numQuestions, difficulty });
      const parsedQuiz = parseQuiz(rawQuiz);

      // ✅ Save to DB
      await saveQuizToDB({
        quizName,
        topic,
        difficulty,
        numQuestions,
        timerPerQuestion,
        questions: parsedQuiz
      });

      // ✅ Navigate to quiz
      navigate("/quiz", {
        state: {
          quizData: rawQuiz,
          quizName,
          timerPerQuestion,
          topic,
          difficulty,
          numQuestions
        },
      });

      setQuizOutput(rawQuiz);
    } catch (err) {
      console.error("Gemini API error:", err);
      setQuizOutput("⚠️ Failed to generate quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome <span className="text-yellow-400">{user.name}</span> to{" "}
          <span className="text-yellow-400">Quiz Genie</span>
        </h1>

        <div className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60"
          />
          <input
            type="text"
            placeholder="Topic (e.g. Python)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60"
          />
          <input
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full px-4 py-2 rounded bg-white/20 text-white"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 rounded bg-white/20 text-white"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={timerPerQuestion}
            onChange={(e) => setTimerPerQuestion(Number(e.target.value))}
            className="w-full px-4 py-2 rounded bg-white/20 text-white"
          >
            <option value={0}>No Timer</option>
            <option value={15}>15 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={45}>45 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
          </select>

          <button
            onClick={handleGenerate}
            className="w-full bg-yellow-400 text-purple-800 font-semibold py-2 rounded hover:bg-yellow-300"
          >
            Generate Quiz 🚀
          </button>
        </div>

        {loading && (
          <p className="text-yellow-300 mt-6 text-sm">
            Generating quiz using Gemini...
          </p>
        )}

        {quizOutput && (
          <div className="mt-6 p-4 bg-white/20 rounded text-white text-left whitespace-pre-wrap max-h-[300px] overflow-auto">
            <h3 className="text-yellow-300 font-semibold mb-2">
              Generated Quiz:
            </h3>
            {quizOutput}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
