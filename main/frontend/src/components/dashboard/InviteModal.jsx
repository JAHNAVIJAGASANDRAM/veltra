import { useState } from "react";

export default function InviteModal({ teamId, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleInvite = async () => {
    if (!email) {
      setMessage("Please enter a valid email.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      // Mock API call
      // Replace this with your actual backend request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage(`Invitation sent to ${email}!`);
      setEmail("");
    } catch (error) {
      setMessage("Failed to send invitation. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Invite a Teammate</h2>
        <p className="text-gray-600 mb-6">
          Enter the email of the person you want to invite to <b>{teamId}</b>.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Teammate email"
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleInvite}
          disabled={sending}
          className="w-full bg-blue-600 text-white py-3 rounded mb-4 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Invite"}
        </button>

        {message && <p className="text-center text-gray-700 mb-4">{message}</p>}

        <button
          onClick={onClose}
          className="w-full bg-gray-200 py-3 rounded hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
