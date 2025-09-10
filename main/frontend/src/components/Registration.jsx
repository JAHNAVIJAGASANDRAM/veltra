// components/Registration.jsx
export default function Registration({ onClose }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Registration Page</h2>
        <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
}

/*export default function Registration({ onClose }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
        
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
}*/
