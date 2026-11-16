import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Search, UserPlus, X } from 'lucide-react';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userService';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staf', label: 'Staf' },
];

const DEFAULT_FORM = {
  username: '',
  no_hp: '',
  role: 'staf',
  password: '',
  password_confirmation: '',
};

export default function KelolaPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getUsers(debouncedSearch);
      setUsers(result.data);
    } catch (err) {
      console.error('Gagal memuat pengguna:', err);
      setError('Gagal memuat data pengguna. Pastikan server berjalan.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username ?? '',
      no_hp: user.no_hp ?? '',
      role: (user.role ?? 'staf').toLowerCase(),
      password: '',
      password_confirmation: '',
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(DEFAULT_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.username.trim()) {
      setFormError('Username wajib diisi.');
      return;
    }
    if (!form.no_hp.trim()) {
      setFormError('Nomor HP wajib diisi.');
      return;
    }
    if (!editingUser && !form.password) {
      setFormError('Password wajib diisi untuk pengguna baru.');
      return;
    }
    if (form.password && form.password !== form.password_confirmation) {
      setFormError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    const payload = {
      username: form.username,
      no_hp: form.no_hp,
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser(payload);
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errors ??
        'Gagal menyimpan data. Coba lagi.';
      setFormError(typeof msg === 'object' ? JSON.stringify(msg) : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingUserId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deletingUserId) return;
    try {
      await deleteUser(deletingUserId);
      setShowDeleteConfirm(false);
      setDeletingUserId(null);
      fetchUsers();
    } catch (err) {
      console.error('Gagal menghapus pengguna:', err);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingUserId(null);
  };

  const formatCode = (user, index) =>
    `USR-${String(user.id ?? index + 1).padStart(3, '0')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h1>
          <p className="mt-1 text-sm text-gray-500">Manajemen akun staf &amp; admin</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      {/* Card */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Telusuri username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              <UserPlus size={16} />
              <span>Tambah Pengguna</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left font-semibold">Kode</th>
                <th className="px-6 py-3 text-left font-semibold">Username</th>
                <th className="px-6 py-3 text-left font-semibold">No HP</th>
                <th className="px-6 py-3 text-left font-semibold">Peran</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      Memuat data...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id ?? index}
                    className="border-b border-gray-50 hover:bg-blue-50/50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-blue-600">
                      {formatCode(user, index)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.username}</td>
                    <td className="px-6 py-4 text-gray-700">{user.no_hp ?? '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit"
                          className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          title="Hapus"
                          className="rounded-lg p-1.5 text-red-500 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h3 className="text-base font-semibold text-gray-800">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              {formError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleFormChange}
                  placeholder="Masukkan username"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  No HP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="no_hp"
                  value={form.no_hp}
                  onChange={handleFormChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Peran</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Password {!editingUser && <span className="text-red-500">*</span>}
                  {editingUser && (
                    <span className="text-gray-400"> (kosongkan jika tidak diubah)</span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleFormChange}
                  placeholder="Masukkan password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleFormChange}
                  placeholder="Ulangi password"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} className="text-red-500" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-base font-semibold text-gray-800">
              Hapus Pengguna
            </h3>
            <p className="mb-6 text-center text-sm text-gray-500">
              Yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
