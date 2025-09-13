import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-4">Veltra</h3>
          <p className="text-gray-300">Your Virtual Office for Seamless Content Creation</p>
        </div>
        <div className="flex justify-center space-x-8 mb-8 flex-wrap">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/content" className="text-gray-300 hover:text-white transition-colors">Content</Link>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="text-center text-gray-400">
          <p>© 2025 Veltra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
