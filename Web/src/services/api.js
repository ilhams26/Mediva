import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Koneksi ke Supabase bisa lambat (DNS/network), beri ruang lebih dari 8 detik
  timeout: 30000,
  //withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
    }
    return Promise.reject(error);
  }
);

export default api;
