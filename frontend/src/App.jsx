import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobListings from "./pages/JobListings";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";

// Protect routes — redirect to /login if no token
const PrivateRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/jobs" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<PrivateRoute><JobListings /></PrivateRoute>} />
        <Route path="/recruiter" element={<PrivateRoute roles={["RECRUITER"]}><RecruiterDashboard /></PrivateRoute>} />
        <Route path="/candidate" element={<PrivateRoute roles={["CANDIDATE"]}><CandidateDashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export const getMyJobs = () => API.get("/jobs/my-jobs");