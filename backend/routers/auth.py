from fastapi import APIRouter, Request, Response, HTTPException, status, Depends
from pydantic import BaseModel, EmailStr
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timedelta
import jwt

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Secret keys and configuration
SECRET_KEY = "PROD_PORTFOLIO_JWT_SECRET_KEY_CHANGE_IN_ENV"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15

# Default admin credentials for fallback verification
DEFAULT_ADMIN_EMAIL = "aniketsaini0596@gmail.com"
DEFAULT_ADMIN_PASS = "@Aniket1"

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
    - Guarded by SlowAPI: Rate limited to 5 attempts per minute per IP address.
    - Exceeding 5 attempts returns HTTP 429 Too Many Requests with Retry-After headers.
    """
    client_ip = get_remote_address(request)
    
    # Verify Admin Email and Password
    is_valid_email = payload.email.lower() in [DEFAULT_ADMIN_EMAIL.lower(), "admin@portfolio.dev"]
    is_valid_password = payload.password == DEFAULT_ADMIN_PASS

    if not is_valid_email or not is_valid_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password access link."
        )

    # Generate JWT Access Token
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": payload.email,
        "role": "admin",
        "exp": expire,
        "iat": datetime.utcnow()
    }
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Set HttpOnly, Secure, SameSite=Strict cookie for secure session refresh
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
            "id": "admin-uuid",
            "email": payload.email,
            "role": "admin"
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
                "email": payload.get("sub", DEFAULT_ADMIN_EMAIL),
                "role": payload.get("role", "admin")
            }
        }
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
