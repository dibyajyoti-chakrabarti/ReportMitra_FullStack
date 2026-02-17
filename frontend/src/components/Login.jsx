import { useAuth } from "../AuthProvider";
import { useState, useEffect } from "react";
import { Mail, Lock, User, ArrowRight, Check, Home, Leaf, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { getApiUrl } from "../utils/api";
import LoginImage from "../assets/login-illustration.png"

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
        if (data.code === "ACCOUNT_DEACTIVATED") {
          setError(
            data.activation_time
              ? `Account activates on ${data.activation_time}`
              : "Account is temporarily deactivated."
          );
          return;
        }
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
    <div className="min-h-screen h-screen flex bg-white overflow-hidden">
      {/* Left Side - Illustration & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 py-16">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <Leaf className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900">JanSaathi</h1>
                <p className="text-xs font-semibold text-emerald-600 tracking-wide">CIVIC | CONNECT | RESOLVE</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center max-w-lg">
            {/* 
              ILLUSTRATION NEEDED: Login illustration
              - Storyset.com > Nature Illustrations > Simple Background
              - Colors: Green tones (#10B981, #059669)
              - Style: Person logging in securely / Shield with checkmark / Secure access
              - Save as: login-illustration.png
            */}
            <img 
              src={LoginImage}
              alt="Secure Login" 
              className="w-full h-auto max-h-96 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4 max-w-md">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Secure government-verified platform</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Track your complaints in real-time</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Join 8,200+ active citizens</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 right-6 flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors z-20 bg-white hover:bg-emerald-50 px-4 py-2 rounded-lg border border-gray-200 hover:border-emerald-300"
        >
          <Home className="w-5 h-5" />
          <span className="text-sm font-semibold">Home</span>
        </button>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-black text-gray-900">JanSaathi</h1>
                  <p className="text-[10px] font-semibold text-emerald-600 tracking-wide">CIVIC | CONNECT | RESOLVE</p>
                </div>
              </div>
            </div>

            {/* Login Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue to JanSaathi</p>
            </div>

            {/* Google Login */}
            <div className="mb-6">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
                width="100%"
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Login Method Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setLoginMethod("password")}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                  loginMethod === "password"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Password
              </button>
              <button
                onClick={() => {
                  setLoginMethod("otp");
                  setOtpSent(false);
                  setError("");
                }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
                  loginMethod === "otp"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Email Code
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
                {error}
              </div>
            )}

            {/* Password Login Form */}
            {loginMethod === "password" && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* OTP Request Form */}
            {loginMethod === "otp" && !otpSent && (
              <form onSubmit={handleRequestOTP} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? "Sending code..." : (
                    <>
                      <ArrowRight className="w-5 h-5" />
                      Send Login Code
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP Verification Form */}
            {loginMethod === "otp" && otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Code sent to {otpEmail}</p>
                    <p className="text-xs mt-1">Check your email for the 6-digit code</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center text-2xl tracking-widest font-mono font-bold"
                    placeholder="000000"
                    required
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>

                {otpTimer > 0 && (
                  <p className="text-sm text-gray-600 text-center">
                    Code expires in{" "}
                    <span className="font-mono font-bold text-emerald-600">
                      {formatTime(otpTimer)}
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
                  className="w-full text-gray-600 hover:text-emerald-600 text-sm font-semibold transition-colors"
                >
                  Use a different email
                </button>
              </form>
            )}

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                Sign Up
              </a>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-1">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secure government portal
              </p>
              <p className="text-xs text-gray-400">
                © 2026 JanSaathi • Government of India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
