# backend/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class BagStatus(str, Enum):
    RECEIVED = "received"
    WASHING = "washing"
    READY = "ready"
    DELIVERED = "delivered"

# --- STUDENT ---
class StudentBase(BaseModel):
    name: str
    card_no: str
    registration_no: str
    room_no: str
    phone_number: Optional[str] = None
    total_credits: int = 50

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    class Config:
        from_attributes = True

# --- TRANSACTION ---
class TransactionBase(BaseModel):
    clothes_count: int = 0 # Default 0

# Entry: Only Card No needed now
class TransactionCreate(BaseModel):
    card_no: str 

# Washing: Now we need Count here
class WashRequest(BaseModel):
    clothes_count: int

class TransactionResponse(TransactionBase):
    id: int
    status: BagStatus
    created_at: datetime
    washing_at: Optional[datetime] = None
    ready_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    student: StudentResponse

    class Config:
        from_attributes = True