// src/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { KindeProvider, useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { getApiUrl } from './utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  return (
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_DOMAIN}
      redirectUri={import.meta.env.VITE_KINDE_REDIRECT_URI}
      logoutUri={import.meta.env.VITE_KINDE_LOGOUT_URI}
      onRedirectCallback={(user, appState) => {
        if (import.meta.env.DEV) {
          console.log('Redirect callback', user, appState);
        }
      }}
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </KindeProvider>
  );
};

const AuthProviderInner = ({ children }) => {
  const {
    isLoading: kindeLoading,
    isAuthenticated,
    user: kindeUser,
    login,
    register,
    logout,
    getToken
  } = useKindeAuth();

  const [backendUser, setBackendUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasAttemptedSync, setHasAttemptedSync] = useState(false);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isAuthenticated && kindeUser && !hasAttemptedSync) {
        setBackendUser(kindeUser);
        setIsSyncing(true);
        setHasAttemptedSync(true);
        
        try {
          const token = await getToken();
          console.log('Syncing with backend...');
          
          const response = await fetch(getApiUrl('/users/profile/'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('Backend response status:', response.status);
          
          if (response.ok) {
            const userProfile = await response.json();
            setBackendUser({ ...kindeUser, ...userProfile });
            console.log('Backend sync successful');
          } else {
            console.error('Backend sync failed:', response.status);
            setBackendUser(kindeUser);
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
          setBackendUser(kindeUser);
        } finally {
          setIsSyncing(false);
        }
      } else if (!isAuthenticated) {
        setBackendUser(null);
        setHasAttemptedSync(false);
      }
    };

    syncUserWithBackend();
  }, [isAuthenticated, kindeUser, hasAttemptedSync, getToken]);

  // ADD THIS FUNCTION - it was missing!
  const getAuthHeaders = async () => {
    const token = await getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user: backendUser,
    isLoading: kindeLoading || isSyncing,
    login,
    register,
    logout,
    getAuthHeaders,  // Now it's defined
    isAuthenticated,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};