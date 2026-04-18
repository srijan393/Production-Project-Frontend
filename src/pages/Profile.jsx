import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      setError("");
      const res = await api.get("/users/me");
      setUser(res.data);
      setForm({
        fullName: res.data.fullName || "",
        username: res.data.username || "",
        email: res.data.email || "",
      });
    } catch (err) {
      console.log("PROFILE ERROR:", err?.response?.status, err?.response?.data, err?.message);
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;

    console.log("UPDATE ERROR FULL:", err);
    console.log("UPDATE ERROR DATA:", data);

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;
    if (Array.isArray(data) && data.length > 0) return String(data[0]);
    return fallback;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await api.put("/users/me", {
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
      });

      setUser(res.data);
      setForm({
        fullName: res.data.fullName || "",
        username: res.data.username || "",
        email: res.data.email || "",
      });
      setEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.log("UPDATE PROFILE ERROR:", err?.response?.status, err?.response?.data, err?.message);
      setError(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  };

  const pageStyle = {
    maxWidth: 900,
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
    color: "#ffffff",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3, 10, 25, 0.95)",
    color: "#fff",
    outline: "none",
    fontSize: 16,
    boxSizing: "border-box",
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

  if (error && !user) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, color: "#fecaca", border: "1px solid rgba(239,68,68,0.35)" }}>
          {error}
          <div style={{ marginTop: 12 }}>
            <button style={btnStyle} onClick={() => navigate("/home")}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
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
            <button
              style={primaryBtnStyle}
              onClick={() => {
                setEditing(true);
                setError("");
                setSuccess("");
              }}
            >
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
        <div
          style={{
            ...cardStyle,
            marginBottom: 18,
            color: "#fecaca",
            border: "1px solid rgba(239,68,68,0.35)",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            ...cardStyle,
            marginBottom: 18,
            color: "#bbf7d0",
            border: "1px solid rgba(34,197,94,0.35)",
          }}
        >
          {success}
        </div>
      )}

      <div style={cardStyle}>
        <div style={fieldCardStyle}>
          <div style={labelStyle}>Full Name</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Enter full name"
            />
          ) : (
            <div style={valueStyle}>{user.fullName || "-"}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Username</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Enter username"
            />
          ) : (
            <div style={valueStyle}>@{user.username || "-"}</div>
          )}
        </div>

        <div style={fieldCardStyle}>
          <div style={labelStyle}>Email</div>
          {editing ? (
            <input
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter email"
            />
          ) : (
            <div style={valueStyle}>{user.email || "-"}</div>
          )}
        </div>
      </div>
    </div>
  );
}