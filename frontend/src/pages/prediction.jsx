import { useEffect, useState } from "react";
import API, { predictHeartDisease } from "../api";

function Prediction() {
  const initialFormData = {
    age: 19,
    sex: 1,
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    const loadHealthProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await API.get(
          `/health/profile?token=${token}`
        );

        const profile = response.data;

        let systolicBP = "";

        if (profile.blood_pressure) {
          const bpParts =
            profile.blood_pressure.split("/");

          if (bpParts.length > 0) {
            const parsedBP = Number(bpParts[0]);

            if (!isNaN(parsedBP)) {
              systolicBP = parsedBP;
            }
          }
        }

        setFormData((previousData) => ({
          ...previousData,

          age:
            Number(profile.age) ||
            previousData.age,

          sex:
            profile.gender?.toLowerCase() === "female"
              ? 0
              : 1,

          trestbps: systolicBP,
        }));

        setProfileLoaded(true);

      } catch {
        console.log(
          "Health profile not available yet."
        );
      }
    };

    loadHealthProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        value === ""
          ? ""
          : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setResult(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const requiredFields = [
        "age",
        "sex",
        "cp",
        "trestbps",
        "chol",
        "fbs",
        "restecg",
        "thalach",
        "exang",
        "oldpeak",
        "slope",
        "ca",
        "thal",
      ];

      const missingField = requiredFields.find(
        (field) =>
          formData[field] === "" ||
          formData[field] === null ||
          formData[field] === undefined
      );

      if (missingField) {
        setError(
          "Please complete all clinical information before making a prediction."
        );
        return;
      }

      const predictionData = {
        age: Number(formData.age),
        sex: Number(formData.sex),
        cp: Number(formData.cp),
        trestbps: Number(formData.trestbps),
        chol: Number(formData.chol),
        fbs: Number(formData.fbs),
        restecg: Number(formData.restecg),
        thalach: Number(formData.thalach),
        exang: Number(formData.exang),
        oldpeak: Number(formData.oldpeak),
        slope: Number(formData.slope),
        ca: Number(formData.ca),
        thal: Number(formData.thal),
      };

      const data = await predictHeartDisease(
        token,
        predictionData
      );

      setResult(data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Prediction failed. Please try again."
      );
    }
  };

  const getRiskLevel = (probability) => {
    if (probability < 30) {
      return {
        level: "Low Risk",
        className: "low-risk",
        icon: "🟢",
      };
    }

    if (probability < 60) {
      return {
        level: "Moderate Risk",
        className: "moderate-risk",
        icon: "🟡",
      };
    }

    return {
      level: "Higher Risk",
      className: "high-risk",
      icon: "🔴",
    };
  };

  const handleNewPrediction = () => {
    setResult(null);
    setError("");

    setFormData((previousData) => ({
      ...initialFormData,
      age: previousData.age,
      sex: previousData.sex,
      trestbps: previousData.trestbps,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="prediction-page">
      <div className="prediction-container">

        <div className="prediction-header">

          <div className="prediction-icon">
            ❤️
          </div>

          <h1>
            Heart Disease Risk Prediction
          </h1>

          <p>
            Use our machine learning model to estimate
            your cardiovascular risk based on the
            health and clinical information provided.
          </p>

          {profileLoaded && (
            <div className="profile-loaded-message">
              ✅ Your saved age, gender and blood
              pressure information has been loaded
              automatically.
            </div>
          )}

        </div>

        <form
          className="prediction-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section">

            <h2>
              👤 Personal Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Age
                </label>

                <input
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Sex
                </label>

                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >

                  <option value="1">
                    Male
                  </option>

                  <option value="0">
                    Female
                  </option>

                </select>

              </div>

            </div>

          </div>

          <div className="form-section">

            <h2>
              🫀 Clinical Information
            </h2>

            <div className="clinical-info-note">

              <div className="clinical-info-title">
                ℹ️ About the clinical data
              </div>

              <p>
                Enter your recent health measurements
                or values from medical test reports
                where available.
              </p>

              <p>
                These clinical parameters are important
                inputs used by the machine learning model
                to estimate cardiovascular risk.
              </p>

              <p>
                If you do not know a clinical value,
                do not guess it. Use a recent medical
                report or consult a healthcare professional.
              </p>

            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Chest Pain Type
                </label>

                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select chest pain type
                  </option>

                  <option value="0">
                    Typical Angina
                  </option>

                  <option value="1">
                    Atypical Angina
                  </option>

                  <option value="2">
                    Non-Anginal Pain
                  </option>

                  <option value="3">
                    Asymptomatic
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  Resting Blood Pressure (mm Hg)
                </label>

                <input
                  name="trestbps"
                  type="number"
                  min="50"
                  max="250"
                  value={formData.trestbps}
                  onChange={handleChange}
                  placeholder="Example: 120"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Cholesterol (mg/dL)
                </label>

                <input
                  name="chol"
                  type="number"
                  min="50"
                  max="700"
                  value={formData.chol}
                  onChange={handleChange}
                  placeholder="Example: 200"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Fasting Blood Sugar
                </label>

                <select
                  name="fbs"
                  value={formData.fbs}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select blood sugar status
                  </option>

                  <option value="0">
                    Normal
                  </option>

                  <option value="1">
                    High
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  Resting ECG
                </label>

                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select ECG result
                  </option>

                  <option value="0">
                    Normal
                  </option>

                  <option value="1">
                    ST-T Wave Abnormality
                  </option>

                  <option value="2">
                    Left Ventricular Hypertrophy
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  Maximum Heart Rate
                </label>

                <input
                  name="thalach"
                  type="number"
                  min="50"
                  max="250"
                  value={formData.thalach}
                  onChange={handleChange}
                  placeholder="Example: 170"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Exercise-Induced Angina
                </label>

                <select
                  name="exang"
                  value={formData.exang}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select option
                  </option>

                  <option value="0">
                    No
                  </option>

                  <option value="1">
                    Yes
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  ST Depression (Oldpeak)
                </label>

                <input
                  name="oldpeak"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.oldpeak}
                  onChange={handleChange}
                  placeholder="Example: 1.2"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Slope
                </label>

                <select
                  name="slope"
                  value={formData.slope}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select slope
                  </option>

                  <option value="0">
                    Upsloping
                  </option>

                  <option value="1">
                    Flat
                  </option>

                  <option value="2">
                    Downsloping
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  Number of Major Vessels (CA)
                </label>

                <select
                  name="ca"
                  value={formData.ca}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select number of vessels
                  </option>

                  <option value="0">
                    0
                  </option>

                  <option value="1">
                    1
                  </option>

                  <option value="2">
                    2
                  </option>

                  <option value="3">
                    3
                  </option>

                </select>
              </div>

              <div className="form-group">
                <label>
                  Thalassemia (Thal)
                </label>

                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select result
                  </option>

                  <option value="0">
                    Unknown
                  </option>

                  <option value="1">
                    Normal
                  </option>

                  <option value="2">
                    Fixed Defect
                  </option>

                  <option value="3">
                    Reversible Defect
                  </option>

                </select>
              </div>

            </div>

          </div>

          <button
            className="predict-button"
            type="submit"
          >
            🔍 Predict Heart Disease Risk
          </button>

        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {result && (

          <div className="result-card">

            <div className="result-icon">
              📊
            </div>

            <h2>
              Prediction Result
            </h2>

            <p className="result-text">
              {result.result}
            </p>

            <div className="risk-value">
              {result.risk_probability}%
            </div>

            <p className="risk-label">
              Estimated Risk Probability
            </p>

            {(() => {

              const risk = getRiskLevel(
                Number(result.risk_probability)
              );

              return (
                <div
                  className={`risk-level ${risk.className}`}
                >
                  <span>
                    {risk.icon}
                  </span>

                  <strong>
                    {risk.level}
                  </strong>
                </div>
              );

            })()}

            <div className="risk-meter">

              <div className="risk-meter-labels">

                <span>
                  Low
                </span>

                <span>
                  High
                </span>

              </div>

              <div className="risk-meter-track">

                <div
                  className="risk-meter-fill"
                  style={{
                    width: `${Math.min(
                      Number(result.risk_probability),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            <div className="result-explanation">

              <h3>
                💡 What does this mean?
              </h3>

              <p>
                This result is an AI-based estimate
                generated from the health and clinical
                information entered into the prediction
                form.
              </p>

              <p>
                A lower percentage indicates a lower
                estimated risk according to this model,
                while a higher percentage indicates a
                higher estimated risk.
              </p>

            </div>

            <div className="recommended-action">

              <h3>
                📋 Recommended Action
              </h3>

              {Number(result.risk_probability) < 30 ? (

                <p>
                  Your estimated risk is currently low
                  according to this model. Continue
                  maintaining a healthy lifestyle, regular
                  physical activity and balanced nutrition.
                </p>

              ) : Number(result.risk_probability) < 60 ? (

                <p>
                  Your estimated risk falls into the
                  moderate range according to this model.
                  Consider improving your lifestyle habits
                  and discussing your risk factors with a
                  healthcare professional.
                </p>

              ) : (

                <p>
                  Your estimated risk is relatively high
                  according to this model. Consider
                  discussing your health information and
                  risk factors with a qualified healthcare
                  professional.
                </p>

              )}

            </div>

            <p className="result-disclaimer">
              ⚠️ This prediction is intended for
              educational purposes only and is not a
              medical diagnosis. Consult a qualified
              healthcare professional for medical advice.
            </p>

            <button
              className="new-prediction-button"
              type="button"
              onClick={handleNewPrediction}
            >
              🔄 Make Another Prediction
            </button>

          </div>

        )}

      </div>
    </div>
  );
}

export default Prediction;