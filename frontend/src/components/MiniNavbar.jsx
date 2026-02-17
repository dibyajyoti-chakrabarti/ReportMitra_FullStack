import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import logo_1 from "../assets/logo-1.png";
import logo_2 from "../assets/logo-2.png";
import { Menu, X, Leaf } from "lucide-react";

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
      <header className="bg-white border-b border-emerald-100 shadow-sm w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">JanSaathi</div>
          <div className="text-gray-600">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/98 backdrop-blur-md border-b border-emerald-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 font-bold py-1 hover:opacity-90 transition-opacity group"
        >
          {/* 
            NEW LOGO NEEDED - See LOGO_PROMPT.md for AI generation prompt
            For now, using a green leaf icon as placeholder
          */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">JanSaathi</span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 leading-tight tracking-wide">CIVIC | CONNECT | RESOLVE</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center font-semibold text-base lg:text-lg gap-6 lg:gap-8">
          {isAuthenticated ? (
            <>
              <Link 
                to="/report" 
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                Report
              </Link>
              <Link 
                to="/track" 
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                Track
              </Link>
              <Link 
                to="/history" 
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                History
              </Link>
              <Link 
                to="/profile" 
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                Profile
              </Link>
              <Link 
                to="/community" 
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
              >
                Community
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="text-gray-700 hover:text-emerald-600 transition-colors duration-200 font-semibold"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                Sign Up
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-emerald-50 transition text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t border-emerald-100 text-gray-700 font-semibold text-base flex flex-col items-center gap-4 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-96 py-6" : "max-h-0 py-0"
        }`}
      >
        {isAuthenticated ? (
          <>
            <Link
              to="/report"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors w-full text-center py-2 hover:bg-emerald-50 rounded"
            >
              Report
            </Link>
            <Link
              to="/track"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors w-full text-center py-2 hover:bg-emerald-50 rounded"
            >
              Track
            </Link>
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors w-full text-center py-2 hover:bg-emerald-50 rounded"
            >
              History
            </Link>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors w-full text-center py-2 hover:bg-emerald-50 rounded"
            >
              Profile
            </Link>
            <Link
              to="/community"
              onClick={() => setMenuOpen(false)}
              className="hover:text-emerald-600 transition-colors w-full text-center py-2 hover:bg-emerald-50 rounded"
            >
              Community
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-lg transition-all duration-200 shadow-sm"
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
              className="hover:text-emerald-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => {
                handleRegister();
                setMenuOpen(false);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-lg transition-all duration-200 shadow-sm"
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