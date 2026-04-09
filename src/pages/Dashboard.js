import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/posts");
        setPosts(res.data || []);
      } catch (err) {
        setError("Failed to load posts. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "50px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Home</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Link to="/create">+ Ask a question</Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && posts.length === 0 && <p>No posts yet.</p>}

      {!loading && !error &&
        posts.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
            <Link to={`/posts/${p.id}`} style={{ fontWeight: "bold", fontSize: 16 }}>
              {p.title}
            </Link>
            <div style={{ marginTop: 6, opacity: 0.9 }}>{p.body}</div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
              by @{p.authorUsername} {p.bestCommentId ? "· ✅ Solved" : ""}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Dashboard;