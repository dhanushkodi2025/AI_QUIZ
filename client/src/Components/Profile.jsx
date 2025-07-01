import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[350px] text-center">
        <h1 className="text-2xl font-bold mb-4">👤 Profile Page</h1>
        {user ? (
          <p className="text-lg">Hello, <span className="font-semibold">{user.name}</span>!</p>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
