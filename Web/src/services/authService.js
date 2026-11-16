import api from "./api";

export const login = async (username, password) => {
  const response = await api.post("/login", {
    login_id: username,
    password,
  });
  return response.data;
};

export const logout = async (token) => {
  await api.post("/logout", null, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const getCurrentUser = async () => {
  const response = await api.get("/user");
  return response.data;
};
