// src/components/Navbar.jsx
import { useAuth } from "../AuthProvider";
import { Link } from "react-router-dom";
import logo_1 from "../assets/logo-1.png";
import logo_2 from "../assets/logo-2.png";

const Navbar = () => {
  const { user, login, register, logout, isAuthenticated, isLoading } =
    useAuth();

  const handleLogin = async () => {
    await login();
  };

  const handleRegister = async () => {
    await register();
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <header className="bg-black text-white p-4 overflow-y-hidden shadow-md w-full overflow-x-hidden fixed top-0 left-0 z-50">
        <div className="max-w-screen-xl flex justify-between items-center">
          <div className="text-xl font-bold">ReportMitra</div>
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-black text-white px-4 shadow-md w-full overflow-x-hidden overflow-y-hidden fixed top-0 left-0 z-50">
      <div className="w-full flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 py-2">
          <img src={logo_1} alt="" className="w-16 h-16" />
          <img src={logo_2} alt="" className="h-12" />
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/report"
                className="hover:text-blue-200 transition duration-200"
              >
                Report Issue
              </Link>
              <Link
                to="/track"
                className="hover:text-blue-200 transition duration-200"
              >
                Track Complaints
              </Link>
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="hover:text-blue-200 transition duration-200"
                >
                  {user?.email || user?.given_name || "Profile"}
                  {user?.is_verified && (
                    <span className="ml-1 text-green-300">✓</span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-black px-3 py-1 rounded transition duration-200"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 font-bold">
              <button
                onClick={handleLogin}
                className="px-3 py-1 transition duration-200 cursor-pointer hover:underline text-2xl"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="px-3 py-1 transition duration-200 cursor-pointer hover:underline text-2xl"
              >
                Sign Up
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
