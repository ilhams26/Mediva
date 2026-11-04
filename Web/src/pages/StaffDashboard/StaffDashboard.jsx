
import StatCard from "../../components/dashboard/StatCard.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import {
  Pill,
  ShoppingCart,
  PackagePlus,
  TriangleAlert,
} from "lucide-react";

function StaffDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            Mediva / Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Dashboard Staff
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Selamat datang di halaman dashboard staff Mediva.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Obat"
            value="128"
            icon={<Pill size={26} />}
          />

          <StatCard
            title="Pesanan"
            value="0"
            icon={<ShoppingCart size={26} />}
          />

          <StatCard
            title="Obat Masuk"
            value="50"
            icon={<PackagePlus size={26} />}
          />

          <StatCard
            title="Obat Menipis"
            value="3"
            icon={<TriangleAlert size={26} />}
          />
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;
