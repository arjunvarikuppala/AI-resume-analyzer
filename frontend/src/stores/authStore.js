import { create } from "zustand";

import { loginUser, registerUser } from "../services/authService";

const TOKEN_KEY = "ai_resume_token";
const USER_KEY = "ai_resume_user";

const readUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const readTokenFromStorage = () => localStorage.getItem(TOKEN_KEY);

const storedUser = readUserFromStorage();
const storedToken = readTokenFromStorage();

const persistSession = (session) => {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
};

const clearStoredSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  loading: false,
  isAuthenticated: Boolean(storedToken && storedUser),

  login: async (credentials) => {
    const session = await loginUser(credentials);
    persistSession(session);

    set({
      user: session.user,
      token: session.token,
      isAuthenticated: true,
    });

    return session;
  },

  register: async (payload) => {
    const session = await registerUser(payload);
    persistSession(session);

    set({
      user: session.user,
      token: session.token,
      isAuthenticated: true,
    });

    return session;
  },

  logout: () => {
    clearStoredSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
