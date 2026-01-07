# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud, database
from fastapi.responses import StreamingResponse
import pandas as pd
import io 
from datetime import datetime 

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Hostel Laundry System API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SETUP ---
@app.post("/students/", response_model=schemas.StudentResponse)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db=db, student=student)

# --- REGISTER 1: ENTRY (Scan Only) ---
@app.post("/entry/", response_model=schemas.TransactionResponse)
def add_laundry_entry(entry: schemas.TransactionCreate, db: Session = Depends(get_db)):
    try:
        transaction = crud.create_laundry_entry(db, entry)
        if not transaction:
            raise HTTPException(status_code=404, detail="Student Card not found")
        return transaction
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# backend/main.py (Update these 3 functions)

# --- REGISTER 2: WASHING ---
@app.put("/process/wash/{card_no}")
def send_to_wash(card_no: str, req: schemas.WashRequest, db: Session = Depends(get_db)):
    try:
        transaction = crud.update_bag_status(
            db, card_no, models.BagStatus.WASHING, clothes_count=req.clothes_count
        )
        return {"message": f"Bag {card_no} washing with {req.clothes_count} clothes", "status": "washing"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) # Show the specific error (e.g., "Invalid Step")

# --- REGISTER 3: READY ---
@app.put("/process/ready/{card_no}")
def mark_ready(card_no: str, db: Session = Depends(get_db)):
    try:
        transaction = crud.update_bag_status(db, card_no, models.BagStatus.READY)
        return {"message": f"Bag {card_no} is READY", "status": "ready"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- REGISTER 4: PICKUP ---
@app.post("/checkout/{card_no}")
def checkout_bag(card_no: str, db: Session = Depends(get_db)):
    try:
        transaction = crud.update_bag_status(db, card_no, models.BagStatus.DELIVERED)
        return {"message": f"Bag {card_no} DELIVERED", "status": "delivered"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# --- SEARCH ---
@app.get("/status/{card_no}")
def check_status(card_no: str, db: Session = Depends(get_db)):
    data = crud.get_student_stats(db, card_no)
    if not data:
        raise HTTPException(status_code=404, detail="Student not found")
    return data


# --- REPORT EXPORT ---
@app.get("/export/daily")
def export_daily_report(db: Session = Depends(get_db)):
    # 1. Get Data
    data = crud.get_daily_report_data(db)
    
    # 2. Create Excel in Memory (No saving to disk)
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Sheet 1: Entry
        df_entry = pd.DataFrame(data["Entry"])
        if not df_entry.empty:
            df_entry.to_excel(writer, sheet_name="Entry Register", index=False)
        else:
            pd.DataFrame(["No Entries Today"]).to_excel(writer, sheet_name="Entry Register", header=False, index=False)

        # Sheet 2: Washing
        df_wash = pd.DataFrame(data["Washing"])
        if not df_wash.empty:
            df_wash.to_excel(writer, sheet_name="Washing Register", index=False)
        else:
             pd.DataFrame(["No Washing Today"]).to_excel(writer, sheet_name="Washing Register", header=False, index=False)

        # Sheet 3: Ready
        df_ready = pd.DataFrame(data["Ready"])
        if not df_ready.empty:
            df_ready.to_excel(writer, sheet_name="Ready Register", index=False)
        else:
             pd.DataFrame(["No Ready Today"]).to_excel(writer, sheet_name="Ready Register", header=False, index=False)

        # Sheet 4: Delivery
        df_del = pd.DataFrame(data["Delivery"])
        if not df_del.empty:
            df_del.to_excel(writer, sheet_name="Delivery Register", index=False)
        else:
             pd.DataFrame(["No Deliveries Today"]).to_excel(writer, sheet_name="Delivery Register", header=False, index=False)

    output.seek(0)
    
    # 3. Generate Filename with Date
    today_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"Laundry_Report_{today_str}.xlsx"
    
    headers = {
        'Content-Disposition': f'attachment; filename="{filename}"'
    }
    
    return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')