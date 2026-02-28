import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContextObject";
import { userService } from "../services/userService";

const USER_KEY = "user";
const TOKEN_KEY = "token";

const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((userData, token) => {
    if (userData) localStorage.setItem(USER_KEY, JSON.stringify(userData));
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }, []);

  const login = useCallback(
    (data) => {
      const { user: userData, token } = data;
      persistUser(userData, token);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      const { data } = await userService.getProfile();
      if (data?.user) {
        const u = data.user;
        persistUser({ ...u, id: u.id || u._id }, token);
      }
    } catch {
      logout();
    }
  }, [persistUser, logout]);

useEffect(() => {
  const init = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
