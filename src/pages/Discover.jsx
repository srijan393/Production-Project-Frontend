import { useNavigate } from "react-router-dom";

const demoUsers = [
  {
    fullName: "Sara Mehta",
    username: "sara_mehta",
    bio: "BCA student who loves meeting new people.",
    interests: "art, reading, blogging",
  },
  {
    fullName: "Arjun Patel",
    username: "arjun_patel",
    bio: "Computer science student and aspiring full-stack developer.",
    interests: "coding, cricket, music",
  },
  {
    fullName: "Riya Sharma",
    username: "riya_sharma",
    bio: "Mental health advocate and motivational speaker.",
    interests: "self-help, fitness, podcasts",
  },
  {
    fullName: "Kabir Singh",
    username: "kabir_singh",
    bio: "Fourth-year engineering student.",
    interests: "technology, robotics, movies",
  },
];

export default function Discover() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: 20 }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: 14,
          border: "1px solid #ddd",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ddd",
              fontWeight: 900,
            }}
          >
            SH
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Discover</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Find people (Instagram-style cards)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => (token ? navigate("/create") : navigate("/login"))}>
            + Ask
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14, marginTop: 14 }}>
        {/* Left */}
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14, height: "fit-content" }}>
          <div style={{ fontWeight: 900 }}>Tips</div>
          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.75 }}>
            Later you can add:
            <ul style={{ marginTop: 8 }}>
              <li>Follow/Unfollow</li>
              <li>Profile pages</li>
              <li>Direct chat</li>
            </ul>
          </div>
        </div>

        {/* Users */}
        <div>
          <h2 style={{ margin: 0 }}>Suggested People</h2>
          <div style={{ marginTop: 12 }}>
            {demoUsers.map((u) => (
              <div
                key={u.username}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>
                      {u.fullName} <span style={{ opacity: 0.7 }}>@{u.username}</span>
                    </div>
                    <div style={{ marginTop: 6 }}>{u.bio}</div>
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                      Interests: {u.interests}
                    </div>
                  </div>

                  <button disabled style={{ opacity: 0.7 }}>
                    Follow (next)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}