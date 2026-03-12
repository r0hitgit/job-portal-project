import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CANDIDATE" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    try {
      await register(form);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.75rem 1rem", marginBottom: "1.2rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
  };
  const labelStyle = {
    display: "block", fontSize: "0.78rem", fontWeight: 600,
    color: "var(--text2)", marginBottom: "0.4rem",
    textTransform: "uppercase", letterSpacing: "0.5px",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 40% 80%, rgba(255,101,132,0.07) 0%, transparent 60%), var(--bg)",
      padding: "2rem",
    }}>
      <div style={{
        width: "100%", maxWidth: "440px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "2.5rem",
        boxShadow: "var(--shadow)", animation: "fadeIn 0.5s ease",
      }}>
        <div style={{
          fontFamily: "var(--font-head)", fontSize: "1.8rem", fontWeight: 800,
          background: "linear-gradient(135deg, #6c63ff, #ff6584)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.25rem",
        }}>JobPortal</div>
        <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "2rem" }}>Create your account</p>

        {error && <div style={{ background: "rgba(255,101,132,0.1)", border: "1px solid rgba(255,101,132,0.3)", color: "#ff6584", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.3)", color: "#43e97b", padding: "0.75rem 1rem", borderRadius: "var(--radius)", fontSize: "0.875rem", marginBottom: "1rem" }}>{success}</div>}

        <form onSubmit={handleRegister}>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} type="text" placeholder="John Doe" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"} />

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"} />

          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" placeholder="Min. 6 characters" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required
            onFocus={e => e.target.style.borderColor = "var(--accent)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"} />

          <label style={labelStyle}>I am a...</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {["CANDIDATE", "RECRUITER"].map(r => (
              <button key={r} type="button"
                onClick={() => setForm({ ...form, role: r })}
                style={{
                  padding: "0.75rem", borderRadius: "var(--radius)",
                  border: `2px solid ${form.role === r ? "var(--accent)" : "var(--border)"}`,
                  background: form.role === r ? "rgba(108,99,255,0.1)" : "var(--surface2)",
                  color: form.role === r ? "var(--accent)" : "var(--text2)",
                  fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "var(--transition)",
                }}>
                {r === "CANDIDATE" ? "👤 Candidate" : "🏢 Recruiter"}
              </button>
            ))}
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "0.85rem",
            background: "linear-gradient(135deg, #ff6584, #ff8fa3)",
            color: "#fff", border: "none", borderRadius: "var(--radius)",
            fontSize: "1rem", fontWeight: 600, fontFamily: "var(--font-head)",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
            boxShadow: "0 4px 20px rgba(255,101,132,0.35)",
          }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text2)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
