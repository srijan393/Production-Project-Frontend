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
      console.log("ADMIN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const card = {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(10,18,40,0.9)",
    marginBottom: 14,
  };

  const btn = {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
  };

  const activeBtn = {
    ...btn,
    background: "#7c3aed",
  };

  const dangerBtn = {
    ...btn,
    background: "#7f1d1d",
  };

  const safe = (v) => (v === null || v === undefined ? "-" : String(v));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20, color: "#fff" }}>
      {/* HEADER */}
      <div style={{ ...card, display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: "#aaa" }}>Manage platform</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={btn} onClick={() => navigate("/home")}>Back</button>
          <button style={btn} onClick={loadData}>Refresh</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {["stats", "users", "posts", "comments", "flags"].map((t) => (
          <button
            key={t}
            style={tab === t ? activeBtn : btn}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <div style={card}>Loading...</div>}

      {/* STATS */}
      {tab === "stats" && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10 }}>
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} style={card}>
              <div style={{ color: "#aaa" }}>{k}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{safe(v)}</div>
            </div>
          ))}
        </div>
      )}

      {/* USERS */}
      {tab === "users" && !loading && users.map((u, i) => (
        <div key={u.id || i} style={card}>
          <b>{safe(u.fullName)}</b> @{safe(u.username)}<br />
          {safe(u.email)} | Role: {safe(u.role)}
          <br />
          <button style={dangerBtn}>Delete</button>
        </div>
      ))}

      {/* POSTS */}
      {tab === "posts" && !loading && posts.map((p, i) => (
        <div key={p.id || i} style={card}>
          <b>{safe(p.title)}</b><br />
          @{safe(p.authorUsername)}
          <p>{safe(p.body)}</p>
          <button style={dangerBtn}>Delete</button>
        </div>
      ))}

      {/* COMMENTS */}
      {tab === "comments" && !loading && comments.map((c, i) => (
        <div key={c.id || i} style={card}>
          <b>Comment #{safe(c.id)}</b><br />
          @{safe(c.authorUsername)}
          <p>{safe(c.content)}</p>
          <button style={dangerBtn}>Delete</button>
        </div>
      ))}

      {/* FLAGS */}
      {tab === "flags" && !loading && (
        flags.length === 0
          ? <div style={card}>No flags</div>
          : flags.map((f, i) => (
              <div key={f.id || i} style={card}>
                <b>{safe(f.contentType)}</b><br />
                @{safe(f.username)}
                <p style={{ color: "red" }}>{safe(f.reason)}</p>
              </div>
            ))
      )}
    </div>
  );
}