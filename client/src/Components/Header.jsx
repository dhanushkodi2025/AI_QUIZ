// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Header = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-400 tracking-wide">
          Quiz Genie
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-yellow-300">Home</Link>
          <Link to="/history" className="text-white hover:text-yellow-300">History</Link>
          <Link to="/contact" className="text-white hover:text-yellow-300">Contact</Link>
          <Link to="/profile" className="text-white hover:text-yellow-300">Profile</Link>

          {user && (
            <div className="flex items-center space-x-4 ml-6">
                <button
                onClick={handleLogout}
                className="text-white hover:text-yellow-300 font-medium"
              >
                Logout
              </button>
              <span className="text-white font-medium">{user.name}</span>
              
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-indigo-900 px-4 pb-4 text-white">
          <nav className="flex flex-col space-y-3">
            <Link to="/" className="hover:text-yellow-300">Home</Link>
            <Link to="/history" className="hover:text-yellow-300">History</Link>
            <Link to="/contact" className="hover:text-yellow-300">Contact</Link>

            {user && (
              <div className="flex flex-col mt-4 space-y-2">
                <span className="text-white font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-200 hover:text-red-400 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
