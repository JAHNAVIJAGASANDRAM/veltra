import api from "../api/axios";

export const getUserProfile = () => api.get("/users/me");
export const updateUserProfile = (data) => api.put("/users/update", data);

export const getAllUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);

export const deleteUser = (id) => api.delete(`/users/${id}`);
