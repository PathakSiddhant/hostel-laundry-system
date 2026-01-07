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
        card_no=student.card_no,
        registration_no=student.registration_no,
        room_no=student.room_no,
        phone_number=student.phone_number,
        total_credits=student.total_credits
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# backend/crud.py (Only replace the create_laundry_entry function)

# --- REGISTER 1: ENTRY (No Count) ---
def create_laundry_entry(db: Session, entry: schemas.TransactionCreate):
    # 1. Student Find karo
    student = get_student_by_card(db, entry.card_no)
    if not student:
        raise ValueError("Student/Card not found") # Error message refined
    
    # 2. CHECK: Kya bag pehle se andar hai? (The Fix)
    active_transaction = db.query(models.LaundryTransaction).filter(
        models.LaundryTransaction.student_id == student.id,
        models.LaundryTransaction.status != models.BagStatus.DELIVERED
    ).first()

    if active_transaction:
        # Agar bag delivered nahi hai, matlab wo laundry mein hi hai. Block entry.
        raise ValueError(f"Bag is already in Process (Status: {active_transaction.status.value}). Complete that first!")

    # 3. Check Credits
    if student.total_credits <= 0:
        raise ValueError("Insufficient Credits. Please Recharge.")
    
    # 4. Deduct Credit
    student.total_credits -= 1
    
    # 5. Create New Entry
    db_transaction = models.LaundryTransaction(
        student_id=student.id,
        clothes_count=0, 
        status=models.BagStatus.RECEIVED,
        created_at=datetime.now()
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

# backend/crud.py (Only replace the update_bag_status function)

# --- REGISTER 2, 3, 4: STATUS UPDATES (With Strict Checks) ---
def update_bag_status(db: Session, card_no: str, new_status: models.BagStatus, clothes_count: int = None):
    # 1. Find Student
    student = get_student_by_card(db, card_no)
    if not student:
        raise ValueError("Student Card not found") # Error message refined

    # 2. Find Active Transaction
    transaction = db.query(models.LaundryTransaction).filter(
        models.LaundryTransaction.student_id == student.id,
        models.LaundryTransaction.status != models.BagStatus.DELIVERED
    ).first()
    
    if not transaction:
        raise ValueError("No active bag found. Please create Entry first.")
    
    # 3. STRICT TRAFFIC RULES (The Fix)
    current_status = transaction.status

    # Rule A: Moving to WASHING
    if new_status == models.BagStatus.WASHING:
        if current_status != models.BagStatus.RECEIVED:
            raise ValueError(f"❌ Invalid Step! Bag is already '{current_status.value}'. Cannot send to Wash again.")

    # Rule B: Moving to READY
    if new_status == models.BagStatus.READY:
        if current_status != models.BagStatus.WASHING:
            raise ValueError(f"❌ Invalid Step! Bag is '{current_status.value}'. Must be in WASHING state first.")

    # Rule C: Moving to DELIVERY
    if new_status == models.BagStatus.DELIVERED:
        if current_status != models.BagStatus.READY:
            raise ValueError(f"❌ Invalid Step! Bag is '{current_status.value}'. Must be READY before delivery.")

    # 4. Update Status (Agar upar sab pass ho gaya)
    transaction.status = new_status
    
    if new_status == models.BagStatus.WASHING:
        transaction.washing_at = datetime.now()
        if clothes_count is not None:
            transaction.clothes_count = clothes_count

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