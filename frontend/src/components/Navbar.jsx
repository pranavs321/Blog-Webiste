import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="flex justify-between items-center container mx-auto px-4">
        
        {/* Logo */}
        <div className="font-semibold text-xl">
          <span className="text-blue-500">Blog</span>App
        </div>

        {/* Center Menu */}
        <ul className="flex space-x-6 font-medium">
          <li><Link to="/" className="hover:text-blue-500 duration-200">HOME</Link></li>
          <li><Link to="/blogs" className="hover:text-blue-500 duration-200">BLOGS</Link></li>
          <li><Link to="/creators" className="hover:text-blue-500 duration-200">CREATORS</Link></li>
          <li><Link to="/about" className="hover:text-blue-500 duration-200">ABOUT</Link></li>
          <li><Link to="/contact" className="hover:text-blue-500 duration-200">CONTACT</Link></li>
        </ul>

        {/* Right buttons */}
        <div className="space-x-2">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 duration-300"
          >
            DASHBOARD
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-600 hover:text-white duration-300"
          >
            LOGIN
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
