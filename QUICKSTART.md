# Quick Start Guide

Get the Student Management System running in 5 minutes.

## Prerequisites

- Node.js 14+ installed
- PostgreSQL 12+ installed and running
- npm installed

## One-Command Setup (Assuming PostgreSQL is running)

### Step 1: Database Setup
```bash
psql -U postgres -c "CREATE DATABASE student_management;"
```

### Step 2: Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
```

### Step 3: Frontend Setup (NEW TERMINAL)
```bash
cd frontend
npm install
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view student-management-frontend in the browser.

  Local: http://localhost:3000
```

## ✅ Verify It's Working

1. Open `http://localhost:3000` in your browser
2. You should see the Student Management System
3. Student list should show 10 sample students
4. Try clicking "View", "Edit", or "Delete" buttons
5. Try creating a new student
6. Test pagination by going to page 2

## 🧪 Test the API

**Using curl:**
```bash
# Check API is running
curl http://localhost:5000/api/health

# Get all students
curl "http://localhost:5000/api/students?page=1&limit=10"

# Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "phone": "9876543210"
  }'
```

**Using Postman:**
1. Import `Postman_Collection.json`
2. Test any endpoint

## 🐛 Troubleshooting

### PostgreSQL Not Running?
```bash
# Mac/Linux
brew services start postgresql
sudo service postgresql start

# Windows
# Open Services and find PostgreSQL, set to Running
```

### Port 5000 Already in Use?
```bash
# Change PORT in backend/.env
PORT=5001
npm run dev
```

### Port 3000 Already in Use?
```bash
# Kill existing process or let React use 3001
PORT=3001 npm start
```

### Database Connection Error?
```bash
# Verify database exists
psql -U postgres -l | grep student_management

# Create if missing
psql -U postgres -c "CREATE DATABASE student_management;"
```

## 📚 Documentation

After setup, read these in order:

1. **README.md** - Project overview
2. **API_DOCUMENTATION.md** - API endpoints
3. **SETUP_INSTRUCTIONS.md** - Full setup details
4. **ARCHITECTURE.md** - How it all works

## 🎯 What to Try

### Create a Student
1. Click "Add New Student"
2. Fill in: Name, Email, Phone
3. Click "Add Student"

### View Details
1. Click "View" on any student
2. See student info and their marks
3. View average score (automatically calculated)

### Edit Student
1. Click "Edit" on a student
2. Change information
3. Click "Update Student"

### Delete Student
1. Click "Delete" on a student
2. Confirm deletion
3. Student and marks removed

### Pagination
1. Scroll down the student list
2. Click different page numbers
3. Each page shows up to 10 students

## ⚡ Performance Tips

- Backend server runs on port 5000
- Frontend runs on port 3000
- Both run simultaneously in separate terminals
- Keep both terminals open

## 🚀 Next Steps

1. Explore the codebase
2. Read the architecture documentation
3. Try adding more features
4. Understand the design patterns used

## 📞 Need Help?

- Check **SETUP_INSTRUCTIONS.md** for troubleshooting
- Review **API_DOCUMENTATION.md** for API details
- See **ARCHITECTURE.md** for how things work together

---

**Your app is running! 🎉**

Backend: `http://localhost:5000`
Frontend: `http://localhost:3000`
