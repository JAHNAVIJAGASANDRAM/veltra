import api from "../api/axios";

export const getTeams = () => api.get("/teams");
export const createTeam = (data) => api.post("/teams/create", data);

export const updateTeam = (id, data) => api.put(`/teams/update/${id}`, data);
export const deleteTeam = (id) => api.delete(`/teams/delete/${id}`);

export const addMember = (teamId, userId) =>
  api.post(`/teams/${teamId}/add-member`, { userId });
