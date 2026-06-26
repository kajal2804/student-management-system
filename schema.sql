-- Student Management System Schema
-- Normalized PostgreSQL database design (3NF)

-- Students table
-- Stores core student information
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~ '^\d{10}$')
);

-- Marks table
-- Stores student marks for different subjects
-- One-to-many relationship: one student can have multiple marks
CREATE TABLE marks (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  score DECIMAL(5, 2) NOT NULL,
  exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100),
  CONSTRAINT unique_subject_per_student UNIQUE(student_id, subject)
);

-- Indexes for performance
-- Improve query performance on foreign keys and commonly filtered columns
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_students_email ON students(email);
