import { useState, useCallback } from "react";
import { AuthContext } from "./auth-context";
import { login as loginApi, logout as logoutApi } from "../services/authService";

function readStoredAuth() {
  const token = sessionStorage.getItem("auth_token");
  const userStr = sessionStorage.getItem("auth_user");
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr), isAuthenticated: true };
    } catch {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
    }
  }
  return { token: null, user: null, isAuthenticated: false };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  const login = useCallback(async (username, password) => {
    const result = await loginApi(username, password);
    const { user, token } = result.data;
    sessionStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_user", JSON.stringify(user));
    setAuth({ token, user, isAuthenticated: true });
    return result;
  }, []);

  const logout = useCallback(async () => {
    const token = sessionStorage.getItem("auth_token");

    // Bersihkan sesi lokal lebih dulu agar UI langsung keluar,
    // jangan menunggu request jaringan (bisa lambat / timeout).
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    setAuth({ token: null, user: null, isAuthenticated: false });

    if (!token) return;

    try {
      await logoutApi(token);
    } catch {
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
