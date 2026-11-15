import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { SearchInput } from '../components/SearchInput';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import './KelolaUser.css';

const mockUsers = [
  { kode: 'US001', nama: 'Budi Santoso', username: 'budi_santoso', peran: 'STAF' },
  { kode: 'US002', nama: 'Siti Rahma', username: 'siti_rahma', peran: 'STAF' },
  { kode: 'US003', nama: 'Ahmad Admin', username: 'ahmad_admin', peran: 'ADMIN' },
  { kode: 'US004', nama: 'Dewi Kusuma', username: 'dewi_kusuma', peran: 'STAF' },
  { kode: 'US005', nama: 'Rudi Hermawan', username: 'rudi_hermawan', peran: 'ADMIN' },
  { kode: 'US006', nama: 'Maya Putri', username: 'maya_putri', peran: 'STAF' },
  { kode: 'US007', nama: 'Tono Setiawan', username: 'tono_setiawan', peran: 'STAF' },
  { kode: 'US008', nama: 'Eka Wardani', username: 'eka_wardani', peran: 'ADMIN' },
  { kode: 'US009', nama: 'Bambang Wijaya', username: 'bambang_wijaya', peran: 'STAF' },
  { kode: 'US010', nama: 'Intan Suryani', username: 'intan_suryani', peran: 'STAF' },
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
    <div className="kelola-user">
      <PageHeader 
        title="Kelola Pengguna" 
        subtitle="Manajemen akun staf"
        role={user?.role}
      />
      
      <div className="toolbar">
        <SearchInput 
          value={search}
          onChange={setSearch}
          placeholder="Telusuri nama pengguna"
        />
        <Button className="btn-add">
          + Tambah Pengguna
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
