import { useState } from 'react';
import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Panel } from '../components/Panel';
import { EmptyState } from '../components/EmptyState';
import { ChartDateFilter } from '../components/ChartDateFilter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockStats = [
  { label: 'Jumlah Obat', value: '128', icon: ArchiveBoxIcon },
  { label: 'Antrean Pesanan', value: '5', icon: ClipboardDocumentListIcon },
  { label: 'Obat Masuk', value: '23', icon: CubeIcon },
  { label: 'Obat Menipis', value: '8', icon: ExclamationTriangleIcon },
];

const mockDefaultChartData = [
  { tanggal: '21 Sep', transaksi: 120 },
  { tanggal: '22 Sep', transaksi: 200 },
  { tanggal: '23 Sep', transaksi: 150 },
  { tanggal: '24 Sep', transaksi: 280 },
  { tanggal: '25 Sep', transaksi: 190 },
  { tanggal: '26 Sep', transaksi: 240 },
  { tanggal: '27 Sep', transaksi: 220 },
];

const mockNotifications = [];

export function DashboardStaf() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState(mockDefaultChartData);

  const handleFilter = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      setChartData([
        { tanggal: '08:00', transaksi: 25 },
        { tanggal: '10:00', transaksi: 64 },
        { tanggal: '12:00', transaksi: 95 },
        { tanggal: '14:00', transaksi: 52 },
        { tanggal: '16:00', transaksi: 110 },
        { tanggal: '18:00', transaksi: 78 },
        { tanggal: '20:00', transaksi: 35 },
      ]);
      return;
    }

    const step = diffDays > 14 ? Math.ceil(diffDays / 10) : 1;
    const result = [];
    const curr = new Date(start);

    while (curr <= end) {
      const label = curr.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      const seed = curr.getDate() * 17 + (curr.getMonth() + 1) * 31;
      const value = 90 + (seed % 150);
      result.push({ tanggal: label, transaksi: value });
      curr.setDate(curr.getDate() + step);
    }

    setChartData(result.length > 0 ? result : mockDefaultChartData);
  };

  const handleReset = () => {
    setChartData(mockDefaultChartData);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Staff" 
        subtitle="Pantauan aktivitas hari ini"
        role={user?.role}
      />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel 
          title="Grafik Transaksi"
          action={<ChartDateFilter onFilter={handleFilter} onReset={handleReset} />}
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6e8fa" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10, fill: '#4a6f9c' }} />
              <YAxis tick={{ fontSize: 10, fill: '#4a6f9c' }} />
              <Tooltip />
              <Bar 
                dataKey="transaksi" 
                fill="#42a5f5" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Notifikasi" className="lg:col-span-1">
          {mockNotifications.length === 0 ? (
            <EmptyState message="Tidak ada notifikasi baru" />
          ) : (
            <div className="space-y-3">
              {mockNotifications.map((notif, index) => (
                <div key={index} className="flex items-start gap-3 rounded-[12px] bg-mediva-chip p-3">
                  <div className="text-sm font-medium text-mediva-text">{notif.title}</div>
                  <div className="text-xs text-mediva-muted">{notif.time}</div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
