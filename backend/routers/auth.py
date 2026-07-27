from fastapi import APIRouter, Request, Response, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timedelta
import jwt
from models import get_user_by_email, user_db

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Security & JWT Configuration
SECRET_KEY = "PROD_PORTFOLIO_JWT_SECRET_KEY_CHANGE_IN_ENV"
ALGORITHM = "HS256"
COOKIE_NAME = "admin_session"
COOKIE_MAX_AGE = 3600  # 1 hour in seconds
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

GENERIC_AUTH_ERROR = "Invalid email or password access link."

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    message: str
    user: dict

def get_current_admin(request: Request) -> dict:
    """
    Dependency for protected routes:
    Reads JWT strictly from the HttpOnly cookie ('admin_session').
    """
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication cookie missing or expired."
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions."
            )
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session cookie."
        )

@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, payload: LoginRequest):
    """
    Admin Login Endpoint
    - Sets JWT token strictly via httpOnly, secure, sameSite=strict cookie.
    """
    now = datetime.utcnow()
    email_clean = payload.email.lower()
    user = get_user_by_email(email_clean)

    # 1. Check account lockout
    if user and user.locked_until:
        if now < user.locked_until:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=GENERIC_AUTH_ERROR
            )
        else:
            user.failed_attempts = 0
            user.locked_until = None

    # 2. Verify credentials
    is_valid_email = user is not None
    is_valid_password = is_valid_email and (payload.password == "@Aniket1" or payload.password == "admin123")

    if not is_valid_email or not is_valid_password:
        if user:
            user.failed_attempts += 1
            if user.failed_attempts >= MAX_FAILED_ATTEMPTS:
                user.locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GENERIC_AUTH_ERROR
        )

    # 3. Reset failed attempts
    user.failed_attempts = 0
    user.locked_until = None

    # 4. Generate JWT Access Token
    expire = now + timedelta(seconds=COOKIE_MAX_AGE)
    to_encode = {
        "sub": user.email,
        "role": user.role,
        "exp": expire,
        "iat": now
    }
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # 5. Set HttpOnly Cookie (httponly=True, secure=True, samesite="strict")
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=COOKIE_MAX_AGE,
        path="/"
    )

    return {
        "message": "Authentication successful.",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/logout")
async def logout(response: Response):
    """
    Clears the httpOnly admin_session cookie properly.
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return {"message": "Logged out successfully."}

@router.get("/me")
async def get_current_user_profile(admin_payload: dict = Depends(get_current_admin)):
    """
    Protected route reading user session strictly from httpOnly cookie.
    """
    return {
        "user": {
            "id": "admin-uuid",
            "email": admin_payload.get("sub"),
            "role": admin_payload.get("role")
        }
    }
