import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const pageStyle = {
    maxWidth: 980,
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

  const sectionCardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 18,
    background: "rgba(7, 15, 34, 0.9)",
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

  const primaryBtnStyle = {
    ...btnStyle,
    background: "rgba(124, 58, 237, 0.22)",
    border: "1px solid rgba(124, 58, 237, 0.35)",
  };

  const dangerBtnStyle = {
    ...btnStyle,
    background: "rgba(127, 29, 29, 0.35)",
    border: "1px solid rgba(239,68,68,0.35)",
  };

  const titleStyle = {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 8,
  };

  const descStyle = {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 14,
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
          <div style={{ fontSize: 30, fontWeight: 900 }}>Settings</div>
          <div style={{ color: "#cbd5e1", fontSize: 14 }}>
            Manage your account and application preferences
          </div>
        </div>

        <button style={btnStyle} onClick={() => navigate("/home")}>
          Back
        </button>
      </div>

      <div style={cardStyle}>
        <div style={sectionCardStyle}>
          <div style={titleStyle}>Profile</div>
          <div style={descStyle}>
            View and update your full name, username, and email.
          </div>
          <button style={primaryBtnStyle} onClick={() => navigate("/profile")}>
            Open Profile
          </button>
        </div>

        <div style={sectionCardStyle}>
          <div style={titleStyle}>Password & Security</div>
          <div style={descStyle}>
            Change your password and keep your account secure.
          </div>
          <button style={primaryBtnStyle} onClick={() => navigate("/change-password")}>
            Change Password
          </button>
        </div>

        <div style={sectionCardStyle}>
          <div style={titleStyle}>Discover & People</div>
          <div style={descStyle}>
            Explore users and connect with other people on SocialHub.
          </div>
          <button style={btnStyle} onClick={() => navigate("/discover")}>
            Open Discover
          </button>
        </div>

        <div style={sectionCardStyle}>
          <div style={titleStyle}>Session</div>
          <div style={descStyle}>
            Sign out from this device.
          </div>
          <button style={dangerBtnStyle} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}