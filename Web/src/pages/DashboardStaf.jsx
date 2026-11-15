import {
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Panel } from '../components/Panel';
import { EmptyState } from '../components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockStats = [
  { label: 'Jumlah Obat', value: '128', icon: ArchiveBoxIcon },
  { label: 'Antrean Pesanan', value: '5', icon: ClipboardDocumentListIcon },
  { label: 'Obat Masuk', value: '23', icon: CubeIcon },
  { label: 'Obat Menipis', value: '8', icon: ExclamationTriangleIcon },
];

const mockChartData = [
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
        <Panel title="Grafik Transaksi" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockChartData}>
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
          {mockNotifications.length > 0 ? (
            <div className="space-y-2">
              {mockNotifications.map((notif, idx) => (
                <div key={idx} className="text-xs text-mediva-muted">
                  • {notif}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Belum ada notifikasi" />
          )}
        </Panel>
      </div>
    </div>
  );
}
