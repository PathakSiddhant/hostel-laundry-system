# backend/schemas.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Mirror the Enum from models to share logic
class BagStatus(str, Enum):
    RECEIVED = "received"
    WASHING = "washing"
    READY = "ready"
    DELIVERED = "delivered"

# --- STUDENT SCHEMAS ---
class StudentBase(BaseModel):
    name: str
    card_no: str
    room_no: str
    phone_number: Optional[str] = None
    total_credits: int = 50

class StudentCreate(StudentBase):
    pass # Used when creating a new student

class StudentResponse(StudentBase):
    id: int
    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models

# --- TRANSACTION SCHEMAS ---
class TransactionBase(BaseModel):
    bag_number: str
    clothes_count: int

class TransactionCreate(TransactionBase):
    card_no: str # We need Card No to link the bag to a student

class TransactionResponse(TransactionBase):
    id: int
    status: BagStatus
    created_at: datetime
    washing_at: Optional[datetime] = None
    ready_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    student: StudentResponse # Nested student data

    class Config:
        from_attributes = True