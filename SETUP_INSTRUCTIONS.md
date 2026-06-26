# Setup Instructions - Student Management System

Complete step-by-step guide to set up and run the Student Management System locally.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js**: v14.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: For version control ([Download](https://git-scm.com/))

### Verification
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
psql --version    # Should be v12+
```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

Open PostgreSQL shell or use pgAdmin:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE student_management;

# Create user (optional, if using a dedicated user)
CREATE USER student_app WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE student_management TO student_app;

# Exit
\q
```

### 2. Verify Database Connection

```bash
# Connect to the new database
psql -U postgres -d student_management

# List tables (should be empty initially)
\dt

# Exit
\q
```

## 🔧 Backend Setup

### Step 1: Clone Repository (if using git)

```bash
git clone <repository-url>
cd student-management-system/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- express
- cors
- dotenv
- pg
- knex
- nodemon (dev)

### Step 3: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
# On Windows: notepad .env
# On Mac/Linux: nano .env
```

**Example .env configuration:**

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=postgres
```

### Step 4: Run Database Migrations

Migrations create the database tables:

```bash
npm run migrate
```

You should see output:
```
Batch 1 run: 2 migrations
Batch 1 migrations completed
```

### Step 5: Seed Sample Data (Optional)

Populate database with sample students and marks:

```bash
npm run seed
```

This creates 10 sample students with their marks.

### Step 6: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
Server running on http://localhost:5000
API Documentation available at http://localhost:5000/api/health
```

### Step 7: Test Backend

Check if API is running:

```bash
# Using curl
curl http://localhost:5000/api/health

# Expected response
{"status":"ok","timestamp":"2024-06-20T10:30:00.000Z"}
```

## 💻 Frontend Setup

### Step 1: Open New Terminal

Keep the backend running in the first terminal.

```bash
cd student-management-system/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react
- react-dom
- axios
- tailwindcss
- react-scripts

### Step 3: Configure API URL (Optional)

By default, frontend connects to `http://localhost:5000/api`

If running on different host/port:

Create `.env` file in frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view student-management-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
```

The app should automatically open in your browser at `http://localhost:3000`

## ✅ Verification Checklist

### Backend Verification

- [ ] Backend server running on http://localhost:5000
- [ ] Health check endpoint responds: `curl http://localhost:5000/api/health`
- [ ] Database tables created: `psql -U postgres -d student_management -c "\dt"`
- [ ] Sample data loaded: `curl http://localhost:5000/api/students`

### Frontend Verification

- [ ] Frontend loaded at http://localhost:3000
- [ ] Student list displayed with sample data
- [ ] Can add a new student
- [ ] Can view student details
- [ ] Can edit student information
- [ ] Can delete a student
- [ ] Pagination works correctly

## 🧪 Testing the Application

### 1. Test Student CRUD Operations

**Create a Student:**
1. Click "Add New Student"
2. Fill in the form:
   - Name: Jane Smith
   - Email: jane.smith@example.com
   - Phone: 9876543220
3. Click "Add Student"
4. Should see success notification

**View Student Details:**
1. Click "View" button on any student
2. Should see detailed view with marks
3. View average score calculation

**Edit a Student:**
1. Click "Edit" on a student row
2. Modify details
3. Click "Update Student"
4. Changes should be reflected in the list

**Delete a Student:**
1. Click "Delete" on a student row
2. Confirm deletion in dialog
3. Student should be removed from list

### 2. Test Pagination

1. On student list page
2. Click on different page numbers
3. Each page should show up to 10 students
4. Total pages indicator should update

### 3. Test Error Handling

**Invalid Email:**
1. Try creating student with invalid email
2. Should show validation error

**Duplicate Email:**
1. Try creating student with existing email
2. Should show conflict error

**Invalid Phone:**
1. Try creating student with 9-digit phone
2. Should show validation error

### 4. Test with Postman

1. Import `Postman_Collection.json`
2. Test each endpoint:
   - GET /students (check pagination)
   - POST /students (create new)
   - GET /students/:id (view details)
   - PUT /students/:id (update)
   - DELETE /students/:id (delete)

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Change port in .env
PORT=5001

# Or kill existing process
# Linux/Mac:
lsof -i :5000
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Database connection error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432

# Solution:
# 1. Ensure PostgreSQL is running
# 2. Check .env credentials
# 3. Verify database exists
createdb student_management
```

**Migration errors:**
```bash
# Roll back migrations
npm run migrate:rollback

# Re-run migrations
npm run migrate
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Either:
# 1. Kill existing process on port 3000
# 2. React will ask to use port 3001

# Or specify port:
PORT=3001 npm start
```

**API not connecting:**
1. Check backend is running on port 5000
2. Check browser console for CORS errors
3. Verify .env API_URL is correct
4. Check firewall settings

**Blank page or compilation errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Database Issues

**Can't connect to PostgreSQL:**
```bash
# Check if PostgreSQL service is running
# Windows: Services > PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Verify connection
psql -U postgres
```

**Tables don't exist:**
```bash
# Run migrations again
cd backend
npm run migrate
```

## 📂 Important Files to Check

After setup, verify these files exist and are configured:

### Backend
- ✅ `backend/.env` - Database credentials
- ✅ `backend/src/index.js` - Server entry point
- ✅ `backend/src/db.js` - Database connection
- ✅ `backend/src/migrations/` - Migration files
- ✅ `backend/src/routes/` - API routes

### Frontend
- ✅ `frontend/.env` - API configuration (optional)
- ✅ `frontend/src/App.js` - Main component
- ✅ `frontend/src/api/client.js` - Axios configuration
- ✅ `frontend/public/index.html` - HTML template

## 🔄 Restart the Application

If you need to restart:

### Backend Restart
```bash
# Press Ctrl+C to stop current instance
# Start again
npm run dev
```

### Frontend Restart
```bash
# Press Ctrl+C to stop current instance
# Start again
npm start
```

### Full System Restart
```bash
# Terminal 1 (Backend)
cd backend
npm run dev

# Terminal 2 (Frontend) - NEW TERMINAL
cd frontend
npm start
```

## 📊 Data Management

### Add More Sample Data

Edit `backend/src/seeds/001_sample_students.js` and run:

```bash
npm run seed
```

### Reset Database

```bash
# Roll back all migrations
npm run migrate:rollback

# Re-run migrations
npm run migrate

# Re-seed data
npm run seed
```

### View Database Contents

```bash
# Connect to database
psql -U postgres -d student_management

# View students
SELECT * FROM students;

# View marks
SELECT * FROM marks;

# Exit
\q
```

## 🚀 Performance Tips

1. **Backend**: 
   - Use `npm run dev` for development (auto-reload)
   - Check API response times in browser DevTools Network tab

2. **Frontend**:
   - Use browser DevTools to check for slow components
   - Monitor network requests for large payloads

3. **Database**:
   - Check query execution time in PostgreSQL logs
   - Verify indexes are working

## 📱 Mobile Testing

Frontend is responsive. Test on mobile:

1. Keep backend running
2. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Access from mobile: `http://<your-ip>:3000`

## 🔐 Development vs Production

### Development Setup (Current)
- CORS enabled for localhost
- Detailed error messages
- Auto-reload on file changes
- SQLite/PostgreSQL local connection

### Production Setup (Future)
- Restrict CORS to frontend domain
- Minimize error details (security)
- Environment-specific configs
- Connection pooling
- SSL/HTTPS
- Authentication

## 📞 Getting Help

If something isn't working:

1. **Check logs**: Look at error messages in terminal
2. **Read error details**: Frontend console (F12) and browser DevTools
3. **Verify prerequisites**: All software installed and versions correct
4. **Review the README**: Additional architecture details
5. **Check API responses**: Use Postman to test endpoints directly

## ✨ Next Steps

After successful setup:

1. **Explore the codebase**: Understand folder structure
2. **Test all features**: Create, read, update, delete operations
3. **Review architecture**: Check how components communicate
4. **Make modifications**: Add new features or improvements
5. **Study patterns**: Understand design patterns used

---

**Your application is ready! 🎉**

Start with the verification checklist above to ensure everything is working correctly.
