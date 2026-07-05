import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthToken, getAuthUser, saveAuthSession } from "../utils/authUtils.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getAuthToken();
    const u = getAuthUser();
    setToken(t);
    setUser(u);
    setLoading(false);
  }, []);

  function login(sessionToken, sessionUser) {
    setToken(sessionToken);
    setUser(sessionUser);
    saveAuthSession(sessionToken, sessionUser);
  }

  function logout() {
    setToken(null);
    setUser(null);
    clearAuthSession();
    navigate("/login", { replace: true });
  }

  const isAuthenticated = useMemo(() => Boolean(token && user), [token, user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
