// src/components/Signin.jsx
import { useAuth } from '../AuthProvider';
import Navbar from './Navbar';
import { useEffect } from 'react';

const Signin = () => {
  const { register, isLoading, isAuthenticated } = useAuth();

  const handleRegister = async () => {
    try {
      await register();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     window.location.href = '/';
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Join ReportMitra</h2>
          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Redirecting...' : 'Sign Up with Kinde'}
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <button
              onClick={() => window.location.href = '/login'}
              className="text-blue-600 hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;