import pandas as pd
import requests
import time

# 1. SETUP
API_URL = "http://127.0.0.1:8000/students/"
CSV_FILE = "students_data.csv" # Ye file backend folder mein honi chahiye

def import_data():
    print("🚀 Starting Bulk Import...")
    
    # 2. READ CSV using Pandas
    try:
        df = pd.read_csv(CSV_FILE)
    except FileNotFoundError:
        print(f"❌ Error: {CSV_FILE} nahi mila bhai!")
        return

    # 3. LOOP THROUGH EVERY STUDENT
    success_count = 0
    fail_count = 0

    for index, row in df.iterrows():
        # Data Prepare kar rahe hain (Column names match hone chahiye CSV se)
        student_data = {
            "name": str(row['Name']).strip(),
            "card_no": str(row['CardNo']).strip().upper(), # C101 always upper
            "registration_no": str(row['RegNo']).strip(),
            "room_no": str(row['RoomNo']).strip(),
            "phone_number": str(row['Phone']).strip(),
            "total_credits": 50 # Default credits
        }

        try:
            # API Call (Jaise Frontend karta hai)
            response = requests.post(API_URL, json=student_data)
            
            if response.status_code == 200:
                print(f"✅ Added: {student_data['name']} ({student_data['card_no']})")
                success_count += 1
            elif response.status_code == 400:
                # Agar pehle se exist karta hai (shayad duplicate entry)
                print(f"⚠️ Skipped (Duplicate?): {student_data['card_no']}")
                fail_count += 1
            else:
                print(f"❌ Failed: {student_data['card_no']} - {response.text}")
                fail_count += 1
                
        except Exception as e:
            print(f"❌ Connection Error: {str(e)}")
            break
        
        # Thoda sa delay taaki server hang na ho (Safety ke liye)
        # time.sleep(0.05) 

    print("------------------------------------------------")
    print(f"🎉 IMPORT COMPLETE!")
    print(f"✅ Success: {success_count}")
    print(f"❌ Failed/Skipped: {fail_count}")

if __name__ == "__main__":
    import_data()