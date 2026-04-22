import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [tab, setTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      (typeof err?.response?.data === "string" ? err.response.data : null) ||
      err?.message ||
      fallback
    );
  };

  const safe = (v, fallback = "-") => {
    if (v === null || v === undefined || v === "") return fallback;
    return String(v);
  };

  const statValue = (...values) => {
    for (const v of values) {
      if (v !== null && v !== undefined && v !== "") return v;
    }
    return 0;
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [s, u, p, c, f] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/posts"),
        api.get("/admin/comments"),
        api.get("/admin/flags"),
      ]);

      setStats(s.data || {});
      setUsers(u.data || []);
      setPosts(p.data || []);
      setComments(c.data || []);
      setFlags(f.data || []);
    } catch (err) {
      console.log("ADMIN ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(getErrorMessage(err, "Failed to load admin data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteUser = async (id, username = "") => {
    if (!window.confirm(`Delete this user${username ? ` (${username})` : ""}?`)) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/users/${id}`);

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setPosts((prev) =>
        prev.filter(
          (p) =>
            String(p.authorUsername || "").toLowerCase() !==
            String(username || "").toLowerCase()
        )
      );
      setComments((prev) =>
        prev.filter(
          (c) =>
            String(c.authorUsername || "").toLowerCase() !==
            String(username || "").toLowerCase()
        )
      );

      await loadData();
      alert("User deleted successfully");
    } catch (err) {
      console.log("DELETE USER ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(getErrorMessage(err, "Failed to delete user"));
    } finally {
      setActionLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/posts/${id}`);

      setPosts((prev) => prev.filter((p) => p.id !== id));
      setComments((prev) => prev.filter((c) => c.postId !== id));

      await loadData();
      alert("Post deleted successfully");
    } catch (err) {
      console.log("DELETE POST ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(getErrorMessage(err, "Failed to delete post"));
    } finally {
      setActionLoading(false);
    }
  };

  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      setActionLoading(true);
      await api.delete(`/admin/comments/${id}`);

      setComments((prev) => prev.filter((c) => c.id !== id));

      await loadData();
      alert("Comment deleted successfully");
    } catch (err) {
      console.log("DELETE COMMENT ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(getErrorMessage(err, "Failed to delete comment"));
    } finally {
      setActionLoading(false);
    }
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(10,18,40,0.9)",
    marginBottom: 14,
  };

  const itemCard = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(7, 15, 34, 0.9)",
    marginBottom: 14,
  };

  const btn = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#111827",
    color: "#fff",
    cursor: actionLoading ? "not-allowed" : "pointer",
    opacity: actionLoading ? 0.7 : 1,
  };

  const activeBtn = {
    ...btn,
    background: "#7c3aed",
  };

  const dangerBtn = {
    ...btn,
    background: "#7f1d1d",
    border: "1px solid rgba(239,68,68,0.35)",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16, color: "#fff" }}>
      <div
        style={{
          ...card,
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(26px, 5vw, 36px)" }}>Admin Dashboard</h1>
          <p style={{ color: "#aaa", marginTop: 8 }}>Quick admin controls</p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btn} onClick={() => navigate("/home")} disabled={actionLoading}>
            Back
          </button>
          <button style={btn} onClick={loadData} disabled={loading || actionLoading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        {["stats", "users", "posts", "comments", "flags"].map((t) => (
          <button
            key={t}
            style={tab === t ? activeBtn : btn}
            onClick={() => setTab(t)}
            disabled={actionLoading}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <div style={card}>Loading...</div>}

      {tab === "stats" && !loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
            gap: 12,
          }}
        >
          <div style={itemCard}>
            <div style={{ color: "#94a3b8" }}>Users</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
              {safe(statValue(stats.usersCount, stats.totalUsers), 0)}
            </div>
          </div>

          <div style={itemCard}>
            <div style={{ color: "#94a3b8" }}>Posts</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
              {safe(statValue(stats.postsCount, stats.totalPosts), 0)}
            </div>
          </div>

          <div style={itemCard}>
            <div style={{ color: "#94a3b8" }}>Comments</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
              {safe(statValue(stats.commentsCount, stats.totalComments), 0)}
            </div>
          </div>

          <div style={itemCard}>
            <div style={{ color: "#94a3b8" }}>Follows</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
              {safe(statValue(stats.followsCount, stats.totalFollows), 0)}
            </div>
          </div>

          <div style={itemCard}>
            <div style={{ color: "#94a3b8" }}>Flagged</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 8 }}>
              {safe(statValue(stats.flaggedCount, stats.totalFlags), 0)}
            </div>
          </div>
        </div>
      )}

      {tab === "users" && !loading && (
        users.length === 0 ? (
          <div style={itemCard}>No users</div>
        ) : (
          users.map((u, i) => (
            <div key={u.id || i} style={itemCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>
                    {safe(u.fullName, "User")}{" "}
                    <span style={{ color: "#94a3b8", fontSize: 18 }}>@{safe(u.username)}</span>
                  </div>
                  <div style={{ marginTop: 8, color: "#cbd5e1" }}>Email: {safe(u.email)}</div>
                  <div style={{ marginTop: 6, color: "#cbd5e1" }}>Role: {safe(u.role)}</div>
                  <div style={{ marginTop: 6, color: "#cbd5e1" }}>Bio: {safe(u.bio, "Not added")}</div>
                  <div style={{ marginTop: 6, color: "#cbd5e1" }}>
                    Interests: {safe(u.interests, "Not added")}
                  </div>
                </div>

                <button
                  style={dangerBtn}
                  onClick={() => deleteUser(u.id, u.username)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Please wait..." : "Delete User"}
                </button>
              </div>
            </div>
          ))
        )
      )}

      {tab === "posts" && !loading && (
        posts.length === 0 ? (
          <div style={itemCard}>No posts</div>
        ) : (
          posts.map((p, i) => (
            <div key={p.id || i} style={itemCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>{safe(p.title)}</div>
                  <div style={{ marginTop: 8, color: "#cbd5e1" }}>Author: @{safe(p.authorUsername)}</div>
                  <div style={{ marginTop: 10, color: "#e5e7eb", lineHeight: 1.6 }}>{safe(p.body)}</div>
                  <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                    Best Answer: {p.bestCommentId ? `Pinned (#${p.bestCommentId})` : "Not pinned"}
                  </div>
                </div>

                <button
                  style={dangerBtn}
                  onClick={() => deletePost(p.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Please wait..." : "Delete Post"}
                </button>
              </div>
            </div>
          ))
        )
      )}

      {tab === "comments" && !loading && (
        comments.length === 0 ? (
          <div style={itemCard}>No comments</div>
        ) : (
          comments.map((c, i) => (
            <div key={c.id || i} style={itemCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>Comment #{safe(c.id)}</div>
                  <div style={{ marginTop: 8, color: "#cbd5e1" }}>Post ID: {safe(c.postId)}</div>
                  <div style={{ marginTop: 6, color: "#cbd5e1" }}>Author: @{safe(c.authorUsername)}</div>
                  <div style={{ marginTop: 10, color: "#e5e7eb", lineHeight: 1.6 }}>{safe(c.content)}</div>
                </div>

                <button
                  style={dangerBtn}
                  onClick={() => deleteComment(c.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Please wait..." : "Delete Comment"}
                </button>
              </div>
            </div>
          ))
        )
      )}

      {tab === "flags" && !loading && (
        flags.length === 0 ? (
          <div style={itemCard}>No flags</div>
        ) : (
          flags.map((f, i) => (
            <div key={f.id || i} style={itemCard}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>
                {safe(f.contentType || f.targetType || "Flag")}
              </div>
              <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                User: @{safe(f.username, "unknown")}
              </div>
              <div style={{ marginTop: 8, color: "#fecaca" }}>
                Reason: {safe(f.reason)}
              </div>
              <div style={{ marginTop: 10, color: "#e5e7eb", lineHeight: 1.6 }}>
                {safe(f.contentPreview || f.preview || "No preview")}
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}