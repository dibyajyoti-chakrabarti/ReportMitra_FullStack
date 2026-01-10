// src/components/Login.jsx
import { useAuth } from '../AuthProvider';
import { useState, useEffect } from 'react';
import { Shield, Mail, Chrome, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithEmail, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }

          .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .slide-in {
            animation: slideIn 0.5s ease-out forwards;
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-[0.03] rounded-full blur-3xl"></div>

        {/* Main container */}
        <div className="relative z-10 w-full max-w-md fade-in">
          {/* Logo/Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-lg shadow-white/20">
              <Shield className="w-8 h-8 text-black" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              ReportMitra
            </h1>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
              CIVIC | CONNECT | RESOLVE
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-effect rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-white/10">
              <h2 className="text-black text-xl font-bold text-center">
                Secure Login
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-8 sm:px-8 sm:py-10 space-y-6">
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 shadow-lg shadow-white/10"
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-black text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                      placeholder="your.email@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 transition-all"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/20"
                >
                  <Mail className="w-5 h-5" />
                  {isLoading ? 'Signing in...' : 'Sign In with Email'}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center text-sm text-gray-400 pt-2">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-white hover:underline font-semibold transition-colors"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-xs text-gray-500">
              Secure government portal • All activities are monitored
            </p>
            <p className="text-xs text-gray-600">
              © 2025 ReportMitra • Government of India
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;