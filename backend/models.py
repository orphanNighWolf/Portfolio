from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AdminUser(BaseModel):
    id: str
    email: EmailStr
    password_hash: str
    role: str = "admin"
    failed_attempts: int = 0
    locked_until: Optional[datetime] = None

class AdminUserDB:
    """
    In-memory / ORM Database Representation for Admin Users
    Contains fields:
    - failed_attempts (int): Tracks consecutive auth failures
    - locked_until (datetime | None): Timestamp until which account is locked
    """
    def __init__(self, id: str, email: str, password_hash: str):
        self.id = id
        self.email = email.lower()
        self.password_hash = password_hash
        self.role = "admin"
        self.failed_attempts: int = 0
        self.locked_until: Optional[datetime] = None

# Mock database store simulating SQL/ORM User Table
user_db: dict[str, AdminUserDB] = {
    "aniketsaini0596@gmail.com": AdminUserDB(
        id="admin-uuid-1",
        email="aniketsaini0596@gmail.com",
        password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO5E/1Zg4hXJ2wV1H3u7h6XjF.0.1.2.3" # bcrypt hash
    ),
    "admin@portfolio.dev": AdminUserDB(
        id="admin-uuid-2",
        email="admin@portfolio.dev",
        password_hash="$2b$12$eImiTXuWVxfM37uY4JANjO5E/1Zg4hXJ2wV1H3u7h6XjF.0.1.2.3"
    )
}

def get_user_by_email(email: str) -> Optional[AdminUserDB]:
    return user_db.get(email.lower())
