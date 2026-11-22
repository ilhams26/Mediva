import api from "./api";

/**
 * Daftar batch: GET /api/batches
 * Query: obat_id, search, page, per_page
 */
export const getBatches = async (params = {}) => {
    const response = await api.get("/batches", { params });
    const payload = response.data?.data ?? response.data;
    const rows = Array.isArray(payload) ? payload : payload?.data ?? [];

    const items = rows.map((item) => ({
        ...item,
        obat: typeof item.obat === "object" ? item.obat : { id: item.obat_id, nama: item.obat_nama },
        stok: Number(item.jumlah_sisa ?? item.stok ?? 0),
    }));

    return {
        items,
        pagination: Array.isArray(payload) ? null : payload?.pagination ?? null,
    };
};

export const createBatch = async (data) => {
    const response = await api.post("/batches", data);
    return response.data?.data ?? response.data;
};

export const adjustBatch = async (id, data) => {
    const response = await api.put(`/batches/${id}/adjust`, data);
    return response.data?.data ?? response.data;
};

/**
 * Detail batch: GET /api/batches (filter obat_id + search tidak cocok untuk by-id) —
 * sementara pakai daftar batch lalu cari by id dari hasil.
 */
export const getBatchById = async (id) => {
    const response = await api.get(`/batches/${id}`);
    const payload = response.data?.data ?? response.data;
    return payload;
};

/**
 * Riwayat pergerakan stok: GET /api/stock/movements
 * Query: obat_id, tipe, page, per_page
 */
export const getMovements = async (params = {}) => {
    const response = await api.get("/stock/movements", { params });
    const payload = response.data?.data ?? response.data;
    const rows = Array.isArray(payload) ? payload : payload?.data ?? [];

    const items = rows.map((item) => ({
        ...item,
        obat_nama: item.obat_nama ?? item.obat?.nama ?? null,
    }));

    return {
        items,
        pagination: Array.isArray(payload) ? null : payload?.pagination ?? null,
    };
};
