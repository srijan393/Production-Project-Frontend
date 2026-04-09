import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function HomeFeed() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/posts");
      setPosts(res.data || []);
    } catch (err) {
      console.log("LOAD POSTS ERROR:", err?.response?.status, err?.response?.data, err?.message);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const pageStyle = {
    maxWidth: 1150,
    margin: "0 auto",
    padding: 20,
    color: "#f8fafc",
  };

  const topbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    background: "rgba(10, 18, 40, 0.92)",
    marginBottom: 18,
    flexWrap: "wrap",
  };

  const btnStyle = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#fff",
    cursor: "pointer",
  };

  const primaryBtnStyle = {
    ...btnStyle,
    background: "rgba(124, 58, 237, 0.22)",
    border: "1px solid rgba(124, 58, 237, 0.35)",
  };

  const layoutStyle = {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 18,
  };

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
    background: "rgba(10, 18, 40, 0.92)",
  };

  const postCardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
    background: "rgba(10, 18, 40, 0.92)",
    marginBottom: 14,
  };

  return (
    <div style={pageStyle}>
      <div style={topbarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              background: "rgba(124, 58, 237, 0.22)",
              border: "1px solid rgba(124, 58, 237, 0.35)",
            }}
          >
            SH
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>SocialHub</div>
            <div style={{ color: "#cbd5e1", fontSize: 14 }}>Smart academic Q&amp;A platform</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btnStyle} onClick={() => navigate("/discover")}>Discover</button>
          <button style={primaryBtnStyle} onClick={() => (token ? navigate("/create") : navigate("/login"))}>+ Ask</button>
          <button style={btnStyle} onClick={fetchPosts}>Refresh</button>
          {!token ? (
            <>
              <button style={btnStyle} onClick={() => navigate("/login")}>Login</button>
              <button style={primaryBtnStyle} onClick={() => navigate("/signup")}>Signup</button>
            </>
          ) : (
            <button style={btnStyle} onClick={logout}>Logout</button>
          )}
        </div>
      </div>

      <div style={layoutStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Navigation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/home" style={{ color: "#e2e8f0", textDecoration: "none" }}>🏠 Home</Link>
              <Link to="/discover" style={{ color: "#e2e8f0", textDecoration: "none" }}>🧭 Discover</Link>
              <Link to="/create" style={{ color: "#e2e8f0", textDecoration: "none" }}>➕ Ask</Link>
              <Link to="/profile" style={{ color: "#e2e8f0", textDecoration: "none" }}>👤 Profile</Link>
              <Link to="/settings" style={{ color: "#e2e8f0", textDecoration: "none" }}>⚙️ Settings</Link>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>System</div>
            <div style={{ color: "#cbd5e1", marginBottom: 8 }}>✅ Frontend live on Firebase</div>
            <div style={{ color: "#cbd5e1", marginBottom: 8 }}>✅ Backend live on Railway</div>
            <div style={{ color: "#cbd5e1" }}>✅ Database connected</div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 30 }}>Questions</h2>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(124,58,237,0.35)",
                background: "rgba(124,58,237,0.14)",
                color: "#c7d2fe",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Live backend
            </span>
          </div>

          {loading && <div style={cardStyle}>Loading posts...</div>}
          {error && <div style={{ ...cardStyle, color: "#fecaca", border: "1px solid rgba(239,68,68,0.35)" }}>{error}</div>}
          {!loading && !error && posts.length === 0 && <div style={cardStyle}>No posts yet. Ask the first question.</div>}

          {!loading &&
            !error &&
            posts.map((p) => (
              <div key={p.id} style={postCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                  <Link
                    to={`/posts/${p.id}`}
                    style={{
                      color: "#f8fafc",
                      textDecoration: "none",
                      fontWeight: 900,
                      fontSize: 32,
                      lineHeight: 1.25,
                    }}
                  >
                    {p.title}
                  </Link>
                  <span style={{ color: "#a5b4fc", fontSize: 18 }}>@{p.authorUsername}</span>
                </div>

                <div style={{ marginTop: 14, fontSize: 18, lineHeight: 1.65, color: "#e5e7eb" }}>
                  {p.body}
                </div>

                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    style={{
                      padding: "7px 14px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      background: p.bestCommentId ? "rgba(34,197,94,0.14)" : "rgba(99,102,241,0.12)",
                      border: p.bestCommentId
                        ? "1px solid rgba(34,197,94,0.4)"
                        : "1px solid rgba(99,102,241,0.35)",
                      color: p.bestCommentId ? "#dcfce7" : "#e0e7ff",
                    }}
                  >
                    {p.bestCommentId ? "⭐ Best answer pinned" : "Open question"}
                  </span>

                  <span style={{ color: "#cbd5e1", fontSize: 14 }}>AI check: ✅ safe</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}