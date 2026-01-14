import { createContext, useContext, useState, useEffect } from "react";
import { getApiUrl } from "./utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await fetch(getApiUrl("/users/me/"), {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            await refreshAccessToken();
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(getApiUrl("/users/token/refresh/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.access);

        const userResponse = await fetch(getApiUrl("/users/me/"), {
          headers: {
            Authorization: `Bearer ${data.access}`,
            "Content-Type": "application/json",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  };

  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("/users/login/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);

        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true, user: data.user };
      } else {
        const errorMessage =
          data.non_field_errors?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          "Login failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("/users/register/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password2: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);

        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true, user: data.user };
      } else {
        const errorMessage =
          data.email?.[0] ||
          data.password?.[0] ||
          data.password2?.[0] ||
          "Registration failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl("/users/google-auth/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.tokens.access);
        localStorage.setItem("refreshToken", data.tokens.refresh);

        setUser(data.user);
        setIsAuthenticated(true);

        return { success: true, user: data.user };
      } else {
        throw new Error(data.error || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        await fetch(getApiUrl("/users/logout/"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch (error) {
        console.error("Logout API call failed:", error);
      }
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const getAuthHeaders = async () => {
    let token = localStorage.getItem("accessToken");

    if (!token) {
      return {
        "Content-Type": "application/json",
      };
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    getAuthHeaders,
    refreshAccessToken,
    login: loginWithEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
