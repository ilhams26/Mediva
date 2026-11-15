import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';

const mockUsers = [
  { kode: 'US001', nama: 'Budi Santoso', username: 'budi_santoso', peran: 'STAF' },
  { kode: 'US002', nama: 'Siti Rahma', username: 'siti_rahma', peran: 'STAF' },
  { kode: 'US003', nama: 'Ahmad Admin', username: 'ahmad_admin', peran: 'ADMIN' },
];

const columns = [
  { key: 'kode', label: 'Kode' },
  { key: 'nama', label: 'Nama Pengguna' },
  { key: 'username', label: 'Username' },
  { key: 'peran', label: 'Peran' },
];

export function KelolaUser() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filteredData = mockUsers.filter(item => 
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.username.toLowerCase().includes(search.toLowerCase()) ||
    item.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kelola Pengguna" 
        subtitle="Manajemen akun staf"
        role={user?.role}
      />
      
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Telusuri nama pengguna"
          className="min-w-[200px] flex-1"
        />
        <Button>
          Tambah Pengguna
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onEdit={(row) => console.log('Edit:', row)}
        onDelete={(row) => console.log('Delete:', row)}
      />
    </div>
  );
}
