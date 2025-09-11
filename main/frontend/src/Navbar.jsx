"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#top"
          className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Veltra
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {["Home", "Features", "How it works", "Why Veltra", "Screenshots", "Testimonials", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative text-gray-700 font-medium hover:text-blue-600 transition-colors
                           after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            )
          )}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm">
            Sign In
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-105 transition shadow-md">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md shadow-lg px-6 py-4 space-y-4">
          {["Home", "Features", "How it works", "Why Veltra", "Screenshots", "Testimonials", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-gray-700 font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            )
          )}
          <div className="flex flex-col gap-2 pt-4">
            <button className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm">
              Sign In
            </button>
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-105 transition shadow-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
