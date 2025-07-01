import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaBolt, FaEdit, FaShareAlt } from "react-icons/fa";
import { SiQuizlet } from "react-icons/si";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Handle Google callback token (fixes double-click issue)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    }
  }, [location]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white flex flex-col items-center justify-between px-4 py-8">
      
      {/* Header / Title */}
      <div className="text-center max-w-2xl mb-8">
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome to <span className="text-yellow-400">Quiz Genie</span>
        </h1>
        <p className="text-lg text-white/90">
          Master topics faster with AI-powered quizzes.
        </p>
        <blockquote className="mt-4 italic text-white/70">
          "Learning made magical — one quiz at a time."
        </blockquote>
      </div>

      {/* Login Box */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-[350px] text-center text-gray-800 mb-12">
        <h2 className="text-2xl font-bold mb-6">Login to continue</h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-2 px-4 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition"
        >
          <FcGoogle size={24} />
          <span className="text-sm font-medium text-gray-700">Login with Google</span>
        </button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl px-4 mb-10">
        <FeatureCard
          icon={<SiQuizlet size={30} />}
          title="Create Quizzes"
          desc="Instantly generate quizzes on any topic with AI."
        />
        <FeatureCard
          icon={<FaShareAlt size={30} />}
          title="Share Easily"
          desc="Send quizzes to friends or students in one click."
        />
        <FeatureCard
          icon={<FaEdit size={30} />}
          title="Fully Customizable"
          desc="Edit questions, set difficulty, and quiz length."
        />
        <FeatureCard
          icon={<FaBolt size={30} />}
          title="AI-Powered"
          desc="Powered by Google Gemini for accurate content."
        />
      </div>

      {/* Footer */}
      <footer className="text-sm text-white/60 py-4 text-center border-t border-white/20 w-full mt-8">
        Developed by <span className="font-semibold text-white">Dhanush Kodi</span> · Contact: 
        <a
          href="mailto:dhanushkodi.dev@gmail.com"
          className="ml-1 underline text-yellow-300 hover:text-yellow-400"
        >
          dhanushkodi.dev@gmail.com
        </a>
      </footer>
    </div>
  );
};

// Reusable Feature Card
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl text-center border border-white/20 shadow-lg hover:scale-105 transition-transform duration-300">
    <div className="text-yellow-300 mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    <p className="text-white/80 text-sm">{desc}</p>
  </div>
);

export default Login;
