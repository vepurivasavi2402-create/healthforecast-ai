import { useEffect, useState } from "react";
import API from "../api";

function HealthProfile() {
  const [formData, setFormData] = useState({
    age: 19,
    gender: "Male",
    height: 188,
    weight: 100,
    blood_pressure: "120/80",
    blood_sugar: 90,
    smoking: "No",
    alcohol: "No",
    physical_activity: "High",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD EXISTING HEALTH PROFILE
  // ==========================================

  useEffect(() => {
    const loadHealthProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await API.get(
          `/health/profile?token=${token}`
        );

        const profile = response.data;

        setFormData({
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          blood_pressure: profile.blood_pressure,
          blood_sugar: profile.blood_sugar,
          smoking: profile.smoking,
          alcohol: profile.alcohol,
          physical_activity: profile.physical_activity,
        });

        setProfileExists(true);

      } catch (error) {

        if (error.response?.status === 404) {
          setProfileExists(false);
        } else {
          setError(
            error.response?.data?.detail ||
              "Unable to load health profile."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    loadHealthProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  // ==========================================
  // SAVE / UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      let response;

      if (profileExists) {

        response = await API.put(
          `/health/profile?token=${token}`,
          formData
        );

        setMessage(
          "Health profile updated successfully!"
        );

      } else {

        response = await API.post(
          `/health/profile?token=${token}`,
          formData
        );

        setProfileExists(true);

        setMessage(
          "Health profile saved successfully!"
        );
      }

    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Unable to save health profile."
      );
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="health-profile-page">
        <div className="health-profile-container">
          <div className="health-profile-header">
            <div className="health-profile-icon">
              ❤️
            </div>

            <h1>Health Profile</h1>

            <p>
              Loading your health information...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="health-profile-page">

      <div className="health-profile-container">

        <div className="health-profile-header">

          <div className="health-profile-icon">
            ❤️
          </div>

          <h1>
            {profileExists
              ? "Edit Health Profile"
              : "Health Profile"}
          </h1>

          <p>
            {profileExists
              ? "Update your health information to keep your profile accurate."
              : "Enter your basic health information to personalize your HealthForecast AI experience."}
          </p>

        </div>

        <form
          className="health-profile-form"
          onSubmit={handleSubmit}
        >

          <div className="health-form-grid">

            <div className="health-form-group">
              <label>Age</label>

              <input
                name="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className="health-form-group">
              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div className="health-form-group">
              <label>Height (cm)</label>

              <input
                name="height"
                type="number"
                min="1"
                value={formData.height}
                onChange={handleChange}
              />
            </div>

            <div className="health-form-group">
              <label>Weight (kg)</label>

              <input
                name="weight"
                type="number"
                min="1"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>

            <div className="health-form-group">
              <label>Blood Pressure</label>

              <input
                name="blood_pressure"
                type="text"
                placeholder="Example: 120/80"
                value={formData.blood_pressure}
                onChange={handleChange}
              />
            </div>

            <div className="health-form-group">
              <label>Blood Sugar (mg/dL)</label>

              <input
                name="blood_sugar"
                type="number"
                min="1"
                value={formData.blood_sugar}
                onChange={handleChange}
              />
            </div>

            <div className="health-form-group">
              <label>Smoking</label>

              <select
                name="smoking"
                value={formData.smoking}
                onChange={handleChange}
              >
                <option value="No">
                  No
                </option>

                <option value="Yes">
                  Yes
                </option>
              </select>
            </div>

            <div className="health-form-group">
              <label>Alcohol Consumption</label>

              <select
                name="alcohol"
                value={formData.alcohol}
                onChange={handleChange}
              >
                <option value="No">
                  No
                </option>

                <option value="Yes">
                  Yes
                </option>
              </select>
            </div>

            <div className="health-form-group">
              <label>Physical Activity</label>

              <select
                name="physical_activity"
                value={formData.physical_activity}
                onChange={handleChange}
              >
                <option value="Low">
                  Low
                </option>

                <option value="Moderate">
                  Moderate
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

          </div>

          <button
            className="save-health-button"
            type="submit"
          >
            {profileExists
              ? "✏️ Update Health Profile"
              : "💾 Save Health Profile"}
          </button>

        </form>

        {message && (
          <div className="health-success-message">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="health-error-message">
            ⚠️ {error}
          </div>
        )}

      </div>

    </div>
  );
}

export default HealthProfile;