import { useEffect, useState } from "react";
import API from "../api";

// ==========================================
// RISK LEVEL HELPER
// ==========================================

const getRiskLevel = (probability) => {
  const value = Number(probability);

  if (value < 30) {
    return {
      label: "Low Risk",
      className: "low-risk",
      icon: "🟢",
    };
  }

  if (value < 60) {
    return {
      label: "Moderate Risk",
      className: "moderate-risk",
      icon: "🟡",
    };
  }

  return {
    label: "Higher Risk",
    className: "high-risk",
    icon: "🔴",
  };
};

// ==========================================
// DASHBOARD
// ==========================================

function Dashboard({ setPage }) {
  const [user, setUser] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("home");
  };

  // ==========================================
  // DELETE PREDICTION
  // ==========================================

  const handleDeletePrediction = async (predictionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this prediction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      await API.delete(
        `/health/prediction-history/${predictionId}?token=${token}`
      );

      setPredictions((previousPredictions) =>
        previousPredictions.filter(
          (prediction) => prediction.id !== predictionId
        )
      );

    } catch (error) {
      console.error(
        "DELETE PREDICTION ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to delete prediction."
      );
    }
  };

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        // ==========================================
        // USER INFORMATION
        // ==========================================

        const userResponse = await API.get(
          `/auth/me?token=${token}`
        );

        setUser(userResponse.data);

        // ==========================================
        // HEALTH PROFILE
        // ==========================================

        try {
          const healthResponse = await API.get(
            `/health/profile?token=${token}`
          );

          setHealthProfile(healthResponse.data);
        } catch {
          setHealthProfile(null);
        }

        // ==========================================
        // PREDICTION HISTORY
        // ==========================================

        try {
          const predictionResponse = await API.get(
            `/health/prediction-history?token=${token}`
          );

          setPredictions(predictionResponse.data);
        } catch {
          setPredictions([]);
        }

        // ==========================================
        // AI HEALTH INSIGHTS
        // ==========================================

        try {
          const insightsResponse = await API.get(
            `/health/insights?token=${token}`
          );

          setInsights(insightsResponse.data);
        } catch {
          setInsights(null);
        }

      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Unable to load dashboard."
        );
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <h1>Dashboard</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => setPage("login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD UI
  // ==========================================

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <p className="dashboard-tag">
              HEALTHFORECAST AI
            </p>

            <h1>
              Welcome to your Dashboard 👋
            </h1>

            <p>
              View your account, health information and
              prediction history in one place.
            </p>

          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

        {/* ACCOUNT INFORMATION */}

        {user && (
          <div className="dashboard-card">

            <h2>
              👤 Account Information
            </h2>

            <div className="dashboard-grid">

              <div>
                <span>Username</span>

                <strong>
                  {user.username}
                </strong>
              </div>

              <div>
                <span>Email</span>

                <strong>
                  {user.email}
                </strong>
              </div>

              <div>
                <span>Role</span>

                <strong>
                  {user.role}
                </strong>
              </div>

              <div>
                <span>Account Status</span>

                <strong>
                  {user.is_active
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>

            </div>

          </div>
        )}

        {/* HEALTH PROFILE */}

        <div className="dashboard-card health-profile-card">

          <h2>
            ❤️ Health Profile
          </h2>

          {healthProfile ? (

            <>

              <div className="dashboard-grid">

                <div>
                  <span>Age</span>

                  <strong>
                    {healthProfile.age}
                  </strong>
                </div>

                <div>
                  <span>Gender</span>

                  <strong>
                    {healthProfile.gender}
                  </strong>
                </div>

                <div>
                  <span>Height</span>

                  <strong>
                    {healthProfile.height} cm
                  </strong>
                </div>

                <div>
                  <span>Weight</span>

                  <strong>
                    {healthProfile.weight} kg
                  </strong>
                </div>

                <div>
                  <span>Blood Pressure</span>

                  <strong>
                    {healthProfile.blood_pressure}
                  </strong>
                </div>

                <div>
                  <span>Blood Sugar</span>

                  <strong>
                    {healthProfile.blood_sugar}
                  </strong>
                </div>

                <div>
                  <span>Smoking</span>

                  <strong>
                    {healthProfile.smoking}
                  </strong>
                </div>

                <div>
                  <span>Alcohol</span>

                  <strong>
                    {healthProfile.alcohol}
                  </strong>
                </div>

                <div>
                  <span>Physical Activity</span>

                  <strong>
                    {healthProfile.physical_activity}
                  </strong>
                </div>

              </div>

              <button
                type="button"
                className="edit-health-button"
                onClick={() =>
                  setPage("health-profile")
                }
              >
                ✏️ Edit Health Profile
              </button>

            </>

          ) : (

            <div className="empty-state">

              <p>
                No health profile has been added yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  setPage("health-profile")
                }
              >
                Add Health Profile
              </button>

            </div>

          )}

        </div>

        {/* AI HEALTH INSIGHTS */}

        {insights && (

          <div className="dashboard-card health-insights-card">

            <h2>
              🧠 AI Health Insights
            </h2>

            <p className="insights-description">
              Personalized insights generated from your
              saved health information.
            </p>

            <div className="insights-grid">

              <div className="insight-box">

                <span>
                  BMI
                </span>

                <strong>
                  {insights.bmi}
                </strong>

                <small>
                  {insights.bmi_category}
                </small>

              </div>

              <div className="insight-box">

                <span>
                  Blood Pressure
                </span>

                <strong>
                  {insights.blood_pressure}
                </strong>

                <small>
                  {insights.blood_pressure_status}
                </small>

              </div>

              <div className="insight-box">

                <span>
                  Blood Sugar
                </span>

                <strong>
                  {insights.blood_sugar}
                </strong>

                <small>
                  mg/dL
                </small>

              </div>

              <div className="insight-box">

                <span>
                  Physical Activity
                </span>

                <strong>
                  {insights.physical_activity}
                </strong>

                <small>
                  Activity Level
                </small>

              </div>

            </div>

            <div className="insight-message">

              <strong>
                💡 Activity Insight
              </strong>

              <p>
                {insights.activity_message}
              </p>

            </div>

            {insights.lifestyle_insights?.length > 0 && (

              <div className="lifestyle-insights">

                <h3>
                  🌱 Lifestyle Insights
                </h3>

                {insights.lifestyle_insights.map(
                  (message, index) => (

                    <div
                      className="lifestyle-item"
                      key={index}
                    >

                      <span>
                        ✓
                      </span>

                      <p>
                        {message}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

            <p className="insights-disclaimer">
              These insights are generated from the information
              provided in your profile and are intended for
              educational purposes only.
            </p>

          </div>

        )}

        {/* PREDICTION SUMMARY */}

        <div className="dashboard-card prediction-dashboard-card">

          <div className="dashboard-card-icon">
            📊
          </div>

          <h2>
            Heart Disease Prediction
          </h2>

          {predictions.length > 0 ? (

            <>

              <p>
                Latest risk assessment:
              </p>

              <div className="latest-prediction">

                <strong>
                  {predictions[0].result}
                </strong>

                <span>
                  {predictions[0].risk_probability}%
                </span>

              </div>

            </>

          ) : (

            <p>
              No prediction has been made yet.
            </p>

          )}

          <button
            type="button"
            onClick={() =>
              setPage("prediction")
            }
          >
            Start Prediction →
          </button>

        </div>

        {/* PREDICTION HISTORY */}

        <div className="dashboard-card">

          <h2>
            📈 Prediction History
          </h2>

          {predictions.length > 0 ? (

            <div className="prediction-history">

              {predictions.map((prediction) => {

                const risk = getRiskLevel(
                  prediction.risk_probability
                );

                return (

                  <div
                    className="prediction-history-item"
                    key={prediction.id}
                  >

                    {/* RESULT */}

                    <div className="prediction-history-main">

                      <strong>
                        {prediction.result}
                      </strong>

                      <span>
                        Risk Probability:{" "}
                        {prediction.risk_probability}%
                      </span>

                    </div>

                    {/* RISK BADGE */}

                    <div
                      className={`prediction-risk-badge ${risk.className}`}
                    >

                      <span>
                        {risk.icon}
                      </span>

                      <strong>
                        {risk.label}
                      </strong>

                    </div>

                    {/* DATE */}

                    <div className="prediction-date">

                      {prediction.created_at
                        ? new Date(
                            prediction.created_at
                          ).toLocaleString()
                        : "Date unavailable"}

                    </div>

                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-prediction-button"
                      onClick={() =>
                        handleDeletePrediction(
                          prediction.id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                );
              })}

            </div>

          ) : (

            <div className="empty-state">

              <p>
                Your prediction history will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  setPage("prediction")
                }
              >
                Make Your First Prediction
              </button>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;