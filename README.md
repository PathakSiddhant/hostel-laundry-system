# 🧺 Poornima University Hostel Laundry System

> **A Full-Stack Digital Solution to Streamline Hostel Laundry Management**
> *Designed & Developed for Poornima University Hostels*

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & File Structure](#-project-architecture--file-structure)
- [Installation & Setup](#-installation--setup)
- [API Documentation](#-api-documentation)
- [Developers](#-developers)

---

## 🧐 About the Project
The **Hostel Laundry System** is a purpose-built web application designed to digitize the manual laundry process at Poornima University. It serves two main user groups:
1.  **Students:** To track real-time status of their clothes.
2.  **Laundry Staff:** To manage the lifecycle of laundry bags efficiently without paperwork.

---

## ⚠️ The Problem
Before this system, the laundry process was manual and inefficient:
* **Manual Registers:** Staff had to maintain multiple physical registers for Entry, Wash, and Delivery.
* **Lack of Transparency:** Students had no way to know if their clothes were ready without physically visiting the laundry.
* **Human Error:** Issues like duplicate entries, lost bags, or incorrect student details were common.
* **No Data Analysis:** No easy way to generate daily reports or track laundry volume.

## 💡 The Solution
We developed a **Centralized Web Portal** that connects students and staff via a shared database:
* **For Staff:** An Admin Dashboard with a 4-Stage Workflow (Received -> Washing -> Ready -> Delivered).
* **For Students:** A simple Search Portal to check live status using their Card Number.
* **Automation:** Daily Excel Reports are auto-generated, eliminating manual counting.

---

## 🚀 Key Features

### 👨‍🎓 Student Portal
* **Live Tracking:** Check status (Received, Washing, Ready, Delivered) instantly.
* **Mobile First Design:** Optimized for smartphones.
* **No Login Required:** Simple access via Bag/Card Number.

### 👮‍♂️ Admin/Staff Portal
* **Secure Access:** Protected by a Staff Passcode.
* **4-Step Pipeline:** 1.  **Entry:** Scan bag to accept (Checks for duplicate/active bags).
    2.  **Washing:** Log clothes count and move to machine.
    3.  **Ready:** Mark bags as ironed/shelved.
    4.  **Delivery:** Final checkout to student.
* **Manage Tab:** Edit student details or fix wrong entries instantly.
* **Live Workbook:** View real-time register data without downloading.
* **Daily Reports:** One-click download of daily logs in Excel format.
* **Bulk Import:** Ability to onboard 1200+ students via Excel/CSV instantly.

---

## 🛠 Tech Stack

| Component | Technology | Reason |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14 (React) | Fast, SEO friendly, and modern UI. |
| **Styling** | Tailwind CSS v4 | Clean, responsive, and University-themed UI. |
| **UI Library** | Shadcn UI | For professional components (Dialogs, Tabs, Toasts). |
| **Backend** | FastAPI (Python) | High performance, auto-validation, and easy Swagger docs. |
| **Database** | SQLite (SQLAlchemy) | Lightweight, serverless, and easy to backup/deploy. |
| **Data Processing** | Pandas & OpenPyxl | For generating Excel reports and handling bulk imports. |

---

## 📂 Project Architecture & File Structure

Here is a breakdown of the codebase for developers and maintainers:

```bash
hostel-laundry-system/
├── backend/                  # The Brain (API & Database)
│   ├── database.py           # DB Connection setup
│   ├── models.py             # SQL Database Tables (Schema for Student & Transaction)
│   ├── schemas.py            # Pydantic Models (Data Validation rules)
│   ├── crud.py               # Logic Layer (Create, Read, Update, Delete functions)
│   ├── main.py               # API Endpoints (The routes accessible by Frontend)
│   ├── import_students.py    # Automation Script for Bulk Student Import via CSV
│   └── laundry.db            # The actual database file (Auto-created)
│
├── frontend/                 # The Face (User Interface)
│   ├── src/app/
│   │   ├── page.tsx          # Student Portal (Search Page)
│   │   ├── admin/page.tsx    # Admin Dashboard (Protected, Tabs, Logic)
│   │   └── globals.css       # Global Styles & Theme Variables
│   ├── public/               # Static Assets (Logo, Icons)
│   └── components/           # Reusable UI Blocks (Cards, Buttons, Inputs)
│
└── README.md                 # Project Documentation


```

## Key Logic Files:
* ```backend/crud.py```: This contains the core business logic. If you need to change how "Credits" are deducted or how "Status" changes, look here.

* ```frontend/src/app/admin/page.tsx```: The main Admin Interface. Contains all the logic for Tabs, Popups, and API calls.



## ⚙️ Installation & Setup
- Prerequisites 
  - Node.js & npm
  - Python 3.10+

### 1. Backend Setup
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
* Server will start at: ```http://localhost:8000```


### 2. Backend Setup

```
cd frontend
npm install
npm run dev
```
* App will start at: ```http://localhost:3000```




<br/>
<div align="center">
  <h2>👨‍💻 Developed By</h2>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=60&section=footer" width="100%"/>
</div>

<br/>

<div align="center">
  <table style="border-spacing: 15px; border-collapse: separate; width: auto;">
    <tr>
      <td align="center" width="350px" style="border: 2px solid #30363d; border-radius: 15px; padding: 25px;">
        <h2 style="margin-top: 0;">Siddhant Pathak</h2>
        <p style="font-size: 16px;">🎓 <b>B.Tech CSE (AI & DS)</b></p>
        <p>🗓️ Batch: <code>2023-27</code></p>
        <br/>
        <a href="https://www.linkedin.com/in/siddhant-pathak-380a5b31a/" target="_blank">
          <img src="https://img.shields.io/badge/Connect_on_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Connect with Siddhant"/>
        </a>
      </td>
      <td width="20px" style="border: none;"></td>
      <td align="center" width="350px" style="border: 2px solid #30363d; border-radius: 15px; padding: 25px;">
        <h2 style="margin-top: 0;">Rohit Murmu</h2>
        <p style="font-size: 16px;">🎓 <b>B.Tech CSE (AI & DS)</b></p>
        <p>🗓️ Batch: <code>2023-27</code></p>
        <br/>
        <a href="https://www.linkedin.com/in/rohit-murmu-b17916290/" target="_blank">
          <img src="https://img.shields.io/badge/Connect_on_LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Connect with Rohit"/>
        </a>
      </td>
    </tr>
  </table>
</div>
<br/>
<div align="center">
  <sub><i>Crafted with Code & Collaboration.</i></sub>
</div>
<br/>