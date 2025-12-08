"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111827] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white hover:text-gray-300 transition-colors"
        >
          Veltra
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Testimonials", "Pricing", "Help"].map(
            (item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative text-white font-medium hover:text-[#f59e0b] transition-colors"
              >
                {item}
              </Link>
            )
          )}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="bg-[#f59e0b] text-[#111827] px-5 py-2 rounded-full font-semibold hover:bg-yellow-600 transition-colors duration-200">
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#111827] shadow-lg px-6 py-4 space-y-4">
          {["Features", "Testimonials", "Pricing", "Help"].map(
            (item) => (
              <Link
                key={item}
                to={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-white font-medium hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            )
          )}
          <div className="flex flex-col gap-2 pt-4">
            <Link to="/login" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-md">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
