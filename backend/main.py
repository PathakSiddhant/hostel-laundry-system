# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models # Import models so SQLAlchemy knows what to create

# 1. Create Tables automatically on startup
# This checks if 'laundry.db' exists, if not, it creates it with all columns
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hostel Laundry System - Production")

# 2. CORS (Allow Frontend to talk to Backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "active", "db_connected": True}