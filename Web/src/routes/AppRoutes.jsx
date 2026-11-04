import { Routes, Route } from "react-router-dom";
import LoginAdmin from "../pages/LoginAdmin";
import DashboardAdmin from "../pages/DashboardAdmin";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardAdmin />} />
      <Route path="/login" element={<LoginAdmin />} />
    </Routes>
  );
}