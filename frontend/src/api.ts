import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001/api", // ✅ point to backend
  withCredentials: true,                // keep cookies/session if needed
});

// Debug every request
api.interceptors.request.use((config) => {
  console.log("📤 Sending request:", config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log("📥 Response:", res.status, res.data);
    return res;
  },
  (err) => {
    console.error("❌ API error:", err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default api;
