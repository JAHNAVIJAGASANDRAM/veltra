import api from "../api/axios";

export const getTasks = () => api.get("/tasks");
export const createTask = (data) => api.post("/tasks/create", data);
export const updateTask = (id, data) => api.put(`/tasks/update/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/delete/${id}`);

export const assignTask = (id, userId) =>
  api.post(`/tasks/assign/${id}`, { userId });
