import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppShell } from "../layouts/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleSelector } from "../pages/RoleSelector";
import { Dashboard } from "../pages/Dashboard";
import { KelolaObat } from "../pages/KelolaObat";
import TambahObat from "../pages/TambahObat";
import EditObat from "../pages/EditObat";
import KelolaKategori from "../pages/KelolaKategori";
import DataObat from "../pages/DataObat";
import KelolaPengguna from "../pages/KelolaPengguna";
import Kasir from "../pages/Kasir";
import KelolaStok from "../pages/KelolaStok";
import TambahBatch from "../pages/TambahBatch";
import AdjustStok from "../pages/AdjustStok";
import RiwayatStok from "../pages/RiwayatStok";
import Laporan from "../pages/Laporan";

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
            <ProtectedRoute allowedRoles={["staf"]}>
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
        path="/obat/tambah"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf"]}>
              <AppShell>
                <TambahObat />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/obat/edit/:id"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf"]}>
              <AppShell>
                <EditObat />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/kategori"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf"]}>
              <AppShell>
                <KelolaKategori />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/stok"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf", "admin"]}>
              <AppShell>
                <KelolaStok />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/stok/tambah"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf", "admin"]}>
              <AppShell>
                <TambahBatch />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/stok/adjust/:id"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf", "admin"]}>
              <AppShell>
                <AdjustStok />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/stok/riwayat"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf", "admin"]}>
              <AppShell>
                <RiwayatStok />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/laporan"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["staf", "admin"]}>
              <AppShell>
                <Laporan />
              </AppShell>
            </ProtectedRoute>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/obat/data"
        element={
          isAuthenticated ? (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AppShell>
                <DataObat />
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
              <Kasir />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <Navigate to="/kasir" replace />}
        />

      <Route
        path="/checkout"
        element={<Navigate to="/kasir" replace />}
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
