import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message && typeof data.message === "string") return data.message;
    if (data?.error && typeof data.error === "string") return data.error;

    return "Failed to change password";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });

      setSuccess(res.data || "Password changed successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err?.response?.status, err?.response?.data, err?.message);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
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
          <div style={{ fontSize: 28, fontWeight: 900 }}>Change Password</div>
          <div style={{ color: "#cbd5e1", fontSize: 14 }}>Update your account password securely</div>
        </div>

        <button style={btnStyle} onClick={() => navigate("/settings")}>
          Back
        </button>
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

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <div style={fieldCardStyle}>
            <div style={labelStyle}>Current Password</div>
            <input
              type="password"
              style={inputStyle}
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />
          </div>

          <div style={fieldCardStyle}>
            <div style={labelStyle}>New Password</div>
            <input
              type="password"
              style={inputStyle}
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Enter new password"
              required
            />
          </div>

          <div style={fieldCardStyle}>
            <div style={labelStyle}>Confirm New Password</div>
            <input
              type="password"
              style={inputStyle}
              value={form.confirmNewPassword}
              onChange={(e) => setForm({ ...form, confirmNewPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <button type="button" style={btnStyle} onClick={() => navigate("/settings")}>
              Cancel
            </button>
            <button type="submit" style={primaryBtnStyle} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}