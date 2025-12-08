import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  withCredentials: false
});

// Automatically add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("veltra_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
