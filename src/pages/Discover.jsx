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

  const getErrorMessage = (err, fallback = "Something went wrong") => {
    const data = err?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return fallback;
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/users/discover");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("DISCOVER ERROR:", err?.response?.status, err?.response?.data, err?.message);

      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      setError(getErrorMessage(err, "Failed to load users"));
      setUsers([]);
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
  }, [token, navigate]);

  const handleFollowToggle = async (user) => {
    try {
      setActionLoading(user.id);
      setError("");

      if (user.following) {
        await api.delete(`/users/${user.id}/follow`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  following: false,
                  followersCount: Math.max((u.followersCount || 0) - 1, 0),
                }
              : u
          )
        );
      } else {
        await api.post(`/users/${user.id}/follow`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id
              ? {
                  ...u,
                  following: true,
                  followersCount: (u.followersCount || 0) + 1,
                }
              : u
          )
        );
      }

      await loadUsers();
    } catch (err) {
      console.log("FOLLOW ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(getErrorMessage(err, "Follow action failed"));
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
            <div style={{ fontSize: 24, fontWeight: 900 }}>Discover</div>
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
          ...cardStyle,
          marginBottom: 18,
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900 }}>Discover Tips</div>
        <div style={{ color: "#cbd5e1" }}>
          Follow users to make your feed more social and personalized.
        </div>
        <div style={{ color: "#e5e7eb", marginTop: 4 }}>What you can do</div>
        <div style={{ color: "#cbd5e1" }}>✅ Follow / unfollow people</div>
        <div style={{ color: "#cbd5e1" }}>✅ See follower counts</div>
        <div style={{ color: "#cbd5e1" }}>✅ Build a personalized feed next</div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 14 }}>Suggested People</div>

      {loading && <div style={cardStyle}>Loading users...</div>}

      {!loading && error && (
        <div
          style={{
            ...cardStyle,
            border: "1px solid rgba(239,68,68,0.35)",
            color: "#fecaca",
          }}
        >
          <div>{error}</div>
          <button style={{ ...primaryBtnStyle, marginTop: 12 }} onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div style={cardStyle}>No users found.</div>
      )}

      {!loading &&
        !error &&
        users.map((u) => (
          <div key={u.id} style={{ ...cardStyle, marginBottom: 14 }}>
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

                <div style={{ marginTop: 8, color: "#e5e7eb" }}>
                  {u.bio || "No bio added yet."}
                </div>

                <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                  Interests: {u.interests || "Not added"}
                </div>

                <div style={{ marginTop: 8, color: "#cbd5e1" }}>
                  {u.followersCount || 0} followers · {u.followingCount || 0} following
                </div>
              </div>

              <button
                style={u.following ? btnStyle : primaryBtnStyle}
                onClick={() => handleFollowToggle(u)}
                disabled={actionLoading === u.id}
              >
                {actionLoading === u.id ? "Please wait..." : u.following ? "Unfollow" : "Follow"}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}