import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard({ setPage }) {
  const [admin, setAdmin] = useState(null);

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);

  const [profiles, setProfiles] = useState([]);
  const [showProfiles, setShowProfiles] = useState(false);

  const [systemStatus, setSystemStatus] = useState(null);
  const [showSystemStatus, setShowSystemStatus] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CHECK ADMIN ACCESS
  // ==========================================

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await API.get(
          `/auth/admin?token=${token}`
        );

        setAdmin(response.data);
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Admin access denied."
        );
      }
    };

    checkAdminAccess();
  }, []);

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const handleManageUsers = async () => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await API.get(
        `/auth/users?token=${token}`
      );

      setUsers(response.data);
      setShowUsers(true);
      setShowPredictions(false);
      setShowProfiles(false);
      setShowSystemStatus(false);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to load users."
      );
    }
  };

  // ==========================================
  // GET ALL PREDICTIONS
  // ==========================================

  const handleViewPredictions = async () => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await API.get(
        `/health/admin/predictions?token=${token}`
      );

      setPredictions(response.data);
      setShowPredictions(true);
      setShowUsers(false);
      setShowProfiles(false);
      setShowSystemStatus(false);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to load predictions."
      );
    }
  };

  // ==========================================
  // GET ALL HEALTH PROFILES
  // ==========================================

  const handleViewProfiles = async () => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await API.get(
        `/health/admin/profiles?token=${token}`
      );

      setProfiles(response.data);
      setShowProfiles(true);
      setShowUsers(false);
      setShowPredictions(false);
      setShowSystemStatus(false);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to load health profiles."
      );
    }
  };

  // ==========================================
  // GET SYSTEM STATUS
  // ==========================================

  const handleSystemStatus = async () => {
    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await API.get(
        `/health/admin/system-status?token=${token}`
      );

      setSystemStatus(response.data);
      setShowSystemStatus(true);

      setShowUsers(false);
      setShowPredictions(false);
      setShowProfiles(false);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to load system status."
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("home");
  };

  // ==========================================
  // ACCESS DENIED
  // ==========================================

  if (error && !admin) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-error-card">

            <div className="admin-error-icon">
              🔒
            </div>

            <h1>
              Access Denied
            </h1>

            <p>
              {error}
            </p>

            <button
              className="admin-back-button"
              onClick={() => setPage("dashboard")}
            >
              ← Back to Dashboard
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  return (
    <div className="admin-page">

      <div className="admin-container">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <p className="admin-tag">
              HEALTHFORECAST AI
            </p>

            <h1>
              Admin Dashboard 👨‍💼
            </h1>

            <p>
              Manage and monitor the HealthForecast AI
              application.
            </p>

          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

        {/* ADMIN WELCOME */}

        {admin && (
          <div className="admin-card">

            <div className="admin-card-icon">
              🛡️
            </div>

            <div>

              <h2>
                Welcome, {admin.username}
              </h2>

              <p>
                You are logged in with administrator
                privileges.
              </p>

            </div>

          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && admin && (
          <div className="admin-message">
            ⚠️ {error}
          </div>
        )}

        {/* ADMIN FEATURES */}

        <div className="admin-grid">

          {/* USER MANAGEMENT */}

          <div className="admin-feature-card">

            <div className="admin-feature-icon">
              👥
            </div>

            <h3>
              User Management
            </h3>

            <p>
              Manage registered users and monitor
              account information.
            </p>

            <button
              onClick={handleManageUsers}
            >
              Manage Users →
            </button>

          </div>

          {/* PREDICTION MONITORING */}

          <div className="admin-feature-card">

            <div className="admin-feature-icon">
              📊
            </div>

            <h3>
              Prediction Monitoring
            </h3>

            <p>
              Monitor heart disease prediction activity
              across the application.
            </p>

            <button
              onClick={handleViewPredictions}
            >
              View Predictions →
            </button>

          </div>

          {/* HEALTH PROFILES */}

          <div className="admin-feature-card">

            <div className="admin-feature-icon">
              🩺
            </div>

            <h3>
              Health Profiles
            </h3>

            <p>
              Review application health profile activity
              and statistics.
            </p>

            <button
              onClick={handleViewProfiles}
            >
              View Profiles →
            </button>

          </div>

          {/* SYSTEM STATUS */}

          <div className="admin-feature-card">

            <div className="admin-feature-icon">
              ⚙️
            </div>

            <h3>
              System Status
            </h3>

            <p>
              Monitor the status of the HealthForecast AI
              system.
            </p>

            <button
              onClick={handleSystemStatus}
            >
              System Status →
            </button>

          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="admin-message">
            ℹ️ {message}
          </div>
        )}

        {/* ==========================================
            USER LIST
        ========================================== */}

        {showUsers && (

          <div className="admin-users-section">

            <div className="admin-users-header">

              <div>

                <h2>
                  👥 Registered Users
                </h2>

                <p>
                  Total users: {users.length}
                </p>

              </div>

              <button
                onClick={() => setShowUsers(false)}
              >
                ✕ Close
              </button>

            </div>

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {users.length > 0 ? (

                    users.map((user) => (

                      <tr key={user.id}>

                        <td>
                          {user.id}
                        </td>

                        <td>
                          {user.username}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.role}
                        </td>

                        <td>
                          {user.is_active
                            ? "Active"
                            : "Inactive"}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="5">
                        No users found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ==========================================
            PREDICTION LIST
        ========================================== */}

        {showPredictions && (

          <div className="admin-users-section">

            <div className="admin-users-header">

              <div>

                <h2>
                  📊 Prediction Monitoring
                </h2>

                <p>
                  Total predictions: {predictions.length}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowPredictions(false)
                }
              >
                ✕ Close
              </button>

            </div>

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Result</th>
                    <th>Risk Probability</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>

                  {predictions.length > 0 ? (

                    predictions.map((prediction) => (

                      <tr key={prediction.id}>

                        <td>
                          {prediction.id}
                        </td>

                        <td>
                          {prediction.username}
                        </td>

                        <td>
                          {prediction.result}
                        </td>

                        <td>
                          {prediction.risk_probability}%
                        </td>

                        <td>
                          {prediction.created_at
                            ? new Date(
                                prediction.created_at
                              ).toLocaleString()
                            : "N/A"}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="5">
                        No predictions found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ==========================================
            HEALTH PROFILE LIST
        ========================================== */}

        {showProfiles && (

          <div className="admin-users-section">

            <div className="admin-users-header">

              <div>

                <h2>
                  🩺 Health Profiles
                </h2>

                <p>
                  Total profiles: {profiles.length}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowProfiles(false)
                }
              >
                ✕ Close
              </button>

            </div>

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Blood Pressure</th>
                    <th>Blood Sugar</th>
                    <th>Smoking</th>
                    <th>Alcohol</th>
                    <th>Physical Activity</th>
                  </tr>
                </thead>

                <tbody>

                  {profiles.length > 0 ? (

                    profiles.map((profile) => (

                      <tr key={profile.id}>

                        <td>
                          {profile.id}
                        </td>

                        <td>
                          {profile.username}
                        </td>

                        <td>
                          {profile.age}
                        </td>

                        <td>
                          {profile.gender}
                        </td>

                        <td>
                          {profile.height} cm
                        </td>

                        <td>
                          {profile.weight} kg
                        </td>

                        <td>
                          {profile.blood_pressure}
                        </td>

                        <td>
                          {profile.blood_sugar}
                        </td>

                        <td>
                          {profile.smoking}
                        </td>

                        <td>
                          {profile.alcohol}
                        </td>

                        <td>
                          {profile.physical_activity}
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="11">
                        No health profiles found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* ==========================================
            SYSTEM STATUS
        ========================================== */}

        {showSystemStatus && systemStatus && (

          <div className="admin-users-section">

            <div className="admin-users-header">

              <div>

                <h2>
                  ⚙️ System Status
                </h2>

                <p>
                  Current HealthForecast AI system status
                </p>

              </div>

              <button
                onClick={() =>
                  setShowSystemStatus(false)
                }
              >
                ✕ Close
              </button>

            </div>

            <div className="admin-grid">

              <div className="admin-feature-card">

                <div className="admin-feature-icon">
                  🖥️
                </div>

                <h3>
                  Backend API
                </h3>

                <p>
                  {systemStatus.backend}
                </p>

              </div>

              <div className="admin-feature-card">

                <div className="admin-feature-icon">
                  🗄️
                </div>

                <h3>
                  Database
                </h3>

                <p>
                  {systemStatus.database}
                </p>

              </div>

              <div className="admin-feature-card">

                <div className="admin-feature-icon">
                  🤖
                </div>

                <h3>
                  ML Model
                </h3>

                <p>
                  {systemStatus.ml_model}
                </p>

              </div>

              <div className="admin-feature-card">

                <div className="admin-feature-icon">
                  🔐
                </div>

                <h3>
                  Authentication
                </h3>

                <p>
                  {systemStatus.authentication}
                </p>

              </div>

            </div>

          </div>

        )}

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <div className="admin-navigation">

          <button
            onClick={() =>
              setPage("dashboard")
            }
          >
            ← Return to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;