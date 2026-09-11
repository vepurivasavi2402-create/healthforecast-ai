from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from database import get_db
from models.health import HealthProfile, PredictionHistory
from schemas import (
    HealthProfileCreate,
    HealthProfileResponse,
    HeartDiseasePredictRequest
)
from auth.dependencies import get_current_user, require_role
from models.user import User

import joblib
import pandas as pd
from pathlib import Path


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


# =========================
# GET HEALTH PROFILE
# =========================

@router.get(
    "/profile",
    response_model=HealthProfileResponse
)
def get_health_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Health profile not found"
        )

    return profile


# =========================
# CREATE HEALTH PROFILE
# =========================

@router.post(
    "/profile",
    response_model=HealthProfileResponse
)
def create_health_profile(
    health_data: HealthProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Health profile already exists"
        )

    profile = HealthProfile(
        user_id=current_user.id,
        age=health_data.age,
        gender=health_data.gender,
        height=health_data.height,
        weight=health_data.weight,
        blood_pressure=health_data.blood_pressure,
        blood_sugar=health_data.blood_sugar,
        smoking=health_data.smoking,
        alcohol=health_data.alcohol,
        physical_activity=health_data.physical_activity
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


# =========================
# UPDATE HEALTH PROFILE
# =========================

@router.put(
    "/profile",
    response_model=HealthProfileResponse
)
def update_health_profile(
    health_data: HealthProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Health profile not found"
        )

    profile.age = health_data.age
    profile.gender = health_data.gender
    profile.height = health_data.height
    profile.weight = health_data.weight
    profile.blood_pressure = health_data.blood_pressure
    profile.blood_sugar = health_data.blood_sugar
    profile.smoking = health_data.smoking
    profile.alcohol = health_data.alcohol
    profile.physical_activity = health_data.physical_activity

    db.commit()
    db.refresh(profile)

    return profile


# =========================
# HEART DISEASE PREDICTION
# =========================

@router.post("/predict")
def predict_heart_disease(
    data: HeartDiseasePredictRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        base_path = Path(__file__).resolve().parents[2]

        model_path = (
            base_path /
            "ml" /
            "heart_disease_model.pkl"
        )

        scaler_path = (
            base_path /
            "ml" /
            "scaler.pkl"
        )

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        input_data = pd.DataFrame([{
            "age": data.age,
            "sex": data.sex,
            "cp": data.cp,
            "trestbps": data.trestbps,
            "chol": data.chol,
            "fbs": data.fbs,
            "restecg": data.restecg,
            "thalach": data.thalach,
            "exang": data.exang,
            "oldpeak": data.oldpeak,
            "slope": data.slope,
            "ca": data.ca,
            "thal": data.thal
        }])

        input_scaled = scaler.transform(input_data)

        prediction = model.predict(input_scaled)[0]

        probability = model.predict_proba(
            input_scaled
        )[0][1]

        if prediction == 1:
            result = "Higher risk of heart disease"
        else:
            result = "Lower risk of heart disease"

        risk_probability = round(
            float(probability) * 100,
            2
        )

        prediction_history = PredictionHistory(
            user_id=current_user.id,
            age=data.age,
            sex=data.sex,
            cp=data.cp,
            trestbps=data.trestbps,
            chol=data.chol,
            fbs=data.fbs,
            restecg=data.restecg,
            thalach=data.thalach,
            exang=data.exang,
            oldpeak=data.oldpeak,
            slope=data.slope,
            ca=data.ca,
            thal=data.thal,
            prediction=int(prediction),
            result=result,
            risk_probability=risk_probability
        )

        db.add(prediction_history)
        db.commit()
        db.refresh(prediction_history)

        return {
            "id": prediction_history.id,
            "user_id": current_user.id,
            "prediction": int(prediction),
            "result": result,
            "risk_probability": risk_probability,
            "created_at": prediction_history.created_at
        }

    except Exception as e:
        db.rollback()

        print(
            "PREDICTION ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


# =========================
# USER PREDICTION HISTORY
# =========================

@router.get("/prediction-history")
def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    predictions = db.query(
        PredictionHistory
    ).filter(
        PredictionHistory.user_id == current_user.id
    ).order_by(
        PredictionHistory.created_at.desc()
    ).all()

    return predictions


# =========================
# ADMIN PREDICTION MONITORING
# =========================

@router.get("admin")
def get_all_predictions(
    current_user: User = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    predictions = db.query(
        PredictionHistory,
        User.username
    ).join(
        User,
        PredictionHistory.user_id == User.id
    ).order_by(
        PredictionHistory.created_at.desc()
    ).all()

    return [
        {
            "id": prediction.id,
            "user_id": prediction.user_id,
            "username": username,
            "prediction": prediction.prediction,
            "result": prediction.result,
            "risk_probability": prediction.risk_probability,
            "created_at": prediction.created_at
        }
        for prediction, username in predictions
    ]


# =========================
# ADMIN HEALTH PROFILES
# =========================

require_role("admin")
def get_all_health_profiles(
    current_user: User = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    profiles = db.query(
        HealthProfile,
        User.username
    ).join(
        User,
        HealthProfile.user_id == User.id
    ).order_by(
        HealthProfile.id.desc()
    ).all()

    return [
        {
            "id": profile.id,
            "user_id": profile.user_id,
            "username": username,
            "age": profile.age,
            "gender": profile.gender,
            "height": profile.height,
            "weight": profile.weight,
            "blood_pressure": profile.blood_pressure,
            "blood_sugar": profile.blood_sugar,
            "smoking": profile.smoking,
            "alcohol": profile.alcohol,
            "physical_activity": profile.physical_activity
        }
        for profile, username in profiles
    ]
# =========================
# ADMIN SYSTEM STATUS
# =========================

@router.get("/admin/system-status")
def get_system_status(
    current_user: User = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    database_status = "Online"

    try:
        db.execute(text("SELECT 1"))
    except Exception:
        database_status = "Offline"

    model_path = (
        Path(__file__).resolve().parents[2]
        / "ml"
        / "heart_disease_model.pkl"
    )

    scaler_path = (
        Path(__file__).resolve().parents[2]
        / "ml"
        / "scaler.pkl"
    )

    model_status = (
        "Available"
        if model_path.exists() and scaler_path.exists()
        else "Unavailable"
    )

    return {
        "backend": "Online",
        "database": database_status,
        "ml_model": model_status,
        "authentication": "Active"
    }