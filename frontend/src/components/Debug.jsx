// KABHI BHI NOT TO PUSH IN DEPLOYMENT(FOR MANUAL DEBUGGING)
import { useAuth } from '../AuthProvider';

const DebugToken = () => {
  const { getToken, user, isAuthenticated } = useAuth();

  const handleGetToken = async () => {
    try {
      const token = await getToken();
      console.log('Token:', token);
      // Copy to clipboard
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard! Check console for details.');
    } catch (error) {
      console.error('Error getting token:', error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Debug Token</h3>
      <button 
        onClick={handleGetToken}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Copy Token to Clipboard
      </button>
    </div>
  );
};

export default DebugToken;