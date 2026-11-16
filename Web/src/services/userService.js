import api from "./api";

export const getUsers = async (search = "") => {
  const response = await api.get("/users", {
    params: { search: search.trim() || undefined },
  });
  const payload = response.data?.data ?? {};
  return {
    data: payload.data ?? [],
    pagination: payload.pagination ?? null,
  };
};

export const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data?.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data?.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.patch(`/users/${id}/status`);
  return response.data?.data;
};
