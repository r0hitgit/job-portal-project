import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const response = await login({ email, password });
      const token = response.data;

      // Decode JWT to extract role & email
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("role", payload.role?.replace("ROLE_", ""));
      localStorage.setItem("email", payload.sub);

      // Redirect based on role
      if (payload.role?.includes("RECRUITER")) navigate("/recruiter");
      else if (payload.role?.includes("CANDIDATE")) navigate("/candidate");
      else navigate("/jobs");

    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 60% 20%, rgba(108,99,255,0.08) 0%, transparent 60%), var(--bg)",
      padding: "2rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "2.5rem",
        boxShadow: "var(--shadow), var(--shadow-accent)",
        animation: "fadeIn 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "var(--font-head)", fontSize: "1.8rem", fontWeight: 800,
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "0.25rem",
        }}>JobPortal</div>
        <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{
            background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)",
            color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)",
            fontSize: "0.875rem", marginBottom: "1rem",
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Email
          </label>
          <input
            type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
            style={{
              width: "100%", padding: "0.75rem 1rem", marginBottom: "1.2rem",
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
            }}
          />

          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text2)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Password
          </label>
          <input
            type="password" placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"}
            style={{
              width: "100%", padding: "0.75rem 1rem", marginBottom: "1.5rem",
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
            }}
          />

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.85rem",
            background: "linear-gradient(135deg, #6c63ff, #8b85ff)",
            color: "#fff", border: "none", borderRadius: "var(--radius)",
            fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 20px rgba(108,99,255,0.4)",
          }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
