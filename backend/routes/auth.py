from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from schemas import UserCreate, UserResponse, UserLogin

from auth.security import (
    hash_password,
    verify_password,
    create_access_token
)

from auth.dependencies import (
    get_current_user,
    require_role
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REGISTER
# =========================

@router.post("/register")
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    print("REGISTER ROUTE WAS CALLED")

    try:
        existing_user = db.query(User).filter(
            (User.username == user_data.username) |
            (User.email == user_data.email)
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username or email already exists"
            )

        if len(user_data.password) < 8:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 8 characters"
            )

        if len(user_data.password.encode("utf-8")) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password must not exceed 72 bytes"
            )

        hashed_password = hash_password(user_data.password)

        new_user = User(
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            role=user_data.role,
            is_active=True
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print("REGISTRATION SUCCESS:", new_user.id)

        return {
            "message": "Registration successful",
            "user_id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()

        print("REGISTRATION ERROR:", repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )


# =========================
# LOGIN
# =========================

@router.post("/login")
def login_user(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account is inactive"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role
    })

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================
# CURRENT USER
# =========================

@router.get("/me", response_model=UserResponse)
def me(
    current_user: User = Depends(get_current_user)
):
    return current_user


# =========================
# ADMIN TEST
# =========================

@router.get("/admin")
def admin_test(
    current_user: User = Depends(require_role("admin"))
):
    return {
        "message": "Welcome Admin",
        "username": current_user.username,
        "role": current_user.role
    }


# =========================
# GET ALL USERS - ADMIN ONLY
# =========================

@router.get("/users")
def get_all_users(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active
        }
        for user in users
    ]