import { createContext, useContext, useEffect, useState } from "react";

import { loginUser, registerUser } from "../services/authService";

const TOKEN_KEY = "ai_resume_token";
const USER_KEY = "ai_resume_user";

const AuthContext = createContext(null);

const readUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readUserFromStorage());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  const persistSession = (session) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleExpiredSession = () => {
      clearSession();
    };

    window.addEventListener("auth:expired", handleExpiredSession);
    setLoading(false);

    return () => {
      window.removeEventListener("auth:expired", handleExpiredSession);
    };
  }, []);

  const login = async (credentials) => {
    const session = await loginUser(credentials);
    persistSession(session);
    return session;
  };

  const register = async (payload) => {
    const session = await registerUser(payload);
    persistSession(session);
    return session;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout: clearSession,
    isAuthenticated: Boolean(token && user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
