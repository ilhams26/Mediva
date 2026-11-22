import {
  HomeIcon,
  BeakerIcon,
  CubeIcon,
  ChartBarIcon,
  CalculatorIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const NAV = {
  staf: [
    { label: 'Beranda', to: '/', icon: HomeIcon },
    { label: 'Kelola Obat', to: '/obat', icon: BeakerIcon },
    { label: 'Kelola Stok', to: '/stok', icon: CubeIcon },
    { label: 'Laporan', to: '/laporan', icon: ChartBarIcon },
    { label: 'Kasir', to: '/kasir', icon: CalculatorIcon },
    { label: 'Pesanan', to: '/pesanan', icon: ClipboardDocumentListIcon },
  ],
  admin: [
    { label: 'Beranda', to: '/', icon: HomeIcon },
    { label: 'Kelola Pengguna', to: '/pengguna', icon: UsersIcon },
    { label: 'Data Obat', to: '/obat/data', icon: BeakerIcon },
    { label: 'Laporan', to: '/laporan', icon: ChartBarIcon },
  ],
};
