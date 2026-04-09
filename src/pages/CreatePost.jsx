import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/posts", {
        title,
        body,
      });

      setTitle("");
      setBody("");
      navigate("/home");
    } catch (err) {
      console.log("CREATE POST ERROR:", err?.response?.status, err?.response?.data, err?.message);

      const data = err?.response?.data;

      let message = "Failed to create post";

      if (typeof data === "string") {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="create-shell">
        <div className="create-card">
          <div className="create-topline">
            <span className="post-chip">Ask a Question</span>
          </div>

          <h1 className="create-title">Create a new academic question</h1>
          <p className="create-subtitle">
            Ask clearly, give enough context, and let the community provide the best answer.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="create-field">
              <label className="create-label">Question Title</label>
              <input
                className="create-input"
                type="text"
                placeholder="Enter a clear question title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="create-field">
              <label className="create-label">Question Details</label>
              <textarea
                className="create-textarea"
                placeholder="Describe your question with enough detail"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                required
              />
            </div>

            <div className="ai-line" style={{ marginBottom: 18 }}>
              AI moderation will check for safe and appropriate content before publishing.
            </div>

            {error && (
              <div className="feed-error" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div className="post-action-row">
              <button className="post-btn secondary" type="button" onClick={() => navigate("/home")}>
                Cancel
              </button>
              <button className="post-btn" type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}