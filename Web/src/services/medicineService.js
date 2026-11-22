import api from "./api";

export const getMedicineCount = async () => {
    try {
        const response = await api.get('/obat/count');
        return response.data.total;
    } catch (error) {
        console.error("Gagal mengambil jumlah obat:", error);
        throw error;
    }
};

/**
 * Daftar obat (management): GET /api/obat
 * Query params: search, kategori_id, jenis, is_active, page, per_page
 */
export const getObats = async (params = {}) => {
    const response = await api.get("/obat", { params });
    const payload = response.data?.data ?? response.data;
    const rows = Array.isArray(payload) ? payload : payload?.data ?? [];

    const items = rows.map((item) => ({
        ...item,
        id: item.id ?? item.obat_id,
        nama: item.nama ?? item.name,
        kategori: typeof item.kategori === "object" ? item.kategori?.nama : item.kategori,
        harga: Number(item.harga ?? item.price ?? 0),
        stok: Number(item.stok ?? item.stok_total ?? item.stock ?? 0),
        is_active: item.is_active ?? true,
        stok_total: Number(item.stok_total ?? item.stok ?? 0),
    }));

    return {
        items,
        pagination: Array.isArray(payload) ? null : payload?.pagination ?? null,
    };
};

/**
 * Detail obat: GET /api/obat/{id}
 */
export const getObatById = async (id) => {
    const response = await api.get(`/obat/${id}`);
    const payload = response.data?.data ?? response.data;
    return payload;
};

/**
 * Buat obat: POST /api/obat
 */
export const createObat = async (data) => {
    const response = await api.post("/obat", data);
    return response.data?.data ?? response.data;
};

/**
 * Update obat (termasuk is_active toggle): PUT /api/obat/{id}
 */
export const updateObat = async (id, data) => {
    const response = await api.put(`/obat/${id}`, data);
    return response.data?.data ?? response.data;
};

/**
 * Soft delete obat (is_active = false): DELETE /api/obat/{id}
 */
export const deleteObat = async (id) => {
    const response = await api.delete(`/obat/${id}`);
    return response.data?.data ?? response.data;
};
