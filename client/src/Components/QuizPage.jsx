import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { parseQuiz } from "../lib/parseQuiz";
import { ArrowLeft, ArrowRight } from "lucide-react";

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, quizName, timerPerQuestion = 0 } = location.state || {};

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizArray, setQuizArray] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timerPerQuestion);
  const timerRef = useRef(null);

  useEffect(() => {
    if (quizData) {
      const parsed = parseQuiz(quizData);
      setQuizArray(parsed);
    }
  }, [quizData]);

  // Reset timer on new question
  useEffect(() => {
    if (timerPerQuestion > 0) {
      setTimeLeft(timerPerQuestion);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNext(); // Auto move to next if time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [current]);

  const handleOptionSelect = (opt) => {
    setSelectedOption(opt);
  };

  const handleNext = () => {
    const currentQ = quizArray[current];
    const isCorrect = selectedOption === currentQ.correct;

    const newAnswer = {
      question: currentQ.question,
      selected: selectedOption,
      correct: currentQ.correct,
      isCorrect
    };

    const updatedAnswers = [...answers, newAnswer];

    if (current + 1 < quizArray.length) {
      setAnswers(updatedAnswers);
      setSelectedOption(null); // reset
      setCurrent((prev) => prev + 1);
    } else {
      navigate("/results", {
        state: {
          quizName,
          answers: updatedAnswers
        }
      });
    }
  };

  const handleBack = () => {
    if (current === 0) return;
    setCurrent((prev) => prev - 1);
    setSelectedOption(null); // Optional: reset on back
  };

  const handleSubmit = () => {
    navigate("/results", {
      state: {
        quizName,
        answers
      }
    });
  };

  if (!quizData) {
    return (
      <div className="text-center p-10 text-white bg-red-500">
        No quiz data found.{" "}
        <button
          onClick={() => navigate("/")}
          className="underline text-white font-bold"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (quizArray.length === 0) {
    return (
      <div className="text-center p-10 text-white">
        ⏳ Parsing quiz...
      </div>
    );
  }

  const currentQ = quizArray[current];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-700 to-purple-700 p-4 text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {quizName || "Your AI Quiz"} — Question {current + 1} of {quizArray.length}
        </h2>
        <div className="flex items-center gap-4">
          {timerPerQuestion > 0 && (
            <span className="bg-black/40 px-3 py-1 rounded-full text-yellow-300 font-mono">
              ⏳ {timeLeft}s
            </span>
          )}
          <button
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded"
          >
            End Test
          </button>
        </div>
      </div>

      {/* Quiz Box */}
      <div className="max-w-2xl w-full bg-white/10 p-6 rounded-xl shadow-lg">
        <p className="text-lg font-medium mb-4">{currentQ.question}</p>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              className={`block w-full text-left px-4 py-2 rounded ${
                selectedOption === opt
                  ? "bg-yellow-400 text-black"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {!timerPerQuestion && (
            <button
              disabled={current === 0}
              onClick={handleBack}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                current === 0
                  ? "bg-white/10 text-gray-300 cursor-not-allowed"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded bg-white/20 hover:bg-white/30"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
