import api from "../api/axios";

export const getAllContent = () => api.get("/content");
export const createContent = (data) => api.post("/content/create", data);
export const updateContent = (id, data) =>
  api.put(`/content/update/${id}`, data);
export const deleteContent = (id) => api.delete(`/content/delete/${id}`);

export const approveContent = (id) => api.post(`/content/approve/${id}`);
export const rejectContent = (id) => api.post(`/content/reject/${id}`);
