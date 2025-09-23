export default function Registration({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent background */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose} // clicking outside closes modal
      />
      
      {/* Modal content */}
      <div className="relative bg-white p-8 rounded-2xl shadow-lg max-w-md w-full z-10">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 text-gray-600 text-sm hover:underline block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
