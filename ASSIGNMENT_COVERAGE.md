# Assignment Coverage - Where Everything Is Implemented

This document maps every assignment requirement to the actual code implementation.

---

## ✅ TASK 1: Database Schema Design

### Requirement: Normalized PostgreSQL Schema with Primary Keys, Foreign Keys, Constraints

**Location:** `schema.sql` + `backend/src/migrations/`

### What We Built:

**1. Students Table**
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

**File:** `backend/src/migrations/001_create_students_table.js`

**Key Features:**
- ✅ **Primary Key**: `id SERIAL PRIMARY KEY` - Uniquely identifies each student
- ✅ **Unique Constraint**: `email UNIQUE` - No duplicate emails
- ✅ **NOT NULL**: Ensures required fields have values
- ✅ **Timestamps**: `created_at`, `updated_at` for audit trail
- ✅ **Index**: On email for fast lookups

---

**2. Marks Table**
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

**File:** `backend/src/migrations/002_create_marks_table.js`

**Key Features:**
- ✅ **Foreign Key**: `REFERENCES students(id)` - Links marks to students
- ✅ **ON DELETE CASCADE**: Deletes marks when student is deleted
- ✅ **CHECK Constraint**: `score >= 0 AND score <= 100` - Enforces valid scores
- ✅ **Composite Unique**: `UNIQUE(student_id, subject)` - One mark per subject per student
- ✅ **Index**: On `student_id` for fast mark lookups

### Why This Design?

**Normalization (3NF):**
- Eliminates redundancy (student info stored once)
- Makes updates easy (change name once, not multiple places)
- Maintains consistency (one source of truth)

**Constraints:**
- **Data Integrity**: Database enforces valid data
- **Referential Integrity**: Can't have marks without students
- **Uniqueness**: No duplicate entries

### How to Explain in Interview:

> "I designed a normalized 3NF schema with two tables. The students table stores core information with email uniqueness enforced. The marks table has a foreign key relationship to students with ON DELETE CASCADE so when a student is deleted, their marks are automatically removed. I used CHECK constraints to validate score ranges (0-100) and a composite unique constraint to prevent duplicate marks for the same subject. This design eliminates data redundancy and ensures consistency."

---

## ✅ TASK 2: API CRUD Operations

### Requirement: RESTful APIs for Student CRUD with Validation & Error Handling

**Location:** `backend/src/routes/`, `backend/src/controllers/`, `backend/src/services/`

### Architecture:

```
Route Handler
    ↓
Controller (validates request)
    ↓
Service (business logic)
    ↓
Database (Knex query)
    ↓
Response (JSON)
```

---

### 1. CREATE Student

**Endpoint:** `POST /api/students`

**File Structure:**
- **Route**: `backend/src/routes/studentRoutes.js`
  ```javascript
  router.post('/', studentController.createStudent.bind(studentController));
  ```

- **Controller**: `backend/src/controllers/studentController.js`
  ```javascript
  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (err) {
      next(err); // Pass to error handler
    }
  }
  ```

- **Service**: `backend/src/services/studentService.js`
  ```javascript
  async createStudent(data) {
    // Validate input
    const validation = validateStudentData(data);
    if (!validation.isValid) {
      throw new ValidationError('Invalid student data', validation.errors);
    }

    // Check for duplicate email
    const existingStudent = await db('students').where('email', data.email).first();
    if (existingStudent) {
      throw new ConflictError('Student with this email already exists');
    }

    // Insert student
    const [id] = await db('students').insert({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone || null,
      enrollment_date: data.enrollment_date || new Date().toISOString().split('T')[0],
    });

    return this.getStudentById(id);
  }
  ```

- **Validation**: `backend/src/utils/validators.js`
  ```javascript
  function validateStudentData(data) {
    const errors = [];
    
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Name is required and must be a non-empty string');
    }
    
    if (!data.email || !validateEmail(data.email)) {
      errors.push('Valid email address is required');
    }
    
    if (data.phone && !validatePhone(data.phone)) {
      errors.push('Phone must be a 10-digit number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  ```

**Status Codes:**
- ✅ `201` - Student created successfully
- ✅ `400` - Validation error
- ✅ `409` - Email already exists

---

### 2. READ All Students (Paginated)

**Endpoint:** `GET /api/students?page=1&limit=10`

**Service:** `backend/src/services/studentService.js`
```javascript
async getAllStudents(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // Fetch paginated students
  const students = await db('students')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get total count
  const countResult = await db('students').count('* as count').first();
  const totalRecords = countResult.count;
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    data: students,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalRecords,
      totalPages,
    },
  };
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 45,
    "totalPages": 5
  }
}
```

---

### 3. READ Single Student with Marks

**Endpoint:** `GET /api/students/:id`

**Service:**
```javascript
async getStudentById(studentId) {
  const student = await db('students').where('id', studentId).first();

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  // Fetch student's marks
  const marks = await db('marks').where('student_id', studentId).orderBy('exam_date', 'desc');

  return {
    ...student,
    marks,
  };
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com",
    "marks": [
      { "id": 1, "subject": "Math", "score": 92.5 },
      { "id": 2, "subject": "English", "score": 88.0 }
    ]
  }
}
```

---

### 4. UPDATE Student

**Endpoint:** `PUT /api/students/:id`

**Key Features:**
- Validates input
- Checks for duplicate email (if changed)
- Updates timestamps
- Returns updated student with marks

---

### 5. DELETE Student

**Endpoint:** `DELETE /api/students/:id`

**Feature:** Marks are automatically deleted due to `ON DELETE CASCADE`

---

### Error Handling

**Custom Errors**: `backend/src/utils/errors.js`
```javascript
class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}
```

**Error Middleware**: `backend/src/middleware/errorHandler.js`
```javascript
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle database constraint errors
  if (err.code === '23505') { // Unique violation
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists',
    });
  }
}
```

### How to Explain in Interview:

> "I implemented RESTful APIs with proper layering: routes → controllers → services → database. The controller handles HTTP requests and delegates business logic to the service layer. The service validates input, enforces business rules (like email uniqueness), and performs database operations using Knex. I used custom error classes and a global error handler middleware to provide consistent, meaningful error responses with appropriate HTTP status codes."

---

## ✅ TASK 3: Pagination Logic

### Requirement: Pagination with page, limit, and metadata

**Location:** 
- Backend: `backend/src/services/studentService.js` (line 19-39)
- Frontend: `frontend/src/components/Pagination.js`

### Backend Pagination:

**Query Parameters:**
```
GET /api/students?page=1&limit=10
```

**Service Implementation:**
```javascript
async getAllStudents(page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // LIMIT and OFFSET for pagination
  const students = await db('students')
    .orderBy('created_at', 'desc')
    .limit(limit)           // Take 10 records
    .offset(offset);        // Skip (page-1)*10 records

  // COUNT for total records
  const countResult = await db('students').count('* as count').first();
  const totalRecords = countResult.count;
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    data: students,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalRecords,
      totalPages,
    },
  };
}
```

**How it Works:**

For 45 total students with limit=10:
- Page 1: `OFFSET 0 LIMIT 10` → Records 1-10
- Page 2: `OFFSET 10 LIMIT 10` → Records 11-20
- Page 3: `OFFSET 20 LIMIT 10` → Records 21-30
- Page 4: `OFFSET 30 LIMIT 10` → Records 31-40
- Page 5: `OFFSET 40 LIMIT 10` → Records 41-45

**Formula:**
```
offset = (page - 1) * limit
totalPages = ceil(totalRecords / limit)
```

---

### Frontend Pagination:

**Component:** `frontend/src/components/Pagination.js`

**Features:**
- Smart page buttons (shows 5 pages max)
- Ellipsis (...) for skipped pages
- Previous/Next buttons
- Current page indicator

**Code:**
```javascript
const getPageNumbers = () => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Adjust if near the end
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};
```

**UI Example:**
```
← Previous [1] [2] [3] [4] [5] ... [10] Next → Page 3 of 10
```

---

### End-to-End Flow:

**1. Frontend Request:**
```javascript
// App.js
const fetchStudents = async (page = 1) => {
  const response = await studentApi.getStudents(page, PAGE_SIZE);
  setStudents(response.data.data);
  setPagination(response.data.pagination);
};
```

**2. API Call:**
```javascript
// api/studentApi.js
getStudents: (page = 1, limit = 10) =>
  client.get('/students', { params: { page, limit } })
```

**3. Backend Processing:**
```javascript
// controllers/studentController.js
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
const result = await studentService.getAllStudents(page, limit);
```

**4. Database Query:**
```javascript
// services/studentService.js
const students = await db('students')
  .orderBy('created_at', 'desc')
  .limit(limit)
  .offset(offset);
```

**5. Frontend Display:**
```javascript
// Components/StudentList.js + Pagination.js
<StudentList students={students} />
<Pagination 
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={fetchStudents}
/>
```

### How to Explain in Interview:

> "I implemented pagination using LIMIT and OFFSET in the database query. When a user requests page 2 with 10 items per page, the backend calculates offset = (2-1)*10 = 10, then queries the database with LIMIT 10 OFFSET 10. The response includes pagination metadata: current page, page size, total records, and total pages. The frontend displays smart pagination controls that show the current page, previous/next buttons, and intelligent page number buttons with ellipsis for skipped pages. This approach efficiently handles large datasets by fetching only the needed records."

---

## ✅ TASK 4: React.js Frontend Integration

### Requirement: Display student list, CRUD operations, marks, pagination, validation, clean UI

**Location:** `frontend/src/` directory

### 1. Display Student List

**Component:** `frontend/src/components/StudentList.js`

```javascript
const StudentList = ({ students, onEdit, onDelete, onView, isLoading }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!students || students.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b hover:bg-gray-50">
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phone || '-'}</td>
              <td>{new Date(student.enrollment_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onView(student.id)}>View</button>
                <button onClick={() => onEdit(student)}>Edit</button>
                <button onClick={() => onDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### 2. Create/Edit Student

**Component:** `frontend/src/components/StudentForm.js`

**Features:**
- Form validation before submission
- Error messages for each field
- Support for create and edit modes
- Disabled state during submission

```javascript
const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }

  if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
    newErrors.phone = 'Phone must be 10 digits';
  }

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    onSubmit(formData);
  }
};
```

---

### 3. View Student Details with Marks

**Component:** `frontend/src/components/StudentDetail.js`

**Features:**
- Display student information
- Show all marks in a table
- Calculate and display average score
- Color-coded badges (Green ≥80, Yellow ≥60, Red <60)
- **NEW:** Add marks form

```javascript
const calculateAverage = (marks) => {
  if (!marks || marks.length === 0) return 0;
  const total = marks.reduce((sum, mark) => sum + parseFloat(mark.score), 0);
  return (total / marks.length).toFixed(2);
};

return (
  <div>
    {/* Student Info */}
    <h2>{student.name}</h2>
    <p>Email: {student.email}</p>
    
    {/* Average Score */}
    <div className="p-4 bg-blue-50 rounded-lg">
      <p>Average Score: {calculateAverage(student.marks)}/100</p>
    </div>
    
    {/* Marks Table */}
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Score</th>
          <th>Exam Date</th>
        </tr>
      </thead>
      <tbody>
        {student.marks.map((mark) => (
          <tr key={mark.id}>
            <td>{mark.subject}</td>
            <td>
              <span className={getScoreBadgeClass(mark.score)}>
                {mark.score}
              </span>
            </td>
            <td>{new Date(mark.exam_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

### 4. Pagination UI

**Component:** `frontend/src/components/Pagination.js`

- Smart page buttons
- Previous/Next navigation
- Disabled states at boundaries
- Current page display

```javascript
<div className="flex items-center justify-center gap-2">
  <button disabled={currentPage === 1}>← Previous</button>
  
  {pages.map((page) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={currentPage === page ? 'bg-blue-600 text-white' : ''}
    >
      {page}
    </button>
  ))}
  
  <button disabled={currentPage === totalPages}>Next →</button>
  <span>Page {currentPage} of {totalPages}</span>
</div>
```

---

### 5. Form Validation

**Frontend Validation:** `StudentForm.js`
- Real-time error display
- Format validation (email, phone)
- Required field checking

**Backend Validation:** `validators.js`
- Server-side validation
- Database constraint enforcement
- Error details in response

---

### 6. Error Handling

**Component:** `frontend/src/components/Alert.js`

```javascript
const Alert = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg ${
      type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
    }`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
};
```

---

### 7. API Integration

**File:** `frontend/src/api/studentApi.js`

```javascript
export const studentApi = {
  getStudents: (page = 1, limit = 10) =>
    client.get('/students', { params: { page, limit } }),

  getStudentById: (id) =>
    client.get(`/students/${id}`),

  createStudent: (data) =>
    client.post('/students', data),

  updateStudent: (id, data) =>
    client.put(`/students/${id}`, data),

  deleteStudent: (id) =>
    client.delete(`/students/${id}`),

  addMark: (studentId, data) =>
    client.post(`/students/${studentId}/marks`, data),

  updateMark: (markId, data) =>
    client.put(`/marks/${markId}`, data),

  deleteMark: (markId) =>
    client.delete(`/marks/${markId}`),
};
```

---

### 8. State Management

**App.js** uses React Hooks for state:
```javascript
const [view, setView] = useState('list'); // 'list', 'form', 'detail'
const [students, setStudents] = useState([]);
const [selectedStudent, setSelectedStudent] = useState(null);
const [editingStudent, setEditingStudent] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [alert, setAlert] = useState({ type: '', message: '' });
```

---

### 9. Clean & Responsive UI

**Technology:** Tailwind CSS

**Features:**
- Mobile-responsive layout
- Loading spinners
- Empty states
- Color-coded information
- Hover effects
- Proper spacing and typography

```javascript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Email: {student.email}</div>
  <div>Phone: {student.phone}</div>
</div>

// Color-coded badges
<span className={`
  ${score >= 80 ? 'bg-green-100 text-green-800' : ''}
  ${score >= 60 ? 'bg-yellow-100 text-yellow-800' : ''}
  ${score < 60 ? 'bg-red-100 text-red-800' : ''}
`}>
  {score}
</span>
```

---

### How to Explain in Interview:

> "The React frontend is component-based with clean separation of concerns. StudentList displays the paginated student data in a table. StudentForm handles both create and edit with client-side validation. StudentDetail shows student information, marks, and calculates averages. Pagination provides smart navigation. I use React Hooks for state management, Axios for API communication, and Tailwind CSS for responsive styling. Loading states and empty states improve UX. The Alert component displays success/error messages. All components are reusable and follow React best practices."

---

## 📊 Assignment Requirement Mapping

| Assignment Requirement | Implementation | Location |
|----------------------|-----------------|----------|
| Database schema (normalized) | Students + Marks tables with constraints | `schema.sql`, migrations/ |
| Primary keys | SERIAL PRIMARY KEY on both tables | migrations/ |
| Foreign keys | `REFERENCES students(id) ON DELETE CASCADE` | `002_create_marks_table.js` |
| Constraints | NOT NULL, UNIQUE, CHECK, Foreign Key | migrations/ |
| Create student | POST endpoint with validation | controllers/, services/ |
| Read students | GET endpoint with all students | controllers/, services/ |
| Read student by ID (with marks) | GET by ID endpoint | controllers/, services/ |
| Update student | PUT endpoint | controllers/, services/ |
| Delete student | DELETE endpoint | controllers/, services/ |
| Validation | Client & server-side validators | validators.js, StudentForm.js |
| Error handling | Custom errors + middleware | errors.js, errorHandler.js |
| Pagination query params | page & limit parameters | controllers/, services/ |
| Pagination metadata | totalRecords, currentPage, totalPages | services/, API response |
| Student list display | StudentList component | components/ |
| Add/Edit/Delete student | StudentForm component + API calls | components/, App.js |
| View student details with marks | StudentDetail component | components/ |
| Pagination UI | Pagination component | components/ |
| Form validation | Input validation + error messages | StudentForm.js |
| Clean UI | Tailwind CSS styling | components/ |
| Responsive design | Grid layouts, mobile-first | components/ |

---

## 🎯 How to Present This in an Interview

### When asked "Walk us through your project"

> "I built a full-stack student management system with a PostgreSQL database, Node.js/Express backend, and React frontend. 
>
> Starting with the database: I designed a normalized schema with students and marks tables. The students table has a primary key, unique email constraint, and timestamps. The marks table has a foreign key to students with ON DELETE CASCADE, ensuring data consistency. I used CHECK constraints to validate scores between 0-100, and composite unique constraints to prevent duplicate marks per subject.
>
> For the backend, I implemented RESTful APIs with proper layering: routes delegating to controllers, controllers validating and delegating to services, services handling business logic. I included comprehensive input validation with custom error classes and a global error handler that provides appropriate HTTP status codes.
>
> I implemented pagination with LIMIT and OFFSET, returning metadata including total records and pages, allowing efficient browsing of large datasets.
>
> On the frontend, I built reusable React components using hooks for state management. StudentList displays paginated data with CRUD actions. StudentForm handles creation and editing with client-side validation. StudentDetail shows student information with their marks and calculated averages. The Pagination component provides smart navigation. I use Axios for API communication and Tailwind CSS for responsive styling with proper loading and empty states.
>
> The entire system demonstrates proper separation of concerns, error handling at every layer, and user-friendly experience design."

---

## 🎓 Key Concepts to Highlight

1. **Database Normalization** - Why separate tables, avoiding redundancy
2. **CRUD Operations** - All four operations with proper HTTP methods
3. **Pagination** - LIMIT/OFFSET queries with metadata
4. **Validation** - Both client and server-side
5. **Error Handling** - Custom errors, meaningful messages
6. **Component Architecture** - Reusable, single responsibility
7. **State Management** - React Hooks, lifting state up
8. **API Design** - RESTful, proper status codes
9. **UI/UX** - Responsive, loading states, error feedback
10. **Scalability** - Designed for growth with indexes and proper queries

---

This is your complete map of the assignment! Every requirement is implemented and explained. 🚀
