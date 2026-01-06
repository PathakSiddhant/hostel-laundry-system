# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Define the database file path (Local SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./laundry.db"

# 2. Create the Engine
# check_same_thread=False is needed ONLY for SQLite to allow multiple requests
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create a Session Local class
# Each request will create a new session instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base class for our models
Base = declarative_base()

# 5. Dependency Injection (Used in API endpoints later)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()