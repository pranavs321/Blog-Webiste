import React, { useState } from "react";
import api from "../../api";

type LoginProps = {
  onToggle: () => void;
};

const Login: React.FC<LoginProps> = ({ onToggle }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Login form submitted with:", form);

    try {
      setError("");
      setSuccess("");
      const res = await api.post("/users/login", form); // ✅ sends login request
      console.log("✅ Login success:", res.data);

      setSuccess(res.data.message || "Login successful!");
      // 👉 Later we can store token: localStorage.setItem("token", res.data.token);
    } catch (err: any) {
      console.error("❌ Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      <p className="mt-4 text-sm">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:underline"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
