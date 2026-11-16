import { createContext, useState, useCallback, useEffect } from "react";
import { login as loginApi, logout as logoutApi } from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
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
  });

  const login = useCallback(async (username, password) => {
    const result = await loginApi(username, password);
    const { user, token } = result.data;
    sessionStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_user", JSON.stringify(user));
    setAuth({ token, user, isAuthenticated: true });
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // token may already be invalid
    }
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    setAuth({ token: null, user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
