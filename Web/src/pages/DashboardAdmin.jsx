import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Panel } from '../components/Panel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './DashboardAdmin.css';

const mockStatsAdmin = [
  { label: 'Pendapatan Bulan Ini', value: 'Rp 45.000.000', icon: 'mdi:cash' },
  { label: 'Total Obat Real', value: '3.200', icon: 'mdi:package' },
  { label: 'Pesanan Selesai', value: '156', icon: 'mdi:check-circle' },
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

const mockDonutData = [
  { name: 'Transfer Bank', value: 45, fill: '#1565c0' },
  { name: 'E-Wallet', value: 30, fill: '#42a5f5' },
  { name: 'Tunai', value: 25, fill: '#90caf9' },
];

export function DashboardAdmin() {
  const { user } = useAuth();

  return (
    <div className="dashboard-admin">
      <PageHeader 
        title="Dashboard Admin" 
        subtitle=""
        role={user?.role}
      />
      
      <div className="stats-row">
        {mockStatsAdmin.map((stat) => (
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

        <Panel title="Metode Pembayaran" className="panel-donut">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockDonutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={false}
              >
                {mockDonutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-legend">
            {mockDonutData.map((item) => (
              <div key={item.name} className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: item.fill }}></div>
                <span className="text-table-body">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
