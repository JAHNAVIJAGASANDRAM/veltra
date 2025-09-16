import React from "react";

function ContentList() {
  const contents = [
    { id: 1, title: "Podcast Episode 12", status: "Draft" },
    { id: 2, title: "Instagram Reel - Behind the Scenes", status: "Pending Approval" },
    { id: 3, title: "Blog Post: Remote Collaboration Tools", status: "Published" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Your Content</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="p-2 border">{c.title}</td>
              <td className="p-2 border">{c.status}</td>
              <td className="p-2 border space-x-2">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ContentList;
