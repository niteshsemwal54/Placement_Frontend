import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("authToken");
    const u = localStorage.getItem("authUser");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
    setLoading(false);
  }, []);

  function saveSession(t, u) {
    setToken(t);
    setUser(u || null);
    if (t) localStorage.setItem("authToken", t); else localStorage.removeItem("authToken");
    if (u) localStorage.setItem("authUser", JSON.stringify(u)); else localStorage.removeItem("authUser");
  }

  function logout() {
    saveSession(null, null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
