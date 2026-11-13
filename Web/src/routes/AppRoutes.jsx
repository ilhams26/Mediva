import { Routes, Route, Navigate } from "react-router-dom";
import LoginAdmin from "../pages/LoginAdmin";
import DashboardAdmin from "../pages/DashboardAdmin";
import KelolaPengguna from "../pages/KelolaPengguna";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardAdmin />} />
      <Route path="/login" element={<LoginAdmin />} />
      <Route path="/kelola-pengguna" element={<KelolaPengguna />} />
    </Routes>
  );
}
