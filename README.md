# Student Management System

A full-stack web application for managing student information and academic records. Built with modern technologies following industry best practices.

## 🎯 Overview

This system allows educational institutions to:
- **Manage Students**: Create, read, update, and delete student records
- **Track Marks**: Record and manage student exam scores by subject
- **Paginate Results**: Efficiently browse through large datasets
- **View Analytics**: Check student details with academic performance metrics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│           (Components + Hooks + Axios Client)            │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP REST API
┌─────────────────────▼───────────────────────────────────┐
│                   Express Backend                        │
│    (Controllers + Services + Migrations + Validation)    │
└─────────────────────┬───────────────────────────────────┘
                      │ SQL Queries
┌─────────────────────▼───────────────────────────────────┐
│              PostgreSQL Database                         │
│      (Normalized 3NF Schema with Constraints)            │
└─────────────────────────────────────────────────────────┘
```

### Design Decisions

#### 1. **Separation of Concerns**
- **Frontend**: UI components, state management, API communication
- **Backend**: Business logic, validation, database operations
- **Database**: Normalized schema with constraints

#### 2. **Database Normalization (3NF)**
- **students table**: Stores core student information
- **marks table**: Stores exam scores (one-to-many relationship)
- **Advantages**:
  - Eliminates data redundancy
  - Ensures data consistency
  - Easy to update without cascading changes
  - Foreign key relationships maintain referential integrity

#### 3. **API Architecture (REST)**
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Proper HTTP status codes (201 for create, 400 for validation, 404 for not found, etc.)
- Consistent error response format
- Pagination support with metadata

#### 4. **Error Handling**
- Custom error classes for different scenarios
- Input validation on both client and server
- Meaningful error messages with details
- Database constraint error handling

#### 5. **Frontend UI/UX**
- Component-based architecture for reusability
- Clear separation: Forms, Lists, Details, Alerts
- Loading states during async operations
- Empty states for better UX
- Responsive design with Tailwind CSS

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 12+
- **ORM/Query Builder**: Knex.js 2.5
- **Validation**: Custom validators

### Frontend
- **Library**: React 18.2
- **HTTP Client**: Axios 1.4
- **Styling**: Tailwind CSS 3.3
- **State Management**: React Hooks (useState, useEffect)

### Development Tools
- **API Testing**: Postman/Thunder Client
- **Version Control**: Git
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- PostgreSQL 12+ installed and running
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

4. **Example .env file**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=your_password
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Seed sample data (optional)**
```bash
npm run seed
```

7. **Start the server**
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students?page=1&limit=10` | Get all students (paginated) |
| GET | `/students/:id` | Get student by ID with marks |
| POST | `/students` | Create a new student |
| PUT | `/students/:id` | Update student information |
| DELETE | `/students/:id` | Delete a student |

### Mark Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students/:id/marks` | Add mark for a student |
| PUT | `/marks/:id` | Update a mark |
| DELETE | `/marks/:id` | Delete a mark |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API status |

### Request Examples

**Create Student**
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "enrollment_date": "2024-06-01"
  }'
```

**Get All Students (Paginated)**
```bash
curl "http://localhost:5000/api/students?page=1&limit=10"
```

**Get Student with Marks**
```bash
curl http://localhost:5000/api/students/1
```

**Add Mark**
```bash
curl -X POST http://localhost:5000/api/students/1/marks \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "score": 92.5,
    "exam_date": "2024-06-15"
  }'
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "details": ["Field error 1", "Field error 2"]
}
```

## 🔒 Validation Rules

### Student
- **Name**: Required, non-empty string
- **Email**: Required, valid email format, unique
- **Phone**: Optional, must be 10 digits if provided
- **Enrollment Date**: Optional, defaults to today

### Mark
- **Subject**: Required, non-empty string
- **Score**: Required, number between 0-100
- **Exam Date**: Optional, defaults to today
- **Uniqueness**: One mark per subject per student

## 🗄️ Database Schema

### students table
```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  enrollment_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### marks table
```sql
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  exam_date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE(student_id, subject)
);
```

## 🔄 Data Flow

1. **User Action** → React Component
2. **Component** → Axios API Call
3. **Backend Route** → Controller
4. **Controller** → Service (Business Logic)
5. **Service** → Database Query (Knex)
6. **Database** → Returns Data
7. **Service** → Formats Response
8. **Controller** → HTTP Response
9. **Axios** → Component State
10. **State Change** → UI Re-render

## ⚙️ Error Handling

The system handles errors at multiple levels:

1. **Frontend**:
   - Form validation before submission
   - Try-catch blocks for API calls
   - User-friendly error messages
   - Loading states

2. **Backend**:
   - Input validation in controllers
   - Service layer error handling
   - Database constraint error mapping
   - Global error handling middleware

3. **Database**:
   - Foreign key constraints
   - Unique constraints
   - Check constraints
   - NOT NULL constraints

## 🧪 Testing the API

### Using Postman
1. Import the `Postman_Collection.json` file
2. Set variables for `base_url` (http://localhost:5000/api)
3. Test each endpoint

### Using cURL
```bash
# Get all students
curl http://localhost:5000/api/students?page=1&limit=10

# Create a student
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","phone":"9876543211"}'
```

### Using Thunder Client
Same as Postman - create requests and organize them by folder

## 📈 Scalability Considerations

1. **Database Indexing**: Indexes on frequently queried columns
2. **Pagination**: Limits data transfer and memory usage
3. **Connection Pooling**: Knex handles database connection management
4. **Error Recovery**: Graceful degradation on failures
5. **Code Modularization**: Services and controllers are reusable

## 🎨 Frontend Features

### Components
- **StudentList**: Displays paginated student data
- **StudentForm**: Create/edit student form with validation
- **StudentDetail**: Detailed view with marks and analytics
- **Pagination**: Smart pagination controls
- **Alert**: Toast-like notifications

### State Management
- React Hooks (useState, useEffect)
- Local component state
- Centralized API client

### UI/UX
- Responsive design (mobile-friendly)
- Loading skeletons
- Empty states
- Success/error notifications
- Intuitive navigation

## 📝 Assumptions Made

1. **Phone Number**: Assumed 10-digit format (Indian phone numbers). Can be adjusted for other countries.
2. **Score Range**: 0-100 for all marks. Adaptable for different grading systems.
3. **Pagination**: Default page size of 10. Can be adjusted in frontend constants.
4. **Unique Email**: Enforced at database level to prevent duplicate student records.
5. **Unique Subject per Student**: A student can only have one mark per subject (prevents duplicate entries).
6. **Enrollment Date**: Defaults to current date if not provided.
7. **Timezone**: Uses UTC in database, local timezone in frontend display.
8. **Authentication**: Not implemented (can be added with JWT tokens).

## 🔐 Security Considerations

While not fully implemented, the following practices are followed:

- Input validation on both client and server
- SQL injection prevention through parameterized queries (Knex)
- CORS configured for frontend communication
- Error messages don't expose sensitive information
- Database constraints enforce data integrity

### Future Security Enhancements
- JWT authentication and authorization
- Rate limiting
- HTTPS/TLS
- Password hashing (if authentication added)
- Request logging and monitoring
- SQL query optimization

## 🛠️ Development Workflow

1. **Backend Development**
   - Create migration for schema changes
   - Build service layer (business logic)
   - Create controller (request handlers)
   - Add routes
   - Test with Postman

2. **Frontend Development**
   - Create reusable components
   - Connect to API endpoints
   - Implement error handling
   - Add loading states
   - Test UI responsiveness

3. **Integration**
   - End-to-end testing
   - Error scenario testing
   - Performance testing

## 📦 Project Structure

```
student-management-system/
├── backend/
│   ├── src/
│   │   ├── migrations/        # Database migrations
│   │   ├── seeds/             # Sample data
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API routes
│   │   ├── utils/              # Validators, errors
│   │   ├── middleware/         # Error handling
│   │   ├── db.js              # Database connection
│   │   ├── knexfile.js        # Knex configuration
│   │   └── index.js           # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── api/                # API client and methods
│   │   ├── App.js             # Main component
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   └── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── schema.sql                  # Database schema
├── SCHEMA_DESIGN.md           # Design documentation
├── Postman_Collection.json    # API tests
└── README.md                   # This file
```

## 🚨 Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check database credentials in .env
- Verify database exists: `createdb student_management`

### API Not Responding
- Check if backend server is running on port 5000
- Check firewall settings
- Review error logs in terminal

### Frontend Can't Connect to API
- Ensure backend is running
- Check CORS configuration
- Verify API URL in frontend config

### Migration Errors
- Delete existing tables and re-run migrations
- Check migration file syntax
- Ensure PostgreSQL is running with proper permissions

## 📞 Support

For issues or questions, review:
- API endpoint documentation above
- Component code comments
- Error messages in console/logs
- Postman collection examples

## 📄 License

This project is provided as-is for educational purposes.

---

**Built with ❤️ following software engineering best practices**

Last Updated: June 2024
