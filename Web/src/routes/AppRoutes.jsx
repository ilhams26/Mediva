import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppShell } from '../layouts/AppShell';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleSelector } from '../pages/RoleSelector';
import { Dashboard } from '../pages/Dashboard';
import { KelolaObat } from '../pages/KelolaObat';
import { KelolaUser } from '../pages/KelolaUser';

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<RoleSelector />} />
      
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/obat"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <AppShell>
                <KelolaObat />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/pengguna"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={['admin']}>
              <AppShell>
                <KelolaUser />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
