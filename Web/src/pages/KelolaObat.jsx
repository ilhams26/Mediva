import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import './KelolaObat.css';

const mockObats = [
  { kode: 'OB001', nama: 'Paracetamol 500mg', kategori: 'Analgesik', stok: '245', status: 'Aman' },
  { kode: 'OB002', nama: 'Aspirin 100mg', kategori: 'Antiinflamasi', stok: '8', status: 'Menipis' },
  { kode: 'OB003', nama: 'Metformin 500mg', kategori: 'Antidiabetes', stok: '340', status: 'Aman' },
  { kode: 'OB004', nama: 'Amoxicillin 250mg', kategori: 'Antibiotik', stok: '0', status: 'Habis' },
  { kode: 'OB005', nama: 'Ibuprofen 200mg', kategori: 'Antiinflamasi', stok: '120', status: 'Aman' },
  { kode: 'OB006', nama: 'Loratadine 10mg', kategori: 'Antihistamin', stok: '5', status: 'Menipis' },
  { kode: 'OB007', nama: 'Omeprazole 20mg', kategori: 'Antasida', stok: '85', status: 'Aman' },
  { kode: 'OB008', nama: 'Cetirizine 10mg', kategori: 'Antihistamin', stok: '0', status: 'Habis' },
  { kode: 'OB009', nama: 'Diclofenac 50mg', kategori: 'NSAID', stok: '12', status: 'Menipis' },
  { kode: 'OB010', nama: 'Ranitidine 150mg', kategori: 'Antasida', stok: '200', status: 'Aman' },
];

const columns = [
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama Obat' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'stok', label: 'Stok' },
  { key: 'status', label: 'Status' },
];

export function KelolaObat() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const isStaf = user?.role === 'staf';

  const filteredData = mockObats
    .filter(item => 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase())
    )
    .map(item => ({
      ...item,
      status: <StatusBadge status={item.status} />
    }));

  const displayColumns = isStaf ? columns : columns.slice(0, -1);

  return (
    <div className="kelola-obat">
      <PageHeader 
        title="Kelola Obat" 
        subtitle="Manajemen data obat di sistem"
        role={user?.role}
      />
      
      <div className="toolbar">
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Telusuri nama obat"
        />
        {isStaf && (
          <Button className="btn-add">
            + Tambah Obat
          </Button>
        )}
      </div>

      <DataTable
        columns={displayColumns}
        data={filteredData}
        onEdit={isStaf ? (row) => console.log('Edit:', row) : null}
        onDelete={isStaf ? (row) => console.log('Delete:', row) : null}
      />
    </div>
  );
}
