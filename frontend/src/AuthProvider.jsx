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
      logoutUri={import.meta.env.VITE_KINDE_LOGOUT_REDIRECT_URI}
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

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isAuthenticated && kindeUser) {
        setIsSyncing(true);
        try {
          const token = await getToken();
          // Sync with Django backend
          const response = await fetch(getApiUrl('/users/profile/'), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const userProfile = await response.json();
            setBackendUser({ ...kindeUser, ...userProfile });
          } else {
            setBackendUser(kindeUser);
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
          setBackendUser(kindeUser);
        } finally {
          setIsSyncing(false);
        }
      } else {
        setBackendUser(null);
      }
    };

    syncUserWithBackend();
  }, [isAuthenticated, kindeUser, getToken]);

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
    getAuthHeaders,
    isAuthenticated,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};