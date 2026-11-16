import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';

const mockObats = [
  { kode: 'OB001', nama: 'Paracetamol 500mg', kategori: 'Analgesik', stok: '245', status: 'Aman' },
  { kode: 'OB002', nama: 'Aspirin 100mg', kategori: 'Antiinflamasi', stok: '8', status: 'Menipis' },
  { kode: 'OB003', nama: 'Metformin 500mg', kategori: 'Antidiabetes', stok: '340', status: 'Aman' },
  { kode: 'OB004', nama: 'Amoxicillin 250mg', kategori: 'Antibiotik', stok: '0', status: 'Habis' },
  { kode: 'OB005', nama: 'Ibuprofen 200mg', kategori: 'Antiinflamasi', stok: '120', status: 'Aman' },
];

const columns = [
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama Obat' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'stok', label: 'Stok' },
  { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
];

export function KelolaObat() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const isStaf = user?.role === 'staf';

  const filteredData = mockObats.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isStaf ? 'Kelola Obat' : 'Data Obat'}
        subtitle="Manajemen data obat di sistem"
        role={user?.role}
      />
      
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Telusuri nama obat"
          className="min-w-[200px] flex-1"
        />
        {isStaf && (
          <Button>
            Tambah Obat
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={isStaf ? (row) => console.log('Edit:', row) : null}
        onDelete={isStaf ? (row) => console.log('Delete:', row) : null}
      />
    </div>
  );
}
