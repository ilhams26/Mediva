import api from "./api";

/**
 * Daftar kategori: GET /api/katalog/kategoris
 */
export const getKategoris = async () => {
    const response = await api.get("/katalog/kategoris");
    const payload = response.data?.data ?? response.data;
    const list = Array.isArray(payload) ? payload : payload ?? [];

    return list.map((item) => ({
        id: item.id ?? item.kategori_id,
        nama: item.nama ?? item.name,
    }));
};

export const createKategori = async (data) => {
    const response = await api.post("/kategoris", data);
    return response.data?.data ?? response.data;
};

export const updateKategori = async (id, data) => {
    const response = await api.put(`/kategoris/${id}`, data);
    return response.data?.data ?? response.data;
};

export const deleteKategori = async (id) => {
    const response = await api.delete(`/kategoris/${id}`);
    return response.data?.data ?? response.data;
};
