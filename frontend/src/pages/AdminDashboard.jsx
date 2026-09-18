import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard({ setPage }) {
  const [admin, setAdmin] = useState(null);

  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);

  const [showUsers, setShowUsers] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSystemStatus, setShowSystemStatus] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await API.get(
          `/auth/me?token=${token}`
        );

        if (response.data?.role !== "admin") {
          setError("Access denied. Admin privileges required.");
          return;
        }

        setAdmin(response.data);

      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Unable to verify admin access."
        );
      }
    };

    checkAdmin();
  }, []);

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return null;
    }

    return token;
  };

  const loadUsers = async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) return;

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

  const loadPredictions = async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) return;

      const response = await API.get(
        `/health/admin?token=${token}`
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

  const loadProfiles = async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) return;

      const response = await API.get(
        `/health/admin/health-profiles?token=${token}`
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

  const loadSystemStatus = async () => {
    try {
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) return;

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("home");
  };

  if (error && !admin) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <h1>Admin Dashboard</h1>

          <div className="admin-error">
            ⚠️ {error}
          </div>

          <button
            className="admin-back-button"
            onClick={() => setPage("login")}
          >
            Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-tag">
              HEALTHFORECAST AI
            </p>

            <h1>
              Admin Dashboard 👨‍💼
            </h1>

            <p>
              Manage and monitor the HealthForecast AI application.
            </p>
          </div>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        {admin && (
          <div className="admin-welcome-card">
            <div className="admin-welcome-icon">
              🛡️
            </div>

            <div>
              <h2>
                Welcome, {admin.username}
              </h2>

              <p>
                You are logged in with administrator privileges.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div className="admin-success">
            ✅ {message}
          </div>
        )}

        <div className="admin-card-grid">

          <div className="admin-action-card">
            <div className="admin-card-icon">
              👥
            </div>

            <h2>
              User Management
            </h2>

            <p>
              Manage registered users and monitor account information.
            </p>

            <button
              onClick={loadUsers}
            >
              Manage Users →
            </button>
          </div>

          <div className="admin-action-card">
            <div className="admin-card-icon">
              📊
            </div>

            <h2>
              Prediction Monitoring
            </h2>

            <p>
              Monitor heart disease prediction activity across the application.
            </p>

            <button
              onClick={loadPredictions}
            >
              View Predictions →
            </button>
          </div>

          <div className="admin-action-card">
            <div className="admin-card-icon">
              🩺
            </div>

            <h2>
              Health Profiles
            </h2>

            <p>
              Review application health profile activity and statistics.
            </p>

            <button
              onClick={loadProfiles}
            >
              View Profiles →
            </button>
          </div>

          <div className="admin-action-card">
            <div className="admin-card-icon">
              ⚙️
            </div>

            <h2>
              System Status
            </h2>

            <p>
              Monitor the status of the HealthForecast AI system.
            </p>

            <button
              onClick={loadSystemStatus}
            >
              System Status →
            </button>
          </div>

        </div>

        {showUsers && (
          <div className="admin-data-card">

            <div className="admin-section-header">
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

            {users.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
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
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          {user.is_active
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No users found.</p>
            )}

          </div>
        )}

        {showPredictions && (
          <div className="admin-data-card">

            <div className="admin-section-header">
              <div>
                <h2>
                  📊 Prediction Monitoring
                </h2>

                <p>
                  Total predictions: {predictions.length}
                </p>
              </div>

              <button
                onClick={() => setShowPredictions(false)}
              >
                ✕ Close
              </button>
            </div>

            {predictions.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Prediction</th>
                      <th>Result</th>
                      <th>Risk %</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {predictions.map((prediction) => (
                      <tr key={prediction.id}>
                        <td>{prediction.id}</td>
                        <td>{prediction.user_id}</td>
                        <td>{prediction.prediction}</td>
                        <td>{prediction.result}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No predictions found.</p>
            )}

          </div>
        )}

        {showProfiles && (
          <div className="admin-data-card">

            <div className="admin-section-header">
              <div>
                <h2>
                  🩺 Health Profiles
                </h2>

                <p>
                  Total profiles: {profiles.length}
                </p>
              </div>

              <button
                onClick={() => setShowProfiles(false)}
              >
                ✕ Close
              </button>
            </div>

            {profiles.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User ID</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Height</th>
                      <th>Weight</th>
                      <th>Blood Pressure</th>
                      <th>Blood Sugar</th>
                      <th>Activity</th>
                    </tr>
                  </thead>

                  <tbody>
                    {profiles.map((profile) => (
                      <tr key={profile.id}>
                        <td>{profile.id}</td>
                        <td>{profile.user_id}</td>
                        <td>{profile.age}</td>
                        <td>{profile.gender}</td>
                        <td>{profile.height} cm</td>
                        <td>{profile.weight} kg</td>
                        <td>{profile.blood_pressure}</td>
                        <td>{profile.blood_sugar}</td>
                        <td>{profile.physical_activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No health profiles found.</p>
            )}

          </div>
        )}

        {showSystemStatus && systemStatus && (
          <div className="admin-data-card">

            <div className="admin-section-header">
              <div>
                <h2>
                  ⚙️ System Status
                </h2>

                <p>
                  Current HealthForecast AI system information.
                </p>
              </div>

              <button
                onClick={() => setShowSystemStatus(false)}
              >
                ✕ Close
              </button>
            </div>

            <div className="system-status-grid">

              {Object.entries(systemStatus).map(
                ([key, value]) => (
                  <div
                    className="system-status-item"
                    key={key}
                  >
                    <span>
                      {key.replaceAll("_", " ")}
                    </span>

                    <strong>
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </strong>
                  </div>
                )
              )}

            </div>

          </div>
        )}

        <button
          className="admin-return-button"
          onClick={() => setPage("dashboard")}
        >
          ← Return to Dashboard
        </button>

      </div>
    </div>
  );
}

export default AdminDashboard;