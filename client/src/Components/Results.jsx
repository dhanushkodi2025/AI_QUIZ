import { useLocation, useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizName, answers } = location.state || {};

  if (!answers || answers.length === 0) {
    return (
      <div className="text-center text-white p-6 bg-red-500">
        No result data found.
        <button onClick={() => navigate("/")} className="ml-2 underline">Go Home</button>
      </div>
    );
  }

  const score = answers.filter(ans => ans.isCorrect).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white p-10">
      <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4">Results for: {quizName}</h1>
        <h2 className="text-xl mb-6 text-yellow-300">Score: {score} / {answers.length}</h2>

        {answers.map((item, idx) => (
          <div key={idx} className="mb-4 border-b border-white/20 pb-4">
            <p className="font-semibold">Q{idx + 1}. {item.question}</p>
            <p className={`mt-1 ${item.selected === item.correct ? "text-green-400" : "text-red-400"}`}>
              Your Answer: {item.selected}
            </p>
            {item.selected !== item.correct && (
              <p className="text-green-300">Correct Answer: {item.correct}</p>
            )}
          </div>
        ))}

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-yellow-400 text-purple-800 px-6 py-2 rounded-full hover:bg-yellow-300"
        >
          Home
        </button>
      </div>
    </div>
  );
};
export default Results;
