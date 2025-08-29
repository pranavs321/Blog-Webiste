// src/context/AuthProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Axios instance with token from localStorage
  const api = axios.create({
    baseURL: "http://localhost:4001/api",
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ✅ Fetch blogs once on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/all-blogs");
        const data = res.data;

        console.log("✅ Full API response:", data);

        // Handle both cases: array directly OR object with blogs property
        if (Array.isArray(data)) {
          setBlogs(data);
        } else if (data.blogs) {
          setBlogs(data.blogs);
        } else {
          console.warn("⚠️ Unexpected API response:", data);
          setBlogs([]);
        }
      } catch (error) {
        console.error("❌ Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <AuthContext.Provider value={{ blogs, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for using context
export const useAuth = () => useContext(AuthContext);
