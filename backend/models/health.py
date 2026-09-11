from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from database import Base


# ==========================================
# HEALTH PROFILE
# ==========================================

class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    age = Column(Integer)
    gender = Column(String)
    height = Column(Float)
    weight = Column(Float)

    blood_pressure = Column(String)
    blood_sugar = Column(Float)

    smoking = Column(String)
    alcohol = Column(String)

    physical_activity = Column(String)


# ==========================================
# PREDICTION HISTORY
# ==========================================

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # ML input values
    age = Column(Float)
    sex = Column(Float)
    cp = Column(Float)
    trestbps = Column(Float)
    chol = Column(Float)
    fbs = Column(Float)
    restecg = Column(Float)
    thalach = Column(Float)
    exang = Column(Float)
    oldpeak = Column(Float)
    slope = Column(Float)
    ca = Column(Float)
    thal = Column(Float)

    # Prediction result
    prediction = Column(Integer)

    result = Column(String)

    risk_probability = Column(Float)

    # Date and time of prediction
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )