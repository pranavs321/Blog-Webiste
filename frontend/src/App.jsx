import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Creators from "./pages/Creators";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import api from "./api/axios"; 

function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(
    location.pathname
  );

  // ✅ useEffect must be INSIDE the component function
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/all-blogs");
        console.log("Blogs response from backend:", res.data);
      } catch (err) {
        console.error(
          "Error fetching blogs:",
          err.response?.data || err.message
        );
      }
    };

    fetchBlogs();
  }, []); // 👈 this closing bracket was probably misplaced before

  return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        {/*<Route exact path="/" element={<Home />} />*/}
        <Route exact path="/blogs" element={<Blogs />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} /> 
        <Route exact path="/creators" element={<Creators />} /> 
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Routes>
      {/*{!hideNavbarFooter && <Footer />}*/}
    </div>
  );
}

export default App;
