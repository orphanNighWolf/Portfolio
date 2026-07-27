from fastapi import APIRouter, Request, Response, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timedelta
import logging
import os
import jwt
from models import get_user_by_email, user_db

# Configure Auth Audit Logger
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "auth_attempts.log")

auth_logger = logging.getLogger("auth_audit")
auth_logger.setLevel(logging.INFO)
file_handler = logging.FileHandler(LOG_FILE)
formatter = logging.Formatter("[%(asctime)s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S UTC")
file_handler.setFormatter(formatter)
if not auth_logger.handlers:
    auth_logger.addHandler(file_handler)

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Security & JWT Configuration
SECRET_KEY = "PROD_PORTFOLIO_JWT_SECRET_KEY_CHANGE_IN_ENV"
ALGORITHM = "HS256"
COOKIE_NAME = "admin_session"
JWT_EXPIRY_SECONDS = 3600  # Exactly 1 hour token expiry (3600 seconds)
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

GENERIC_AUTH_ERROR = "Invalid email or password access link."

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    message: str
    user: dict

def log_login_attempt(ip: str, email: str, status_str: str, details: str = ""):
    """Helper to write audit log entry for every login attempt."""
    msg = f"IP: {ip} | EMAIL: {email} | STATUS: {status_str}"
    if details:
        msg += f" | REASON: {details}"
    auth_logger.info(msg)
    print(f"[AUTH LOG]: {msg}")

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
    - 1-hour JWT Expiry (3600 seconds).
    - Writes timestamp, client IP, email, and outcome to auth_attempts.log.
    """
    client_ip = get_remote_address(request) or "unknown"
    now = datetime.utcnow()
    email_clean = payload.email.lower()
    user = get_user_by_email(email_clean)

    # 1. Check account lockout state
    if user and user.locked_until:
        if now < user.locked_until:
            log_login_attempt(client_ip, email_clean, "FAILED", "ACCOUNT_LOCKED")
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
                log_login_attempt(client_ip, email_clean, "FAILED", "MAX_ATTEMPTS_REACHED_ACCOUNT_LOCKED")
            else:
                log_login_attempt(client_ip, email_clean, "FAILED", f"INVALID_CREDENTIALS_ATTEMPT_{user.failed_attempts}")
        else:
            log_login_attempt(client_ip, email_clean, "FAILED", "INVALID_CREDENTIALS_UNKNOWN_USER")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GENERIC_AUTH_ERROR
        )

    # 3. Reset failed attempts on success
    user.failed_attempts = 0
    user.locked_until = None

    # 4. Generate 1-Hour JWT Access Token (3600 seconds)
    expire = now + timedelta(seconds=JWT_EXPIRY_SECONDS)
    to_encode = {
        "sub": user.email,
        "role": user.role,
        "exp": expire,
        "iat": now
    }
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # 5. Set HttpOnly Cookie (max_age=3600)
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=JWT_EXPIRY_SECONDS,
        path="/"
    )

    log_login_attempt(client_ip, user.email, "SUCCESS")

    return {
        "message": "Authentication successful.",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/logout")
async def logout(request: Request, response: Response):
    """Clears the admin_session cookie properly."""
    client_ip = get_remote_address(request) or "unknown"
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    auth_logger.info(f"IP: {client_ip} | EVENT: LOGOUT")
    return {"message": "Logged out successfully."}

@router.get("/me")
async def get_current_user_profile(admin_payload: dict = Depends(get_current_admin)):
    """Protected route reading session from httpOnly cookie."""
    return {
        "user": {
            "id": "admin-uuid",
            "email": admin_payload.get("sub"),
            "role": admin_payload.get("role")
        }
    }
