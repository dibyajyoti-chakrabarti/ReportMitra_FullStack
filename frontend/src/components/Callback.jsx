import { useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (isAuthenticated && user) {
  //       // Successfully authenticated, redirect to home
  //       navigate('/');
  //     } else {
  //       // Authentication failed, redirect to login
  //       navigate('/login');
  //     }
  //   }
  // }, [isLoading, isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default Callback;