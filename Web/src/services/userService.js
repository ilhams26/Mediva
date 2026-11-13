import { supabase } from '../lib/supabase';

/**
 * Mengambil daftar user (admin + staf) dari Supabase.
 * @param {string} search - kata kunci pencarian username
 */
export const getUsers = async (search = '') => {
  let query = supabase
    .from('users')
    .select('id, username, no_hp, role, is_active, created_at')
    .in('role', ['admin', 'staf'])
    .order('created_at', { ascending: false });

  if (search.trim()) {
    query = query.ilike('username', `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

/**
 * Membuat user baru di Supabase.
 */
export const createUser = async (payload) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      username:      payload.username,
      no_hp:         payload.no_hp,
      password:      payload.password,  // hash di sisi backend/trigger jika ada
      role:          payload.role.toLowerCase(),
      jenis_kelamin: payload.jenis_kelamin ?? null,
      tanggal_lahir: payload.tanggal_lahir ?? null,
      is_active:     true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Memperbarui data user berdasarkan ID.
 */
export const updateUser = async (id, payload) => {
  const updateData = {
    username:      payload.username,
    no_hp:         payload.no_hp,
    role:          payload.role.toLowerCase(),
    jenis_kelamin: payload.jenis_kelamin ?? null,
    tanggal_lahir: payload.tanggal_lahir ?? null,
  };
  if (payload.password) {
    updateData.password = payload.password;
  }

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Menghapus user berdasarkan ID.
 */
export const deleteUser = async (id) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Toggle status is_active user.
 */
export const toggleUserStatus = async (id, currentStatus) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_active: !currentStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/** Format ID menjadi kode USR-001 */
export const formatKode = (id) =>
  'USR-' + String(id).padStart(3, '0');
