import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Veltra</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
        <Link to="/content" className="hover:text-blue-400">Content Hub</Link>
        <Link to="/teams" className="hover:text-blue-400">Teams</Link>
        <Link to="/analytics" className="hover:text-blue-400">Analytics</Link>
        <Link to="/settings" className="hover:text-blue-400">Settings</Link>
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-700">
        <button className="w-full py-2 bg-red-500 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
