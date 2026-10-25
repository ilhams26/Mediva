import api from './api';

export const getMedicineCount = async () => {
    try {
        const response = await api.get('/obat/count');
        return response.data.total;
    } catch (error) {
        console.error("Gagal mengambil jumlah obat:", error);
        throw error;
    }
};