import { useAuth } from "../AuthProvider";
import { useState, useEffect } from "react";
import { Mail, Lock, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo-1.png";

const Signin = () => {
  const { loginWithGoogle, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await register(formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      setError(error.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle(credentialResponse);
      navigate("/profile");
    } catch (error) {
      setError(error.message || "Google sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google signup was cancelled or failed");
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl"></div>

        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group z-20"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-medium">Home</span>
        </button>

        <div className="relative z-10 w-full max-w-md fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={logo} alt="ReportMitra Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
              ReportMitra
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">
              CIVIC | CONNECT | RESOLVE
            </p>
          </div>

          <div className="glass-effect rounded-2xl overflow-hidden">
            <div className="bg-white px-6 py-3 sm:py-4 border-b border-white/10">
              <h2 className="text-black text-lg sm:text-xl font-bold text-center">
                Create Account
              </h2>
            </div>

            <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-5">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  logo_alignment="left"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-gray-400">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20 mt-4 sm:mt-6"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="text-center text-xs sm:text-sm text-gray-400 pt-2">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-white hover:underline font-semibold transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
            <p className="text-xs text-gray-600">
              © 2026 ReportMitra • Government of India
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signin;