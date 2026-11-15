import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Panel } from '../components/Panel';
import { EmptyState } from '../components/EmptyState';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './DashboardStaf.css';

const mockStats = [
  { label: 'Jumlah Obat', value: '1.245', icon: 'mdi:pill' },
  { label: 'Antrean Pesanan', value: '38', icon: 'mdi:file-document' },
  { label: 'Obat Masuk Hari Ini', value: '12', icon: 'fluent:arrow-enter-16-filled' },
  { label: 'Obat Menipis', value: '5', icon: 'ant-design:warning-filled' },
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

const mockNotifications = [
  'Obat aspirin stok menipis (sisa 2 dus)',
  'Batch paracetamol kadaluarsa 27-09-2026',
  'Pesanan dari Apotek Sejahtera sudah diterima',
];

export function DashboardStaf() {
  const { user } = useAuth();

  return (
    <div className="dashboard-staf">
      <PageHeader 
        title="Dashboard Staf" 
        subtitle=""
        role={user?.role}
      />
      
      <div className="stats-row">
        {mockStats.map((stat) => (
          <StatCard 
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="panels-row">
        <Panel title="Grafik Transaksi" className="panel-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-soft)" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar 
                dataKey="transaksi" 
                fill="var(--color-chart-bar)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Notifikasi" className="panel-notif">
          {mockNotifications.length > 0 ? (
            <div className="notif-list">
              {mockNotifications.map((notif, idx) => (
                <div key={idx} className="notif-item text-table-body">
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
