import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getMyApplications } from "../api/axios";

const STATUS_CONFIG = {
  APPLIED:     { color: "#6c63ff", bg: "rgba(108,99,255,0.12)", icon: "📋" },
  SHORTLISTED: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: "⭐" },
  REJECTED:    { color: "#ff6584", bg: "rgba(255,101,132,0.12)", icon: "✕"  },
};

export default function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(res => { setApplications(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const counts = {
    APPLIED:     applications.filter(a => a.status === "APPLIED").length,
    SHORTLISTED: applications.filter(a => a.status === "SHORTLISTED").length,
    REJECTED:    applications.filter(a => a.status === "REJECTED").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.4rem" }}>My Applications</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Track your job application status</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Applied",     val: counts.APPLIED,     color: "#6c63ff" },
            { label: "Shortlisted", val: counts.SHORTLISTED, color: "#f59e0b" },
            { label: "Rejected",    val: counts.REJECTED,    color: "#ff6584" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "1.5rem",
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-head)", color: s.color }}>{s.val}</div>
              <div style={{ color: "var(--text2)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applications List */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700 }}>Application History</span>
            <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>{applications.length} total</span>
          </div>

          <div style={{ padding: "1rem" }}>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "80px", marginBottom: "0.75rem" }} />
              ))
            ) : applications.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--text2)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
                <p>No applications yet.</p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>Browse jobs and start applying!</p>
              </div>
            ) : applications.map(app => (
              <div key={app.id}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                style={{
                  padding: "1.25rem 1.5rem", borderRadius: "var(--radius)", marginBottom: "0.75rem",
                  border: "1px solid var(--border)", background: "var(--surface2)",
                  display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center",
                  transition: "var(--transition)", animation: "fadeIn 0.3s ease",
                }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "var(--font-head)", marginBottom: "0.3rem" }}>
                    {app.job?.title || "Job"}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {app.job?.recruiter?.name && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>🏢 {app.job.recruiter.name}</span>}
                    {app.job?.location && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>📍 {app.job.location}</span>}
                    {app.job?.salary && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>💰 ₹{(app.job.salary / 100000).toFixed(1)}L</span>}
                  </div>
                </div>
                <div style={{
                  padding: "0.4rem 1rem", borderRadius: "20px",
                  background: STATUS_CONFIG[app.status]?.bg || "var(--surface)",
                  color: STATUS_CONFIG[app.status]?.color || "var(--text2)",
                  fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.5px",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {STATUS_CONFIG[app.status]?.icon} {app.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
