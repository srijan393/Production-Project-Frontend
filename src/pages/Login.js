import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err?.code === "ERR_NETWORK") return "Cannot connect to server";

    return "Login failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      navigate("/home");
    } catch (err) {
      setError(getErrorMessage(err)); // ✅ FIXED
      console.log("LOGIN ERROR:", err?.response?.status, err?.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }} className="panel">
      <h2 style={{ marginTop: 0 }}>Login</h2>
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div style={{ height: 10 }} />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div style={{ height: 12 }} />

        <button className="btn primary" type="submit">
          Login
        </button>
      </form>

      <p className="small" style={{ marginTop: 12 }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "#c4b5fd" }}>
          Signup
        </Link>
      </p>
    </div>
  );
}