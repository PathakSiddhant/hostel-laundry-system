# backend/crud.py
from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas

# --- STUDENT LOGIC ---
def get_student_by_card(db: Session, card_no: str):
    return db.query(models.Student).filter(models.Student.card_no == card_no).first()

def create_student(db: Session, student: schemas.StudentCreate):
    existing = get_student_by_card(db, student.card_no)
    if existing:
        return existing
    
    db_student = models.Student(
        name=student.name,
        card_no=student.card_no, # Bag No
        registration_no=student.registration_no,
        room_no=student.room_no,
        phone_number=student.phone_number,
        total_credits=student.total_credits
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# --- REGISTER 1: ENTRY ---
def create_laundry_entry(db: Session, entry: schemas.TransactionCreate):
    # 1. Find Student by Card No (which is Bag No)
    student = get_student_by_card(db, entry.card_no)
    if not student:
        return None 
    
    # 2. Check Credits
    if student.total_credits <= 0:
        raise ValueError("Insufficient Credits")
    
    # 3. Deduct Credit
    student.total_credits -= 1
    
    # 4. Create Transaction
    db_transaction = models.LaundryTransaction(
        student_id=student.id,
        clothes_count=entry.clothes_count,
        status=models.BagStatus.RECEIVED,
        created_at=datetime.now()
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# --- REGISTER 2, 3, 4: STATUS UPDATES ---
def update_bag_status(db: Session, card_no: str, new_status: models.BagStatus):
    # Find Student first
    student = get_student_by_card(db, card_no)
    if not student:
        return None

    # Find their ACTIVE transaction (Not delivered yet)
    transaction = db.query(models.LaundryTransaction).filter(
        models.LaundryTransaction.student_id == student.id,
        models.LaundryTransaction.status != models.BagStatus.DELIVERED
    ).first()
    
    if not transaction:
        return None
    
    # Update Status
    transaction.status = new_status
    
    if new_status == models.BagStatus.WASHING:
        transaction.washing_at = datetime.now()
    elif new_status == models.BagStatus.READY:
        transaction.ready_at = datetime.now()
    elif new_status == models.BagStatus.DELIVERED:
        transaction.delivered_at = datetime.now()
        
    db.commit()
    db.refresh(transaction)
    return transaction

# --- STUDENT STATS ---
def get_student_stats(db: Session, card_no: str):
    student = get_student_by_card(db, card_no)
    if not student:
        return None
    
    active_bags = db.query(models.LaundryTransaction).filter(
        models.LaundryTransaction.student_id == student.id,
        models.LaundryTransaction.status != models.BagStatus.DELIVERED
    ).all()
    
    return {"student": student, "active_bags": active_bags}