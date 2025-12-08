import api from "../api/axios";

export const getDashboardStats = () => api.get("/analytics/dashboard");
export const getContentStats = () => api.get("/analytics/content");
export const getTaskStats = () => api.get("/analytics/tasks");
export const getTeamStats = () => api.get("/analytics/teams");
