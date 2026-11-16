import {
  BanknotesIcon,
  CubeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { Panel } from '../components/Panel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockStatsAdmin = [
  { label: 'Pendapatan Bulan Ini', value: 'Rp 12.400.000', icon: BanknotesIcon },
  { label: 'Total Obat Real', value: '1.240', icon: CubeIcon },
  { label: 'Pesanan Selesai', value: '89', icon: CheckCircleIcon },
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

const mockDonutData = [
  { name: 'Transfer', value: 45, fill: '#1565c0' },
  { name: 'Cash', value: 35, fill: '#42a5f5' },
  { name: 'QRIS', value: 20, fill: '#90caf9' },
];

export function DashboardAdmin() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Admin" 
        subtitle="Pantauan aktivitas hari ini"
        role={user?.role}
      />
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockStatsAdmin.map((stat) => (
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

        <Panel title="Metode Pembayaran" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie
                data={mockDonutData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                label={false}
              >
                {mockDonutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {mockDonutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-mediva-muted">{item.name}</span>
                <span className="ml-auto text-xs font-semibold text-mediva-text">{item.value}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
