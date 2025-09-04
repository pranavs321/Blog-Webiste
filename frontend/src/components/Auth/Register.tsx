import React, { useState } from "react";
import api from "../../api";

type RegisterProps = {
  onToggle: () => void;
};

const Register: React.FC<RegisterProps> = ({ onToggle }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Register form submitted with:", form);

    try {
      setError("");
      setSuccess("");
      const res = await api.post("/users/register", form); // ✅ correct path
      console.log("✅ Register success:", res.data);
      setSuccess(res.data.message || "Registered successfully!");
    } catch (err: any) {
      console.error("❌ Register error:", err.response?.data);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
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
          type="submit" // ✅ important
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-blue-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;
