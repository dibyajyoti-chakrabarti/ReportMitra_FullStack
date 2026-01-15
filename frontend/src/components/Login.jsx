import { useAuth } from "../AuthProvider";
import { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Check, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { getApiUrl } from "../utils/api";
import logo from "../assets/logo-1.png";

const Login = () => {
  const { loginWithEmail, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(getApiUrl("/users/request-otp/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: otpEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setOtpTimer(600);
        setError("");
      } else {
        setError(data.email?.[0] || data.error || "Failed to send code");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(getApiUrl("/users/verify-otp/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: otpEmail, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);
        window.location.href = "/";
      } else {
        setError(
          data.otp?.[0] || data.email?.[0] || data.error || "Invalid code"
        );
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setError("");
    try {
      await loginWithGoogle(credentialResponse);
      navigate("/");
    } catch (error) {
      setError(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login was cancelled or failed");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
                Secure Login
              </h2>
            </div>

            <div className="px-4 py-6 sm:px-6 sm:py-8 space-y-5">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
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
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
                <button
                  onClick={() => {
                    setLoginMethod("password");
                    setError("");
                    setOtpSent(false);
                  }}
                  className={`flex-1 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all ${
                    loginMethod === "password"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Password
                </button>
                <button
                  onClick={() => {
                    setLoginMethod("otp");
                    setError("");
                  }}
                  className={`flex-1 py-2 sm:py-2.5 rounded-md text-sm sm:text-base font-semibold transition-all ${
                    loginMethod === "otp"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Email Code
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {loginMethod === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20 mt-4 sm:mt-6"
                  >
                    {isLoading ? (
                      "Signing in..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        Sign In with Password
                      </>
                    )}
                  </button>
                </form>
              )}

              {loginMethod === "otp" && !otpSent && (
                <form onSubmit={handleRequestOTP} className="space-y-4">
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
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 text-sm sm:text-base bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                        placeholder="your.email@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20"
                  >
                    {isLoading ? (
                      "Sending code..."
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Login Code
                      </>
                    )}
                  </button>
                </form>
              )}

              {loginMethod === "otp" && otpSent && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm flex items-start gap-2">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Code sent to {otpEmail}</p>
                      <p className="text-xs mt-1">
                        Check your email for the 6-digit code
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all text-center text-xl sm:text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      required
                      disabled={isLoading}
                      maxLength={6}
                    />
                  </div>

                  {otpTimer > 0 && (
                    <p className="text-xs sm:text-sm text-gray-400 text-center">
                      Code expires in{" "}
                      <span className="font-mono font-semibold text-white">
                        {formatTime(otpTimer)}
                      </span>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-white text-black py-2.5 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="w-full text-gray-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    Use a different email
                  </button>
                </form>
              )}

              <div className="text-center text-xs sm:text-sm text-gray-400 pt-2">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-white hover:underline font-semibold transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Secure government portal • All activities are monitored
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

export default Login;