import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    console.log("CREATE POST ERROR FULL:", err);
    console.log("CREATE POST STATUS:", err?.response?.status);
    console.log("CREATE POST ERROR DATA:", JSON.stringify(data, null, 2));

    if (typeof data === "string" && data.trim()) {
      return data;
    }

    if (data?.message && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (data?.error && typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }

    if (err?.response?.status === 401) {
      return "Please login first";
    }

    if (err?.response?.status === 403) {
      return "Forbidden. Please log in again.";
    }

    if (err?.response?.status === 500) {
      return "Internal Server Error";
    }

    if (err?.response?.status === 502) {
      return "Bad Gateway";
    }

    if (err?.code === "ERR_NETWORK") {
      return "Network Error";
    }

    return "Post failed";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/posts", {
        title: title.trim(),
        body: body.trim(),
      });

      navigate("/home");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "60px auto" }} className="panel">
      <h2 style={{ marginTop: 0 }}>Create a new academic question</h2>

      <p style={{ color: "#9ca3af" }}>
        Ask clearly, give enough context, and let the community provide the best answer.
      </p>

      <form onSubmit={handleSubmit}>
        <label>Question Title</label>
        <input
          className="input"
          placeholder="Enter question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div style={{ height: 12 }} />

        <label>Question Details</label>
        <textarea
          className="input"
          style={{ minHeight: 150 }}
          placeholder="Explain your question in detail..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <div style={{ height: 12 }} />

        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          AI moderation will check for safe and appropriate content before publishing.
        </p>

        {error && <p style={{ color: "#ef4444", marginTop: 10 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/home")}
            disabled={loading}
          >
            Cancel
          </button>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}