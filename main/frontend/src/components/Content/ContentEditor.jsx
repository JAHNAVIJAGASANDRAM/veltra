import React, { useState } from "react";

function ContentEditor() {
  const [draft, setDraft] = useState("");

  const handleSave = () => {
    alert("Draft saved: " + draft);
    setDraft("");
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">New Content Draft</h2>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-full h-40 border rounded p-3"
        placeholder="Write your draft here..."
      />
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Draft
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit for Approval
        </button>
      </div>
    </section>
  );
}

export default ContentEditor;
