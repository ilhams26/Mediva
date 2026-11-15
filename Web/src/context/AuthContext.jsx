import { createContext, useState, useCallback, useContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Fake auth data untuk demo — ganti dengan API login nanti
  const [auth, setAuth] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
  });

  const loginFake = useCallback((role) => {
    setAuth({
      token: 'fake-token-' + Date.now(),
      user: { id: 1, name: 'Demo User', role },
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    setAuth({ token: null, user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, loginFake, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
