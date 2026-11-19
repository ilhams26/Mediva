import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../layouts/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleSelector } from "../pages/RoleSelector";
import { Dashboard } from "../pages/Dashboard";
import { KelolaObat } from "../pages/KelolaObat";
import KelolaPengguna from "../pages/KelolaPengguna";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";

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
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppShell>
                <KelolaPengguna />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Cart */}
      <Route
        path="/kasir"
        element={
          <ProtectedRoute allowedRoles={["staf"]}>
            <AppShell>
              <Cart />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={["staf"]}>
            <AppShell>
              <Cart />
            </AppShell>
          </ProtectedRoute>
        }
      />
      
      {/* Checkout */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["staf"]}>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/403"
        element={
          <div className="flex min-h-screen items-center justify-center bg-mediva-page p-5">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-mediva-primaary">403</h1>
              <p className="mt-3 text-mediva-muted">
                Kamu tidak memiliki akses ke halaman ini.
              </p>
              <button
                onClick={() => {
                  window.location.href = "/";
                }}
                className="mt-5 rounded-xl bg-mediva-primary px-6 py-3 text-white"
              >
                Kembali
              </button>
            </div>
          </div>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
