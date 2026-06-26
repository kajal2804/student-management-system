# Database Schema Design - Student Management System

## Overview
This document explains the normalized PostgreSQL schema design for the Student Management System.

## Tables

### 1. **students** table
Stores core student information.

#### Columns:
- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `name` (VARCHAR 255, NOT NULL): Student's full name
- `email` (VARCHAR 255, NOT NULL, UNIQUE): Unique email address with regex validation
- `phone` (VARCHAR 20, NULLABLE): Phone number with format validation (10 digits)
- `enrollment_date` (DATE, DEFAULT CURRENT_DATE): Date of enrollment
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

#### Constraints:
- **PRIMARY KEY**: Ensures uniqueness of student records
- **UNIQUE on email**: Prevents duplicate email entries
- **CHECK (email)**: Validates email format using regex
- **CHECK (phone)**: Ensures phone numbers are 10-digit format if provided

---

### 2. **marks** table
Stores student marks for different subjects, establishing a one-to-many relationship with students.

#### Columns:
- `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
- `student_id` (INTEGER, FOREIGN KEY): References students.id
- `subject` (VARCHAR 100, NOT NULL): Subject name (e.g., Mathematics, Science)
- `score` (DECIMAL(5,2), NOT NULL): Marks scored (0-100)
- `exam_date` (DATE, DEFAULT CURRENT_DATE): Date of exam
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Record creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

#### Constraints:
- **PRIMARY KEY**: Ensures uniqueness of mark records
- **FOREIGN KEY**: References students(id) with ON DELETE CASCADE
  - When a student is deleted, all their marks are automatically deleted
- **CHECK (score)**: Validates that score is between 0 and 100
- **UNIQUE(student_id, subject)**: Ensures a student has only one mark per subject (no duplicate entries)

---

## Normalization Analysis

### Why 3NF (Third Normal Form)?

#### 1NF Compliance:
- Each column contains atomic (indivisible) values
- No repeating groups of columns

#### 2NF Compliance:
- All non-key attributes are fully dependent on the primary key
- No partial dependencies on composite keys (we use single-column PKs)

#### 3NF Compliance:
- No transitive dependencies between non-key attributes
- The marks table depends only on student_id, not on other student properties

### Why Separate Tables?

**Instead of:**
```
CREATE TABLE students (
  id, name, email, subject, score, ...  -- BAD: repeating marks
)
```

**We use:**
- **students** table: Core student data (no redundancy)
- **marks** table: One-to-many relationship (one student → many marks)

**Benefits:**
- Eliminates data redundancy (student info stored once)
- Easy to update student details without affecting marks
- Easy to add/remove marks independently
- Maintains referential integrity through foreign keys

---

## Indexes

Created two indexes for performance optimization:

1. **idx_marks_student_id**: 
   - Speeds up queries filtering marks by student_id
   - Used in: Get all marks for a student, Delete student operations

2. **idx_students_email**:
   - Speeds up email lookups and uniqueness checks
   - Used in: Update, Delete operations

---

## Data Integrity Features

1. **ON DELETE CASCADE**: 
   - Automatically removes student's marks when student is deleted
   - Prevents orphaned records

2. **NOT NULL Constraints**:
   - Ensures critical fields always have values

3. **CHECK Constraints**:
   - Email format validation
   - Score range validation (0-100)
   - Phone format validation

4. **UNIQUE Constraints**:
   - Prevents duplicate emails
   - Prevents duplicate subject entries per student

---

## Example Operations

### Insert a student:
```sql
INSERT INTO students (name, email, phone) 
VALUES ('John Doe', 'john@example.com', '9876543210');
```

### Add marks for a student:
```sql
INSERT INTO marks (student_id, subject, score, exam_date)
VALUES (1, 'Mathematics', 85.50, '2024-06-01');
```

### Get student with all their marks:
```sql
SELECT 
  s.id, s.name, s.email,
  m.subject, m.score, m.exam_date
FROM students s
LEFT JOIN marks m ON s.id = m.student_id
WHERE s.id = 1;
```

### Delete a student (marks automatically deleted due to CASCADE):
```sql
DELETE FROM students WHERE id = 1;
```

---

## Scalability Considerations

- Indexes ensure queries scale with data volume
- Separate tables allow independent scaling
- Timestamp columns enable audit trails and data analysis
- Foreign key constraints maintain data consistency as the system grows
