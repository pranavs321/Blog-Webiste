import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001/api",
  withCredentials: true, // include cookies if backend sets them
});

// Always attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
