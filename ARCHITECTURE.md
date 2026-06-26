# Architecture Documentation

## System Architecture Overview

This document explains the architectural design of the Student Management System, including patterns, layers, and design decisions.

## 🏗️ Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                    │
│                   (React Frontend)                       │
│     Components | State Management | API Communication   │
└─────────────────────────────────────────────────────────┘
                              ↕
                         HTTP REST API
                              ↕
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│                    (Express Backend)                     │
│   Routes | Controllers | Validation | Error Handling    │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│                    Business Logic Layer                  │
│                   (Service Classes)                      │
│     Core Logic | Data Transformation | Validation       │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                      │
│                    (Knex.js ORM)                         │
│         Query Building | Database Connection            │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│                    Database Layer                        │
│                    (PostgreSQL)                          │
│      Normalized Tables | Constraints | Indexes          │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

### Create Student Flow

```
1. User Input
   ↓
2. React Component (StudentForm)
   ├─ Validates form data
   ├─ Shows error if invalid
   ↓
3. Axios API Call
   POST /api/students
   ↓
4. Express Route Handler
   ↓
5. Controller (StudentController)
   ├─ Validates request
   ├─ Calls service
   ↓
6. Service Layer (StudentService)
   ├─ Business logic
   ├─ Database query
   ↓
7. Knex Query Builder
   ↓
8. PostgreSQL Database
   ├─ INSERT INTO students
   ├─ Enforces constraints
   ↓
9. Response Back Through Stack
   ↓
10. React State Update
    ↓
11. UI Re-renders with New Student
```

### Get Students with Pagination Flow

```
1. Component Mounts (useEffect)
   ↓
2. Axios GET /api/students?page=1&limit=10
   ↓
3. Controller extracts query params
   ↓
4. Service queries database
   ├─ COUNT(*) for total
   ├─ SELECT with LIMIT/OFFSET
   ↓
5. Database returns data
   ↓
6. Service formats pagination metadata
   ↓
7. Response with data + metadata
   ↓
8. React updates state
   ↓
9. Pagination component renders with page numbers
   ↓
10. User clicks page 2
    ↓
11. Loop repeats with page=2
```

## 🎯 Design Patterns

### 1. **MVC Pattern (Backend)**

- **Model**: Database schema (students, marks)
- **View**: JSON responses
- **Controller**: Route handlers that accept requests
- **Service Layer**: Business logic (extends MVC)

```
Route Handler
    ↓
Controller (receives request)
    ↓
Service (business logic)
    ↓
Database (data access)
    ↓
Response (JSON)
```

### 2. **Component-Based Architecture (Frontend)**

```
App (main component)
├── StudentList (displays students)
├── StudentForm (create/edit)
├── StudentDetail (view details)
├── Pagination (page navigation)
└── Alert (notifications)

Each component:
- Has single responsibility
- Manages own state
- Receives props from parent
- Calls API methods
```

### 3. **Service Layer Pattern**

Benefits:
- Centralizes business logic
- Reusable across controllers
- Testable independently
- Clean separation of concerns

```javascript
// studentService.js
- getAllStudents()
- getStudentById()
- createStudent()
- updateStudent()
- deleteStudent()
- addMark()
```

### 4. **Error Handling Pattern**

```
Try-Catch in Controller
    ↓
Throws custom AppError
    ↓
Error Handler Middleware
    ↓
Formatted JSON Response
```

### 5. **Repository Pattern (Implicit)**

Knex.js acts as a query builder:
- Abstracts SQL queries
- Prevents SQL injection
- Provides chainable API

```javascript
db('students').where('id', studentId).first()
// Instead of: SELECT * FROM students WHERE id = ?
```

## 🔄 Component Communication

### Frontend Component Hierarchy

```
App
├── View: 'list'
│   ├── StudentList
│   │   └── onClick → fetchStudentDetail()
│   └── Pagination
│       └── onChange → fetchStudents(page)
│
├── View: 'form'
│   └── StudentForm
│       └── onSubmit → handleSaveStudent()
│
└── View: 'detail'
    └── StudentDetail
        └── onBack → setView('list')
```

### State Flow

```
App State:
- view: 'list' | 'form' | 'detail'
- students: []
- selectedStudent: {}
- editingStudent: {}
- currentPage: number
- pagination: {}
- isLoading: boolean
- alert: { type, message }

Data Flow:
State Change → Component Re-render → User sees update
```

## 🗄️ Database Schema Design Rationale

### Why Separate Tables?

**Bad Design (Denormalized):**
```sql
CREATE TABLE students (
  id, name, email,
  subject1, score1,
  subject2, score2,
  subject3, score3
  -- Hard to add more marks
  -- Redundant data
  -- Difficult updates
);
```

**Good Design (Normalized):**
```sql
CREATE TABLE students (id, name, email);
CREATE TABLE marks (id, student_id, subject, score);
-- Flexible
-- No redundancy
-- Easy updates
```

### Constraints for Integrity

1. **Primary Keys**: Uniqueness
2. **Foreign Keys**: Referential integrity
3. **NOT NULL**: Required fields
4. **UNIQUE**: Prevent duplicates
5. **CHECK**: Domain constraints
6. **ON DELETE CASCADE**: Maintain consistency

## 🔐 Security Layers

### Frontend
- Input validation before submission
- Error messages don't expose system details
- CORS protection

### Backend
- Input validation on all endpoints
- Parameterized queries (Knex prevents SQL injection)
- Error messages are user-friendly
- Status codes are accurate

### Database
- Constraints enforce data validity
- Foreign keys prevent orphaned records
- Unique constraints prevent duplicates

## ⚡ Performance Considerations

### Database
```sql
-- Indexes for fast lookups
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_students_email ON students(email);
```

### Backend
- Connection pooling (Knex default)
- Pagination prevents loading entire dataset
- Efficient SELECT queries with JOINs

### Frontend
- Component-level state
- Memoization (can be added)
- Lazy loading (can be added)
- Image optimization (can be added)

## 🔄 Request-Response Cycle

### Detailed Example: Create Student

**Step 1: Frontend Component**
```javascript
const StudentForm = ({ onSubmit }) => {
  const handleSubmit = (formData) => {
    onSubmit(formData); // Call parent function
  };
};
```

**Step 2: App Component**
```javascript
const handleSaveStudent = async (data) => {
  setIsLoading(true);
  try {
    await studentApi.createStudent(data);
    fetchStudents(1);
    setView('list');
  } catch (error) {
    showAlert('error', error.message);
  }
};
```

**Step 3: API Client**
```javascript
// axios instance
client.post('/students', data);
// Sends HTTP POST request
```

**Step 4: Express Route**
```javascript
router.post('/', studentController.createStudent);
// Matches POST /api/students
```

**Step 5: Controller**
```javascript
async createStudent(req, res, next) {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    next(err); // Pass to error handler
  }
}
```

**Step 6: Service**
```javascript
async createStudent(data) {
  const validation = validateStudentData(data);
  if (!validation.isValid) {
    throw new ValidationError(...);
  }
  const [id] = await db('students').insert(data);
  return this.getStudentById(id);
}
```

**Step 7: Database**
```javascript
// Knex builds SQL
INSERT INTO students (name, email, phone, enrollment_date)
VALUES (...);
// Returns new ID
```

**Step 8: Response Back**
- Database returns ID
- Service fetches complete record
- Controller sends JSON
- Axios receives response
- App updates state
- Component re-renders

## 🎨 UI Architecture

### Component Responsibilities

**App Component**
- Manages global state
- Handles view switching
- Manages pagination state
- Calls API methods

**StudentList**
- Displays students in table
- Handles row actions (View, Edit, Delete)
- Shows loading/empty states
- Reusable, pure component

**StudentForm**
- Form UI and validation
- Controlled inputs
- Error display
- Supports create and edit modes

**StudentDetail**
- Student information display
- Marks table
- Average calculation
- Back navigation

**Pagination**
- Page number buttons
- Smart ellipsis (...) for many pages
- Page info display
- Disabled states

**Alert**
- Toast notification
- Auto-dismiss after 5 seconds
- Different types (success/error)
- Closeable

## 📈 Scalability Path

### Short Term (Next Feature)
1. Add authentication (JWT)
2. Add search/filter
3. Add sorting
4. Add bulk operations

### Medium Term (Next Quarter)
1. Add image uploads
2. Add student batches
3. Add performance analytics
4. Add report generation

### Long Term (Next Year)
1. Multi-tenant support
2. Real-time updates (WebSocket)
3. Mobile app
4. Advanced analytics
5. Machine learning insights

## 🧪 Testing Strategy

### Frontend Tests
```javascript
// Component tests
- StudentForm renders correctly
- Validation works
- API calls work
- State updates correctly
```

### Backend Tests
```javascript
// API tests
- GET /students returns paginated data
- POST /students validates input
- PUT /students/:id updates correctly
- DELETE /students/:id removes record
```

### Integration Tests
```javascript
// End-to-end
- Create student → see in list
- Edit student → update reflected
- Delete student → removed from list
- Pagination works end-to-end
```

## 🔍 Code Organization Principles

### Backend
```
routes/        → Define endpoints
controllers/   → Handle HTTP requests
services/      → Business logic
utils/         → Helpers (validators, errors)
middleware/    → Cross-cutting concerns
migrations/    → Schema versioning
seeds/         → Sample data
db.js          → Database connection
```

### Frontend
```
api/          → API client and methods
components/   → React components
App.js        → Main component
index.js      → React entry point
```

## 📝 Documentation Strategy

### Code Documentation
- Function comments explaining purpose
- Parameter types documented
- Complex logic explained
- Edge cases noted

### API Documentation
- Request/response examples
- Parameter descriptions
- Error codes explained
- Usage examples

### Setup Documentation
- Prerequisites listed
- Step-by-step instructions
- Troubleshooting guide
- Verification checklist

## 🎯 Design Principles Applied

1. **Separation of Concerns**: Each layer has specific responsibility
2. **DRY (Don't Repeat Yourself)**: Reusable components and services
3. **SOLID Principles**: Single responsibility, open for extension
4. **RESTful Design**: Standard HTTP methods and status codes
5. **Fail Fast**: Validate early, error early
6. **Clear Naming**: Names explain purpose
7. **Error Handling**: Graceful degradation
8. **Scalability**: Prepared for growth

---

This architecture provides a solid foundation that's:
- ✅ Easy to understand
- ✅ Easy to maintain
- ✅ Easy to extend
- ✅ Following best practices
- ✅ Interview-friendly
- ✅ Production-ready patterns
