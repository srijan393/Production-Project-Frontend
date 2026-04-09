import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      await api.post("/auth/signup", { fullName, username, email, password });
      setMsg("Signup successful. Please login.");
      setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setError("Signup failed");
      console.log("SIGNUP ERROR:", err?.response?.status, err?.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "60px auto" }} className="panel">
      <h2 style={{ marginTop: 0 }}>Signup</h2>
      {msg && <p style={{ color: "#22c55e" }}>{msg}</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <div style={{ height: 10 }} />

        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <div style={{ height: 10 }} />

        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div style={{ height: 10 }} />

        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div style={{ height: 12 }} />

        <button className="btn primary" type="submit">Create account</button>
      </form>

      <p className="small" style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login" style={{ color: "#c4b5fd" }}>Login</Link>
      </p>
    </div>
  );
}