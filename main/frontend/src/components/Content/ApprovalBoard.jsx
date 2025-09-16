import React from "react";

function ApprovalBoard() {
  const approvals = [
    { id: 1, title: "Instagram Reel", submittedBy: "Sarah" },
    { id: 2, title: "Podcast Episode Script", submittedBy: "Alex" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Approval Board</h2>
      <ul className="space-y-3">
        {approvals.map((a) => (
          <li
            key={a.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <span>
              <strong>{a.title}</strong> <br />
              <small>Submitted by {a.submittedBy}</small>
            </span>
            <div className="space-x-2">
              <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Approve
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ApprovalBoard;
