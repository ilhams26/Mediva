import api from "./api";

/**
 * Mengambil daftar user 
 * @param {string} search 
 */
export const getUsers = async (search = "") => {
  try {
    // Parameter pencarian akan dikirim ke backend
    const response = await api.get("/users", {
      params: { search: search.trim() },
    });
    return response.data.data ?? [];
  } catch (error) {
    console.error("Gagal mengambil daftar user:", error);
    throw error;
  }
};

/**
 * Membuat user baru melalui Laravel API.
 */
export const createUser = async (payload) => {
  try {
    const response = await api.post("/users", payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal membuat user:", error);
    throw error;
  }
};

/**
 * Memperbarui data user berdasarkan ID melalui Laravel API.
 */
export const updateUser = async (id, payload) => {
  try {
    const response = await api.put(`/users/${id}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Gagal memperbarui user:", error);
    throw error;
  }
};

/**
 * Menghapus user berdasarkan ID melalui Laravel API.
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    throw error;
  }
};

/**
 * Toggle status is_active user melalui Laravel API.
 */
export const toggleUserStatus = async (id, currentStatus) => {
  try {
    // Kita buat endpoint khusus (PATCH) di Laravel untuk toggle status
    const response = await api.patch(`/users/${id}/toggle-status`, {
      is_active: !currentStatus,
    });
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengubah status user:", error);
    throw error;
  }
};

export const formatKode = (id) => "USR-" + String(id).padStart(3, "0");
