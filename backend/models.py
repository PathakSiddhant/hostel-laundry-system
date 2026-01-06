# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

# Define Status Options (Strict choices only)
class BagStatus(str, enum.Enum):
    RECEIVED = "received"       # Stage 1: Entry
    WASHING = "washing"         # Stage 2: Processing
    READY = "ready"             # Stage 3: Shelving
    DELIVERED = "delivered"     # Stage 4: Exit

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    card_no = Column(String, unique=True, index=True, nullable=False) # Scanned via RFID/Barcode
    room_no = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    
    # Wallet Logic
    total_credits = Column(Integer, default=50) # The "Holes" logic
    
    # Relationship: One Student -> Many Transactions
    transactions = relationship("LaundryTransaction", back_populates="student")

class LaundryTransaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    
    # Linking to Student
    student_id = Column(Integer, ForeignKey("students.id"))
    
    # Bag Details
    bag_number = Column(String, index=True) # The physical bag ID
    clothes_count = Column(Integer, default=0) # Count at Entry
    
    # The "Pool System" Logic (Timestamps for Reports)
    status = Column(Enum(BagStatus), default=BagStatus.RECEIVED)
    
    created_at = Column(DateTime, default=datetime.now) # Register 1 Date
    washing_at = Column(DateTime, nullable=True)        # Register 2 Date
    ready_at = Column(DateTime, nullable=True)          # Register 3 Date
    delivered_at = Column(DateTime, nullable=True)      # Register 4 Date
    
    # Relationship
    student = relationship("Student", back_populates="transactions")