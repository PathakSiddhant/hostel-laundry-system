# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <--- 1. YE ADD KIYA
from sqlalchemy.orm import Session
import models, schemas, crud, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Hostel Laundry System API")

# --- 2. YE BLOCK ADD KIYA (CORS FIX) ---
origins = [
    "http://localhost:3000",      # Tera Frontend URL
    "http://127.0.0.1:3000",      # Alternate Localhost URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Sirf humara frontend allowed hai
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT sab allowed
    allow_headers=["*"],
)
# ---------------------------------------

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SETUP: CREATE STUDENT ---
@app.post("/students/", response_model=schemas.StudentResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db=db, student=student)

# --- REGISTER 1: ENTRY ---
@app.post("/entry/", response_model=schemas.TransactionResponse)
def add_laundry_entry(entry: schemas.TransactionCreate, db: Session = Depends(get_db)):
    try:
        transaction = crud.create_laundry_entry(db, entry)
        if not transaction:
            raise HTTPException(status_code=404, detail="Student Card/Bag not found")
        return transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- REGISTER 2: SEND TO WASH ---
@app.put("/process/wash/{card_no}")
def send_to_wash(card_no: str, db: Session = Depends(get_db)):
    transaction = crud.update_bag_status(db, card_no, models.BagStatus.WASHING)
    if not transaction:
        raise HTTPException(status_code=404, detail="Active Bag not found for this Card")
    return {"message": f"Bag {card_no} moved to WASHING", "status": "washing"}

# --- REGISTER 3: MARK READY ---
@app.put("/process/ready/{card_no}")
def mark_ready(card_no: str, db: Session = Depends(get_db)):
    transaction = crud.update_bag_status(db, card_no, models.BagStatus.READY)
    if not transaction:
        raise HTTPException(status_code=404, detail="Active Bag not found for this Card")
    return {"message": f"Bag {card_no} is READY", "status": "ready"}

# --- REGISTER 4: PICKUP ---
@app.post("/checkout/{card_no}")
def checkout_bag(card_no: str, db: Session = Depends(get_db)):
    transaction = crud.update_bag_status(db, card_no, models.BagStatus.DELIVERED)
    if not transaction:
        raise HTTPException(status_code=404, detail="No ready bag found for this Card")
    return {"message": f"Bag {card_no} DELIVERED", "status": "delivered"}

# --- SEARCH ---
@app.get("/status/{card_no}")
def check_status(card_no: str, db: Session = Depends(get_db)):
    data = crud.get_student_stats(db, card_no)
    if not data:
        raise HTTPException(status_code=404, detail="Student not found")
    return data