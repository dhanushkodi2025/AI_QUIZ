import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./Components/Login";
import Home from "./Components/Home";
import QuizPage from "./Components/QuizPage";
import Profile from "./Components/Profile";
import Results from "./Components/Results";
import Layout from "./Components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
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
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      handleToken(token);
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) handleToken(storedToken);
    }
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Layout user={user}><Home user={user} /></Layout>} />
      <Route path="/quiz" element={<Layout user={user}><QuizPage /></Layout>} />
      <Route path="/results" element={<Layout user={user}><Results /></Layout>} />
      <Route path="/profile" element={<Layout user={user}><Profile /></Layout>} />
    </Routes>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
