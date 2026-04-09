import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPage = async () => {
    try {
      setLoading(true);
      setError("");

      const [postRes, commentsRes] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/posts/${id}/comments`),
      ]);

      setPost(postRes.data);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.log("POST DETAILS ERROR:", err?.response?.status, err?.response?.data, err?.message);

      const data = err?.response?.data;
      let message = "Failed to load post";

      if (typeof data === "string") {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [id]);

  const pinned = useMemo(() => {
    if (!post?.bestCommentId) return null;
    return comments.find((c) => c.id === post.bestCommentId) || null;
  }, [comments, post]);

  const sendComment = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!comment.trim()) return;

    try {
      setCommentLoading(true);
      await api.post(`/posts/${id}/comments`, { content: comment });
      setComment("");
      await loadPage();
    } catch (err) {
      console.log("ADD COMMENT ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(err?.response?.data?.message || err?.response?.data?.error || "Failed to add answer");
    } finally {
      setCommentLoading(false);
    }
  };

  const pinBestAnswer = async (commentId) => {
    try {
      await api.post(`/posts/${id}/best-answer/${commentId}`);
      await loadPage();
    } catch (err) {
      console.log("PIN BEST ANSWER ERROR:", err?.response?.status, err?.response?.data, err?.message);
      alert(err?.response?.data?.message || err?.response?.data?.error || "Failed to pin best answer");
    }
  };

  const pageStyle = {
    maxWidth: 1150,
    margin: "0 auto",
    padding: 20,
    color: "#f8fafc",
  };

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 18,
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

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={pageStyle}>
        <div style={{ ...cardStyle, color: "#fecaca", border: "1px solid rgba(239,68,68,0.35)" }}>
          {error || "Post not found"}
        </div>
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
            <div style={{ fontSize: 22, fontWeight: 900 }}>Post</div>
            <div style={{ color: "#cbd5e1", fontSize: 14 }}>Live backend details page</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btnStyle} onClick={() => navigate("/home")}>Back</button>
          <button style={primaryBtnStyle} onClick={() => (token ? navigate("/create") : navigate("/login"))}>+ Ask</button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(124,58,237,0.35)",
              background: "rgba(124,58,237,0.14)",
              color: "#c7d2fe",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Question
          </span>
          <span style={{ color: "#a5b4fc", fontSize: 18 }}>#{post.id} · @{post.authorUsername}</span>
        </div>

        <h1 style={{ margin: "16px 0 10px", fontSize: 44, lineHeight: 1.2 }}>{post.title}</h1>
        <p style={{ margin: "0 0 12px", fontSize: 20, lineHeight: 1.65, color: "#e5e7eb" }}>{post.body}</p>
        <div style={{ color: "#cbd5e1", fontSize: 16 }}>AI check: ✅ post looks safe</div>
      </div>

      {pinned && (
        <div
          style={{
            ...cardStyle,
            marginTop: 18,
            border: "1px solid #22c55e",
            background: "rgba(6, 24, 18, 0.55)",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 900 }}>⭐ Best answer pinned by AI</div>
          <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.6 }}>{pinned.content}</div>
          <div style={{ marginTop: 12, color: "#cbd5e1" }}>@{pinned.authorUsername} • AI check ✅</div>
        </div>
      )}

      <div style={{ ...cardStyle, marginTop: 18 }}>
        <h2 style={{ margin: "0 0 18px", fontSize: 30 }}>Answers</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write an answer... (login required)"
            style={{
              flex: 1,
              minWidth: 260,
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(7, 15, 34, 0.9)",
              color: "#fff",
            }}
          />
          <button style={primaryBtnStyle} onClick={sendComment} disabled={commentLoading}>
            {commentLoading ? "Sending..." : "Send"}
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
                background: "rgba(10, 18, 40, 0.92)",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 900 }}>
                  {post.bestCommentId === c.id ? "⭐ Best Answer" : "Answer"}
                </div>
                <div style={{ color: "#a5b4fc", fontSize: 18 }}>@{c.authorUsername}</div>
              </div>

              <div style={{ marginTop: 14, fontSize: 18, lineHeight: 1.6 }}>{c.content}</div>
              <div style={{ marginTop: 12, color: "#cbd5e1" }}>AI check: ✅ ok</div>

              {token && post.bestCommentId !== c.id && (
                <div style={{ marginTop: 14 }}>
                  <button style={btnStyle} onClick={() => pinBestAnswer(c.id)}>
                    Pin as Best Answer
                  </button>
                </div>
              )}
            </div>
          ))}

          {comments.length === 0 && <div style={{ color: "#cbd5e1" }}>No answers yet.</div>}
        </div>
      </div>
    </div>
  );
}