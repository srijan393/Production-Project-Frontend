import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("stats");

  const readError = (err) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (err?.message) return err.message;
    try {
      return JSON.stringify(data);
    } catch {
      return "Failed to load admin";
    }
  };

  const loadAdmin = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, usersRes, postsRes, commentsRes, flagsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/posts"),
        api.get("/admin/comments"),
        api.get("/admin/flags"),
      ]);

      setStats(statsRes?.data ?? null);
      setUsers(Array.isArray(usersRes?.data) ? usersRes.data : []);
      setPosts(Array.isArray(postsRes?.data) ? postsRes.data : []);
      setComments(Array.isArray(commentsRes?.data) ? commentsRes.data : []);
      setFlags(Array.isArray(flagsRes?.data) ? flagsRes.data : []);
    } catch (err) {
      console.log("ADMIN ERROR FULL:", err);
      console.log("ADMIN ERROR DATA:", err?.response?.data);
      setError(readError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      await loadAdmin();
    } catch (err) {
      alert(readError(err));
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      await loadAdmin();
    } catch (err) {
      alert(readError(err));
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/admin/comments/${id}`);
      await loadAdmin();
    } catch (err) {
      alert(readError(err));
    }
  };

  const pageStyle = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 20,
    color: "#f8fafc",
  };

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
    background: "rgba(10, 18, 40, 0.92)",
    marginBottom: 16,
  };

  const btnStyle = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#fff",
    cursor: "pointer",
  };

  const dangerBtnStyle = {
    ...btnStyle,
    background: "rgba(220, 38, 38, 0.18)",
    border: "1px solid rgba(220, 38, 38, 0.35)",
  };

  const activeBtnStyle = {
    ...btnStyle,
    background: "rgba(124, 58, 237, 0.22)",
    border: "1px solid rgba(124, 58, 237, 0.35)",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>Admin Dashboard</div>
            <div style={{ color: "#cbd5e1", marginTop: 6 }}>Quick admin controls</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btnStyle} onClick={() => navigate("/home")}>Back</button>
            <button style={btnStyle} onClick={loadAdmin}>Refresh</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <button style={tab === "stats" ? activeBtnStyle : btnStyle} onClick={() => setTab("stats")}>Stats</button>
        <button style={tab === "users" ? activeBtnStyle : btnStyle} onClick={() => setTab("users")}>Users</button>
        <button style={tab === "posts" ? activeBtnStyle : btnStyle} onClick={() => setTab("posts")}>Posts</button>
        <button style={tab === "comments" ? activeBtnStyle : btnStyle} onClick={() => setTab("comments")}>Comments</button>
        <button style={tab === "flags" ? activeBtnStyle : btnStyle} onClick={() => setTab("flags")}>Flags</button>
      </div>

      {loading && <div style={cardStyle}>Loading admin data...</div>}

      {error && (
        <div style={{ ...cardStyle, color: "#fecaca", border: "1px solid rgba(239,68,68,0.35)" }}>
          {error}
        </div>
      )}

      {!loading && tab === "stats" && (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Stats</div>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      )}

      {!loading && tab === "users" && (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Users</div>
          {users.map((u, i) => (
            <div key={u?.id ?? i} style={{ ...cardStyle, marginBottom: 12, padding: 14 }}>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {JSON.stringify(u, null, 2)}
              </pre>
              <div style={{ marginTop: 10 }}>
                <button style={dangerBtnStyle} onClick={() => deleteUser(u?.id)}>Delete User</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "posts" && (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Posts</div>
          {posts.map((p, i) => (
            <div key={p?.id ?? i} style={{ ...cardStyle, marginBottom: 12, padding: 14 }}>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {JSON.stringify(p, null, 2)}
              </pre>
              <div style={{ marginTop: 10 }}>
                <button style={dangerBtnStyle} onClick={() => deletePost(p?.id)}>Delete Post</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "comments" && (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Comments</div>
          {comments.map((c, i) => (
            <div key={c?.id ?? i} style={{ ...cardStyle, marginBottom: 12, padding: 14 }}>
              <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {JSON.stringify(c, null, 2)}
              </pre>
              <div style={{ marginTop: 10 }}>
                <button style={dangerBtnStyle} onClick={() => deleteComment(c?.id)}>Delete Comment</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "flags" && (
        <div style={cardStyle}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>Flags</div>
          {flags.length === 0 ? (
            <div>No flagged content yet.</div>
          ) : (
            flags.map((f, i) => (
              <div key={f?.id ?? i} style={{ ...cardStyle, marginBottom: 12, padding: 14 }}>
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(f, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}