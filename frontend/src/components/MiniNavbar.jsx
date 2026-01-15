import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import logo_1 from "../assets/logo-1.png";
import logo_2 from "../assets/logo-2.png";
import { Menu, X } from "lucide-react";

const MiniNavbar = () => {
  const { logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <header className="bg-black text-white p-4 shadow-md w-full">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">ReportMitra</div>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black text-white px-4 py-2 shadow-md w-full">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold py-1 hover:opacity-80 transition"
        >
          <img src={logo_1} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16" />
          <img src={logo_2} alt="logo" className="h-8 sm:h-12" />
        </Link>

        <nav className="hidden md:flex items-center font-bold text-xl lg:text-2xl gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/report" className="hover:underline transition">
                Report
              </Link>
              <Link to="/track" className="hover:underline transition">
                Track
              </Link>
              <Link to="/history" className="hover:underline transition">
                History
              </Link>
              <Link to="/profile" className="hover:underline transition">
                Profile
              </Link>
              <Link to="/community" className="hover:underline transition">
                Community
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="hover:underline cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden bg-black text-white font-bold text-lg flex flex-col items-center gap-4 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 py-4" : "max-h-0 py-0"
        }`}
      >
        {isAuthenticated ? (
          <>
            <Link
              to="/report"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Report
            </Link>
            <Link
              to="/track"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Track
            </Link>
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              History
            </Link>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Profile
            </Link>
            <Link
              to="/community"
              onClick={() => setMenuOpen(false)}
              className="hover:underline"
            >
              Community
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                handleLogin();
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleRegister();
                setMenuOpen(false);
              }}
              className="hover:underline"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default MiniNavbar;