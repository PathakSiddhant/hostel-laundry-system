# backend/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class BagStatus(str, enum.Enum):
    RECEIVED = "received"
    WASHING = "washing"
    READY = "ready"
    DELIVERED = "delivered"

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    # This CARD NO is the BAG NO (e.g., "B-101")
    card_no = Column(String, unique=True, index=True, nullable=False) 
    registration_no = Column(String, nullable=False) # New Field
    room_no = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    
    total_credits = Column(Integer, default=50)
    
    transactions = relationship("LaundryTransaction", back_populates="student")

class LaundryTransaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    
    # We link to student via ID. 
    # Since Student Card = Bag No, we don't need a separate bag_no column here.
    student_id = Column(Integer, ForeignKey("students.id"))
    
    clothes_count = Column(Integer, default=0)
    status = Column(Enum(BagStatus), default=BagStatus.RECEIVED)
    
    # Timestamps for Registers
    created_at = Column(DateTime, default=datetime.now)
    washing_at = Column(DateTime, nullable=True)
    ready_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    
    student = relationship("Student", back_populates="transactions")