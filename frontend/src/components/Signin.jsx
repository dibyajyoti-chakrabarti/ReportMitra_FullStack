import { useAuth } from "../AuthProvider";
import { useState, useEffect } from "react";
import { Mail, Lock, User, Home, Leaf, Shield, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import SignupImage from "../assets/signup-illustration.png"

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
              ILLUSTRATION NEEDED: Signup/Registration illustration
              - Storyset.com > Nature Illustrations > Simple Background
              - Colors: Green tones (#10B981, #059669)
              - Style: Person joining community / Welcome gesture / New user onboarding
              - Save as: signup-illustration.png
            */}
            <img 
              src={SignupImage}
              alt="Join JanSaathi" 
              className="w-full h-auto max-h-96 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4 max-w-md">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Free forever - no hidden charges</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Your data is secure and private</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold">Make a real impact in your city</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
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

            {/* Signup Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join JanSaathi and start making a difference</p>
            </div>

            {/* Google Signup */}
            <div className="mb-6">
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={handleGoogleError}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signup_with"
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
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with email</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium mb-4">
                {error}
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleEmailSignup} className="space-y-5">
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-lg font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                Sign In
              </a>
            </div>

            {/* Terms & Footer */}
            <div className="mt-8 space-y-3">
              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{" "}
                <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
              </p>
              <div className="text-center space-y-1">
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
    </div>
  );
};

export default Signin;