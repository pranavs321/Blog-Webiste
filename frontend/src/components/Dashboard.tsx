import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import BlogCard from "./Blog/BlogCard";
import BlogForm from "./Blog/BlogForm";
import { PlusCircle, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs"); // axios GET
      setBlogs(res.data.blogs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await api.post("/blogs", formData); // axios POST
      setShowForm(false);
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to create blog");
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      await api.put(`/blogs/${editingBlog._id}`, formData); // axios PUT
      setEditingBlog(null);
      setShowForm(false);
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to update blog");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await api.delete(`/blogs/${id}`); // axios DELETE
      fetchBlogs();
    } catch (err: any) {
      setError(err.message || "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Blog Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setEditingBlog(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircle size={18} />
              New Blog
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-600">No blogs found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                canEdit={isAdmin}
                onEdit={(b) => {
                  setEditingBlog(b);
                  setShowForm(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Blog Form Modal */}
      {(showForm || editingBlog) && (
        <BlogForm
          blog={editingBlog}
          onSubmit={editingBlog ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingBlog(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
