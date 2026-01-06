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
    card_no: str # This is the Bag Number
    registration_no: str # New Field
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
    clothes_count: int

# When Entry happens, we only need Card No (Bag No) and Clothes Count
class TransactionCreate(TransactionBase):
    card_no: str 

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