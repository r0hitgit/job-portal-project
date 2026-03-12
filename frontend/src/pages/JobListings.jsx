import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getJobs, applyForJob } from "../api/axios";

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState(new Set());
  const [toast, setToast] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
      getJobs().then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleApply = async (jobId) => {
    try {
      await applyForJob(jobId);
      setApplied(prev => new Set([...prev, jobId]));
      showToast("✅ Application submitted!");
    } catch (err) {
      showToast("❌ " + (err.response?.data || "Already applied or error occurred"));
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase()) ||
    j.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Find Your Next Role</h1>
          <p style={{ color: "var(--text2)" }}>{jobs.length} opportunities available</p>
        </div>

        {/* Search */}
        <input
          placeholder="🔍  Search by title, location, or keyword..."
          value={search} onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = "var(--accent)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
          style={{
            width: "100%", padding: "0.85rem 1.25rem", marginBottom: "2rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", color: "var(--text)", fontSize: "0.95rem", outline: "none",
          }}
        />

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "220px" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text2)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p>No jobs found matching your search</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {filtered.map(job => (
              <div key={job.id}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "1.75rem",
                  transition: "var(--transition)", animation: "fadeIn 0.4s ease",
                }}>
                {/* Top */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-head)", marginBottom: "0.2rem" }}>{job.title}</div>
                    <div style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 500 }}>{job.recruiter?.name || "Company"}</div>
                  </div>
                  {job.salary && (
                    <span style={{ background: "rgba(67,233,123,0.12)", color: "#43e97b", padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                      ₹{(job.salary / 100000).toFixed(1)}L
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{ color: "var(--text2)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                  {job.description?.substring(0, 100)}{job.description?.length > 100 ? "..." : ""}
                </p>

                {/* Meta */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {job.location && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>📍 {job.location}</span>}
                  {job.postedDate && <span style={{ color: "var(--text2)", fontSize: "0.8rem" }}>📅 {new Date(job.postedDate).toLocaleDateString()}</span>}
                </div>

                {/* Apply Button — only for CANDIDATE */}
                {role === "CANDIDATE" && (
                  applied.has(job.id) ? (
                    <div style={{ width: "100%", padding: "0.65rem", textAlign: "center", background: "rgba(67,233,123,0.1)", color: "#43e97b", border: "1px solid rgba(67,233,123,0.3)", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem" }}>
                      ✓ Applied
                    </div>
                  ) : (
                    <button onClick={() => handleApply(job.id)} style={{
                      width: "100%", padding: "0.65rem",
                      background: "linear-gradient(135deg, var(--accent), #8b85ff)",
                      color: "#fff", border: "none", borderRadius: "var(--radius)",
                      fontWeight: 600, fontSize: "0.875rem", fontFamily: "var(--font-head)",
                      cursor: "pointer", transition: "var(--transition)",
                    }}
                      onMouseEnter={e => e.target.style.opacity = "0.85"}
                      onMouseLeave={e => e.target.style.opacity = "1"}>
                      Apply Now
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "2rem", right: "2rem",
          background: "var(--surface2)", border: "1px solid var(--border)",
          padding: "1rem 1.5rem", borderRadius: "var(--radius)",
          fontSize: "0.9rem", boxShadow: "var(--shadow)", animation: "fadeIn 0.3s ease", zIndex: 1000,
        }}>{toast}</div>
      )}
    </div>
  );
}
