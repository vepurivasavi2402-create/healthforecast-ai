from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from database import Base


# ==========================================
# HEALTH PROFILE
# ==========================================

class HealthProfile(Base):
    __tablename__ = "health_profiles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    age: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    gender: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    height: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    weight: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    blood_pressure: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    blood_sugar: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    smoking: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    alcohol: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    physical_activity: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )


# ==========================================
# PREDICTION HISTORY
# ==========================================

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    age: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    sex: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    cp: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    trestbps: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    chol: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    fbs: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    restecg: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    thalach: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    exang: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    oldpeak: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    slope: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    ca: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    thal: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    prediction: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    result: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    risk_probability: Mapped[float | None] = mapped_column(
        Float,
        nullable=True
    )

    created_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )