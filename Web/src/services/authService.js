import api from './api';

export const loginBackend = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        console.error("Error login:", error);
        throw error;
    }
};