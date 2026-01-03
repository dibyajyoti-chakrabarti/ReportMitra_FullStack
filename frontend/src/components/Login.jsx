// src/components/Login.jsx
import { useAuth } from '../AuthProvider';
import { useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Auto-initiate login on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      handleLogin();
    }
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          @keyframes slideRight {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          .fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          
          .spin {
            animation: spin 1s linear infinite;
          }
          
          .pulse {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .slide-right {
            animation: slideRight 0.5s ease-out forwards;
          }
        `}
      </style>

      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(51, 65, 85) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Main container */}
        <div className="relative z-10 w-full max-w-md px-6 fade-in">
          {/* Government-style header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6 shadow-lg">
              <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">
              ReportMitra
            </h1>
            <p className="text-sm text-slate-600 font-medium uppercase tracking-wider">
              Government of India
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-white text-lg font-semibold text-center">
                Secure Authentication
              </h2>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              {/* Loading indicator */}
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent absolute top-0 left-0 spin"></div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-slate-800 font-semibold text-lg pulse">
                    Redirecting to secure login...
                  </p>
                  <p className="text-slate-600 text-sm">
                    Please wait while we connect you to the authentication service
                  </p>
                </div>

                {/* Progress steps */}
                <div className="w-full space-y-3 pt-4">
                  <div className="flex items-center space-x-3 slide-right" style={{ animationDelay: '0.2s' }}>
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Verifying secure connection</span>
                  </div>
                  <div className="flex items-center space-x-3 slide-right" style={{ animationDelay: '0.4s' }}>
                    <div className="w-5 h-5 border-2 border-blue-600 rounded-full border-t-transparent spin flex-shrink-0"></div>
                    <span className="text-sm text-slate-700">Connecting to authentication service</span>
                  </div>
                  <div className="flex items-center space-x-3 opacity-40 slide-right" style={{ animationDelay: '0.6s' }}>
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-slate-500">Preparing secure session</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-600">
                <Shield className="w-4 h-4" />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              This is a secure government portal. All activities are monitored and logged.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              © 2025 ReportMitra • Ministry of Urban Development
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;