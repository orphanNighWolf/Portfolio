from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
import math

# Initialize SlowAPI Limiter based on Client Remote IP
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(
    title="Portfolio Admin API",
    version="1.0.0",
    description="Production-hardened FastAPI backend with rate limiting and secure JWT auth."
)

app.state.limiter = limiter

# Custom Rate Limit Exceeded Handler (HTTP 429 with Retry-After header)
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    # Extract retry-after window or fallback to 60s
    retry_after_seconds = getattr(exc, "retry_after", 60)
    retry_after_minutes = math.ceil(retry_after_seconds / 60)

    headers = {
        "Retry-After": str(retry_after_seconds),
        "X-RateLimit-Reset": str(retry_after_seconds),
    }

    return JSONResponse(
        status_code=429,
        headers=headers,
        content={
            "status": 429,
            "error": "Too Many Requests",
            "message": f"Rate limit exceeded: 5 login attempts per minute per IP address. Please try again in {retry_after_seconds} second(s).",
            "retryAfterSeconds": retry_after_seconds,
            "retryAfterMinutes": retry_after_minutes,
            "limit": "5/minute"
        }
    )

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and register auth router
from routers.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"status": "online", "system": "Portfolio FastAPI Admin Gateway", "rateLimiting": "active"}
