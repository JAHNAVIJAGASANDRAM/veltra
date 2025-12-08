import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");  // ⬅ Redirect to MainDashboard
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
    <form onSubmit={handleLogin} className="p-8 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)} 
        className="border p-2 w-full mb-3"
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)} 
        className="border p-2 w-full mb-3"
      />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  </div>
  );
}
