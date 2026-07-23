# 🤖 AI Resume Screener & Feedback Tool

An AI-powered resume screening tool that analyzes a candidate's resume against a job description, generates a match score (0–100), identifies missing keywords, and provides improvement suggestions.

## 🚀 Features

### Resume Processing

* Upload resume files (PDF/TXT)
* Extract resume text locally
* Validate uploaded documents

### Job Description Analysis

* Add job descriptions for targeted analysis
* Compare resume skills and experience against requirements

### AI Feedback Generation

* AI-powered resume evaluation
* Match score generation (0–100)
* Missing keyword detection
* Rewrite and improvement suggestions

### Data Validation

* Structured JSON output
* Pydantic validation
* Retry handling for invalid AI responses

### Frontend Dashboard

* Next.js interface
* Resume upload form
* Job description input
* Feedback and score display

---

# 🛠 Tech Stack

## Frontend

* Next.js
* React
* JavaScript
* Tailwind CSS

## Backend

* FastAPI
* Python
* Pydantic
* Uvicorn

## AI Integration

* Gemini API

---

# 📂 Project Structure

```
AI-Resume-Scanner
│
├── backend
│   ├── routes
│   ├── models
│   ├── services
│   └── main.py
│
├── frontend
│   ├── src
│   └── package.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

## Clone Repository

```bash
git clone <repository-url>
cd AI-Resume-Scanner
```

---

# Backend Setup

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
uvicorn backend.main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# 👥 Team Roles

| Member          | Role                                 |
| --------------- | ------------------------------------ |
| Samavia Minahil | Backend Development & AI Integration |
| Team Member 2   | Frontend Development                 |
| Team Member 3   | Testing                              |
| Team Member 4   | Documentation                        |
| Team Member 5   | Project Management                   |

---

# 🔒 Security

* API keys are stored using environment variables
* No sensitive credentials are committed to GitHub
* `.env` files are excluded using `.gitignore`

---

# 🔮 Future Improvements

* User authentication
* Resume history dashboard
* Database integration
* Better AI scoring algorithms
* Cloud deployment

---

# 📌 Project Goal

The goal of this project is to help job seekers understand how well their resume matches a job requirement and provide actionable AI-generated feedback to improve their chances.
