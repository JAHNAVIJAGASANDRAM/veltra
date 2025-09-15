import React from "react";

function Topbar() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1"
        />
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          JJ
        </div>
      </div>
    </header>
  );
}

export default Topbar;
