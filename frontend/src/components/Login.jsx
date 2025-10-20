// src/components/Login.jsx
import { useAuth } from '../AuthProvider';
import Navbar from './Navbar';
import { useEffect } from 'react';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login to ReportMitra</h2>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirecting...' : 'Continue with Kinde'}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <button
              onClick={() => window.location.href = '/signin'}
              className="text-blue-600 hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;