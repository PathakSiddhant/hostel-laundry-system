# backend/seed.py
import requests
import random

API_URL = "http://127.0.0.1:8000"

# Fake Names for realism
first_names = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Neha", "Pooja", "Riya"]
last_names = ["Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Das", "Chopra", "Mehta"]

def generate_students(count=50):
    print(f"🌱 Seeding {count} students...")
    
    for i in range(1, count + 1):
        # Generate random student data
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        name = f"{fname} {lname}"
        
        # Logic: Card No = C + Number (e.g., C101)
        card_no = f"C{100 + i}" 
        
        data = {
            "name": name,
            "card_no": card_no,
            "registration_no": f"REG2026{i:03d}",
            "room_no": f"{random.randint(1, 4)}{random.randint(0, 9)}{random.randint(1, 9)}", # e.g. 101, 305
            "phone_number": f"98765{random.randint(10000, 99999)}",
            "total_credits": 50
        }

        try:
            response = requests.post(f"{API_URL}/students/", json=data)
            if response.status_code == 200:
                print(f"✅ Created: {name} ({card_no})")
            else:
                print(f"⚠️ Failed {card_no}: {response.text}")
        except Exception as e:
            print(f"❌ Error connecting to API: {str(e)}")

if __name__ == "__main__":
    generate_students()
    print("\n🎉 Seeding Complete! You can now test the Admin Panel.")