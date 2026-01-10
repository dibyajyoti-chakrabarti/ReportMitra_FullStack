import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait for auth to fully settle
    if (!isLoading && !hasChecked) {
      setHasChecked(true);
      
      // Give a small delay to ensure backend sync completes
      setTimeout(() => {
        if (!isAuthenticated) {
          console.error("Authentication failed after callback");
          navigate("/login");
        } else {
          navigate("/");
        }
      }, 500); // Small delay to let backend sync finish
    }
  }, [isLoading, isAuthenticated, hasChecked, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Completing authentication...
        </h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        {isLoading && <p className="mt-4 text-gray-600">Syncing with server...</p>}
      </div>
    </div>
  );
};

export default Callback;