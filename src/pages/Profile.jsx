import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    interests: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unfollowingId, setUnfollowingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      setError("");
      const [profileRes, followingRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/users/me/following"),
      ]);

      setUser(profileRes.data);
      setFollowingUsers(followingRes.data || []);

      setForm({
        fullName: profileRes.data.fullName || "",
        username: profileRes.data.username || "",
        email: profileRes.data.email || "",
        bio: profileRes.data.bio || "",
        interests: profileRes.data.interests || "",
      });
    } catch (err) {
      console.log("PROFILE ERROR:", err?.response?.status, err?.response?.data);
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return fallback;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await api.post("/auth/update-profile", {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        bio: form.bio.trim(),
        interests: form.interests.trim(),
      });

      setUser(res.data);
      setForm({
        fullName: res.data.fullName || "",
        username: res.data.username || "",
        email: res.data.email || "",
        bio: res.data.bio || "",
        interests: res.data.interests || "",
      });

      setEditing(false);
      setSuccess("Profile updated successfully");
      await loadProfile();
    } catch (err) {
      console.log("UPDATE PROFILE ERROR:", err?.response?.status, err?.response?.data);
      setError(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setUnfollowingId(userId);
      await api.delete(`/users/${userId}/follow`);
      await loadProfile();
    } catch (err) {
      console.log("UNFOLLOW ERROR:", err?.response?.status, err?.response?.data);
      alert(getErrorMessage(err, "Failed to unfollow"));
    } finally {
      setUnfollowingId(null);
    }
  };

  const pageStyle = {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
    color: "#f8fafc",
  };

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 22,
    background: "rgba(10, 18, 40, 0.92)",
  };

  const fieldCardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(7, 15, 34, 0.9)",
    marginBottom: 14,
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 8,
  };

  const valueStyle = {
    fontSize: 20,
    fontWeight: 700,
  };

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3, 10, 25, 0.95)",
    color: "#fff",
    boxSizing: "border-box",
  };

  const btnStyle = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#1e293b",
    color: "#fff",
    cursor: "pointer",
  };

  const primaryBtnStyle = {
    ...btnStyle,
    background: "#7c3aed",
  };

  const statsWrapStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 18,
  };

  const statCardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(7, 15, 34, 0.9)",
    textAlign: "center",
  };

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div
        style={{
          ...cardStyle,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>Profile</div>
          <div style={{ color: "#cbd5e1", fontSize: 14 }}>Your account details</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btnStyle} onClick={() => navigate("/home")}>
            Back
          </button>

          {!editing ? (
            <button style={primaryBtnStyle} onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button
                style={btnStyle}
                onClick={() => {
                  setEditing(false);
                  setError("");
                  setSuccess("");
                  setForm({
                    fullName: user.fullName || "",
                    username: user.username || "",
                    email: user.email || "",
                    bio: user.bio || "",
                    interests: user.interests || "",
                  });
                }}
              >
                Cancel
              </button>
              <button style={primaryBtnStyle} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ ...cardStyle, color: "#fecaca", marginBottom: 12, border: "1px solid rgba(239,68,68,0.35)" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ ...cardStyle, color: "#bbf7d0", marginBottom: 12, border: "1px solid rgba(34,197,94,0.35)" }}>
          {success}
        </div>
      )}

      <div style={statsWrapStyle}>
        <div style={statCardStyle}>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>Followers</div>
          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900 }}>{user.followersCount || 0}</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>Following</div>
          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900 }}>{user.followingCount || 0}</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ color: "#94a3b8", fontSize: 14 }}>Posts</div>
          <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900 }}>{user.postsCount || 0}</div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={fieldCardStyle}>
          <div style={labelStyle}>Full Name</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          ) : (
            <div style={valueStyle}>{user.fullName}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Username</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          ) : (
            <div style={valueStyle}>@{user.username}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Email</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          ) : (
            <div style={valueStyle}>{user.email}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Bio</div>
          {editing ? (
            <textarea
              style={{ ...inputStyle, minHeight: 90 }}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          ) : (
            <div style={valueStyle}>{user.bio || "No bio added yet."}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Interests</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="e.g. java, dbms, web development"
            />
          ) : (
            <div style={valueStyle}>{user.interests || "No interests added yet."}</div>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 14 }}>Following</div>

        {followingUsers.length === 0 ? (
          <div style={{ color: "#cbd5e1" }}>You are not following anyone yet.</div>
        ) : (
          followingUsers.map((u) => (
            <div
              key={u.id}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 16,
                background: "rgba(7, 15, 34, 0.9)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>
                    {u.fullName || "User"}{" "}
                    <span style={{ color: "#94a3b8", fontSize: 16 }}>@{u.username}</span>
                  </div>
                  <div style={{ marginTop: 8, color: "#e5e7eb" }}>
                    {u.bio || "No bio added yet."}
                  </div>
                  <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: 14 }}>
                    <strong>{u.followersCount}</strong> followers ·{" "}
                    <strong>{u.followingCount}</strong> following
                  </div>
                </div>

                <button
                  style={btnStyle}
                  onClick={() => handleUnfollow(u.id)}
                  disabled={unfollowingId === u.id}
                >
                  {unfollowingId === u.id ? "Please wait..." : "Unfollow"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}