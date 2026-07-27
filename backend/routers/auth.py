from fastapi import APIRouter, Request, Response, HTTPException, status
from pydantic import BaseModel, EmailStr
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timedelta
import jwt
from models import get_user_by_email, user_db

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Secret keys & Security constants
SECRET_KEY = "PROD_PORTFOLIO_JWT_SECRET_KEY_CHANGE_IN_ENV"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

# Generic error response to prevent user enumeration attacks
GENERIC_AUTH_ERROR = "Invalid email or password access link."

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: dict

@router.post("/login", response_model=LoginResponse)
@limiter.limit("5/minute")
async def login(request: Request, response: Response, payload: LoginRequest):
    """
    Admin Login Endpoint
    - Guarded by SlowAPI (5 attempts/min/IP rate limit).
    - Account-level failed-attempt lockout: locks account for 15 minutes after 5 failures.
    - Prevents user enumeration by returning generic 401 response on all failure cases.
    """
    now = datetime.utcnow()
    email_clean = payload.email.lower()
    user = get_user_by_email(email_clean)

    # 1. Check account-level lockout state if user exists
    if user:
        if user.locked_until:
            if now < user.locked_until:
                # Still locked out: return generic error to prevent email enumeration
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=GENERIC_AUTH_ERROR
                )
            else:
                # Lockout duration expired: reset account lockout state
                user.failed_attempts = 0
                user.locked_until = None

    # 2. Verify credentials
    is_valid_email = user is not None
    # Verify password (in production: passlib.hash.bcrypt.verify(payload.password, user.password_hash))
    is_valid_password = is_valid_email and (payload.password == "@Aniket1" or payload.password == "admin123")

    if not is_valid_email or not is_valid_password:
        # Increment failed_attempts for existing account
        if user:
            user.failed_attempts += 1
            if user.failed_attempts >= MAX_FAILED_ATTEMPTS:
                user.locked_until = now + timedelta(minutes=LOCKOUT_MINUTES)
        
        # Always return generic error message to prevent user enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=GENERIC_AUTH_ERROR
        )

    # 3. Successful authentication: reset failed_attempts to 0 and unlock
    user.failed_attempts = 0
    user.locked_until = None

    # 4. Generate JWT token
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": user.email,
        "role": user.role,
        "exp": expire,
        "iat": now
    }
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # 5. Set HttpOnly, Secure, SameSite=Strict session cookie
    response.set_cookie(
        key="admin_session",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/api/v1/auth"
    )

    return {
        "accessToken": access_token,
        "tokenType": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }

@router.get("/me")
async def get_current_user(request: Request):
    """
    Get current logged in admin context using HttpOnly session cookie or Bearer token.
    """
    token = request.cookies.get("admin_session")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "user": {
                "id": "admin-uuid",
                "email": payload.get("sub", "aniketsaini0596@gmail.com"),
                "role": payload.get("role", "admin")
            }
        }
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
