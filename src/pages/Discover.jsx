import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Discover() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/users/discover");
      setUsers(res.data || []);
    } catch (err) {
      console.log("DISCOVER ERROR:", err?.response?.status, err?.response?.data, err?.message);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadUsers();
  }, []);

  const handleFollowToggle = async (user) => {
    try {
      setActionLoading(user.id);

      if (user.following) {
        await api.delete(`/users/${user.id}/follow`);
      } else {
        await api.post(`/users/${user.id}/follow`);
      }

      await loadUsers();
    } catch (err) {
      console.log("FOLLOW ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(err?.response?.data?.message || err?.response?.data?.error || "Follow action failed");
    } finally {
      setActionLoading(null);
    }
  };

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

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 16,
    background: "rgba(10, 18, 40, 0.92)",
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
            <div style={{ fontSize: 28, fontWeight: 900 }}>Discover</div>
            <div style={{ color: "#cbd5e1", fontSize: 14 }}>Find and follow people</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btnStyle} onClick={() => navigate("/home")}>Home</button>
          <button style={primaryBtnStyle} onClick={() => navigate("/create")}>+ Ask</button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Discover Tips</div>
            <div style={{ color: "#cbd5e1", lineHeight: 1.7 }}>
              Follow users to make your feed more social and personalized.
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>What you can do</div>
            <div style={{ color: "#cbd5e1", marginBottom: 8 }}>✅ Follow / unfollow people</div>
            <div style={{ color: "#cbd5e1", marginBottom: 8 }}>✅ See follower counts</div>
            <div style={{ color: "#cbd5e1" }}>✅ Build a personalized feed next</div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <h2 style={{ margin: 0, fontSize: 30 }}>Suggested People</h2>
          </div>

          {loading && <div style={cardStyle}>Loading users...</div>}
          {error && <div style={{ ...cardStyle, color: "#fecaca", border: "1px solid rgba(239,68,68,0.35)" }}>{error}</div>}
          {!loading && !error && users.length === 0 && <div style={cardStyle}>No users found.</div>}

          {!loading && !error && users.map((u) => (
            <div
              key={u.id}
              style={{
                ...cardStyle,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>
                    {u.fullName || "User"}{" "}
                    <span style={{ color: "#94a3b8", fontSize: 20 }}>@{u.username}</span>
                  </div>

                  <div style={{ marginTop: 10, color: "#e5e7eb", fontSize: 17, lineHeight: 1.6 }}>
                    {u.bio || "No bio added yet."}
                  </div>

                  <div style={{ marginTop: 10, color: "#cbd5e1", fontSize: 14 }}>
                    Interests: {u.interests || "Not added"}
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12, color: "#cbd5e1", fontSize: 14 }}>
                    <span><strong>{u.followersCount}</strong> followers</span>
                    <span><strong>{u.followingCount}</strong> following</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    style={u.following ? btnStyle : primaryBtnStyle}
                    onClick={() => handleFollowToggle(u)}
                    disabled={actionLoading === u.id}
                  >
                    {actionLoading === u.id
                      ? "Please wait..."
                      : u.following
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}