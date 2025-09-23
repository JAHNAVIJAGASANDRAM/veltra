// Registration.jsx
export default function Registration({ onClose, onContinue }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Registration</h2>

        {/* Form inputs */}
        <input className="border p-2 w-full mb-3" placeholder="Name" />
        <input className="border p-2 w-full mb-3" placeholder="Email" />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
