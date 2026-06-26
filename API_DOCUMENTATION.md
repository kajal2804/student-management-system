# API Documentation - Student Management System

Complete reference guide for all API endpoints with examples, error codes, and response formats.

## Base URL

```
http://localhost:5000/api
```

All requests should include:
```
Content-Type: application/json
```

## Response Format

### Success Response (200, 201)

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Paginated Success Response (200)

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 45,
    "totalPages": 5
  }
}
```

### Error Response (400, 404, 409, 500)

```json
{
  "success": false,
  "message": "Error description",
  "details": ["Field error 1", "Field error 2"]
}
```

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, invalid input |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry, constraint violation |
| 500 | Server Error | Internal server error |

---

## 🎓 Student Endpoints

### 1. Get All Students (Paginated)

**Request:**
```
GET /students?page=1&limit=10
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Records per page (default: 10, max: 100) |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/students?page=1&limit=10" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "9876543210",
      "enrollment_date": "2024-01-15",
      "created_at": "2024-06-20T10:30:00Z",
      "updated_at": "2024-06-20T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "phone": "9876543211",
      "enrollment_date": "2024-01-20",
      "created_at": "2024-06-20T10:30:00Z",
      "updated_at": "2024-06-20T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 45,
    "totalPages": 5
  }
}
```

---

### 2. Get Student by ID (with Marks)

**Request:**
```
GET /students/:id
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Student ID |

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/students/1" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "9876543210",
    "enrollment_date": "2024-01-15",
    "created_at": "2024-06-20T10:30:00Z",
    "updated_at": "2024-06-20T10:30:00Z",
    "marks": [
      {
        "id": 1,
        "student_id": 1,
        "subject": "Mathematics",
        "score": 92.5,
        "exam_date": "2024-04-10",
        "created_at": "2024-06-20T10:30:00Z",
        "updated_at": "2024-06-20T10:30:00Z"
      },
      {
        "id": 2,
        "student_id": 1,
        "subject": "English",
        "score": 88.0,
        "exam_date": "2024-04-12",
        "created_at": "2024-06-20T10:30:00Z",
        "updated_at": "2024-06-20T10:30:00Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### 3. Create Student

**Request:**
```
POST /students
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "enrollment_date": "2024-06-20"
}
```

**Body Parameters:**
| Name | Type | Required | Rules | Description |
|------|------|----------|-------|-------------|
| name | string | Yes | Non-empty | Student's full name |
| email | string | Yes | Valid email, unique | Email address |
| phone | string | No | 10 digits | Phone number |
| enrollment_date | date | No | YYYY-MM-DD | Enrollment date (default: today) |

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "enrollment_date": "2024-06-20"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 11,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "enrollment_date": "2024-06-20",
    "created_at": "2024-06-20T11:00:00Z",
    "updated_at": "2024-06-20T11:00:00Z",
    "marks": []
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Invalid student data",
  "details": [
    "Valid email address is required",
    "Phone must be a 10-digit number"
  ]
}
```

**Conflict Error (409):**
```json
{
  "success": false,
  "message": "Student with this email already exists"
}
```

---

### 4. Update Student

**Request:**
```
PUT /students/:id
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Student ID |

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "9876543210",
  "enrollment_date": "2024-06-20"
}
```

**Body Parameters:**
Same as Create Student (all fields optional for updates)

**cURL Example:**
```bash
curl -X PUT "http://localhost:5000/api/students/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "9876543210"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "9876543210",
    "enrollment_date": "2024-06-20",
    "created_at": "2024-06-20T10:30:00Z",
    "updated_at": "2024-06-20T11:15:00Z",
    "marks": []
  }
}
```

**Error Responses:**
- 400: Validation error
- 404: Student not found
- 409: Email already exists

---

### 5. Delete Student

**Request:**
```
DELETE /students/:id
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Student ID |

**cURL Example:**
```bash
curl -X DELETE "http://localhost:5000/api/students/1" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

**Note:** When a student is deleted, all their marks are automatically deleted due to CASCADE constraint.

**Error Response (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

## 📊 Mark Endpoints

### 1. Add Mark for Student

**Request:**
```
POST /students/:id/marks
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Student ID |

**Request Body:**
```json
{
  "subject": "Mathematics",
  "score": 92.5,
  "exam_date": "2024-06-15"
}
```

**Body Parameters:**
| Name | Type | Required | Rules | Description |
|------|------|----------|-------|-------------|
| subject | string | Yes | Non-empty, unique per student | Subject name |
| score | number | Yes | 0-100 | Exam score |
| exam_date | date | No | YYYY-MM-DD | Exam date (default: today) |

**cURL Example:**
```bash
curl -X POST "http://localhost:5000/api/students/1/marks" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "score": 92.5,
    "exam_date": "2024-06-15"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Mark added successfully",
  "data": {
    "id": 25,
    "student_id": 1,
    "subject": "Mathematics",
    "score": 92.5,
    "exam_date": "2024-06-15",
    "created_at": "2024-06-20T11:30:00Z",
    "updated_at": "2024-06-20T11:30:00Z"
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Invalid mark data",
  "details": [
    "Score must be a number between 0 and 100"
  ]
}
```

**Conflict Error (409):**
```json
{
  "success": false,
  "message": "Mark for this subject already exists for this student"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

---

### 2. Update Mark

**Request:**
```
PUT /marks/:id
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Mark ID |

**Request Body:**
```json
{
  "subject": "Mathematics",
  "score": 95.0,
  "exam_date": "2024-06-15"
}
```

**Body Parameters:**
Same as Add Mark

**cURL Example:**
```bash
curl -X PUT "http://localhost:5000/api/marks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "score": 95.0,
    "exam_date": "2024-06-15"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Mark updated successfully",
  "data": {
    "id": 1,
    "student_id": 1,
    "subject": "Mathematics",
    "score": 95.0,
    "exam_date": "2024-06-15",
    "created_at": "2024-06-20T10:30:00Z",
    "updated_at": "2024-06-20T11:45:00Z"
  }
}
```

**Error Responses:**
- 400: Validation error
- 404: Mark not found

---

### 3. Delete Mark

**Request:**
```
DELETE /marks/:id
```

**Parameters:**
| Name | Type | Location | Required | Description |
|------|------|----------|----------|-------------|
| id | integer | Path | Yes | Mark ID |

**cURL Example:**
```bash
curl -X DELETE "http://localhost:5000/api/marks/1" \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Mark deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Mark not found"
}
```

---

## 🏥 Health Check

### Check API Status

**Request:**
```
GET /health
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/health"
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-06-20T11:50:00.000Z"
}
```

---

## 📋 Pagination Guide

### How Pagination Works

Query parameters:
- `page`: Current page number (starting from 1)
- `limit`: Records per page (1-100, default: 10)

### Example Requests

**First page:**
```
GET /students?page=1&limit=10
```

**Second page:**
```
GET /students?page=2&limit=10
```

**Custom limit:**
```
GET /students?page=1&limit=20
```

### Pagination Response

```json
{
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalRecords": 45,
    "totalPages": 5
  }
}
```

**Calculations:**
- Total Pages = Math.ceil(Total Records / Page Size)
- Offset = (Page - 1) × Page Size

### Example Scenario

With 45 total records and limit=10:
- Page 1: Records 1-10
- Page 2: Records 11-20
- Page 3: Records 21-30
- Page 4: Records 31-40
- Page 5: Records 41-45
- Total Pages: 5

---

## 🔍 Validation Rules Summary

### Student
| Field | Type | Rules |
|-------|------|-------|
| name | string | Required, non-empty |
| email | string | Required, valid format, unique in database |
| phone | string | Optional, must be exactly 10 digits |
| enrollment_date | date | Optional, format: YYYY-MM-DD |

### Mark
| Field | Type | Rules |
|-------|------|-------|
| subject | string | Required, non-empty |
| score | number | Required, must be 0-100 |
| exam_date | date | Optional, format: YYYY-MM-DD |

### Constraints
- Email unique across all students
- One mark per student per subject (can't have duplicate subjects)
- Score always between 0 and 100

---

## 🔐 Error Handling

### Common Error Scenarios

**Validation Error - Missing Field**
```json
{
  "success": false,
  "message": "Invalid student data",
  "details": ["Name is required and must be a non-empty string"]
}
```

**Validation Error - Invalid Format**
```json
{
  "success": false,
  "message": "Invalid student data",
  "details": ["Valid email address is required", "Phone must be a 10-digit number"]
}
```

**Resource Not Found**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**Duplicate Entry**
```json
{
  "success": false,
  "message": "Student with this email already exists"
}
```

**Referenced Resource Not Found**
```json
{
  "success": false,
  "message": "Referenced resource does not exist"
}
```

**Server Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Request/Response Examples

### Complete Workflow Example

**1. Create a Student**
```bash
curl -X POST "http://localhost:5000/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emily Davis",
    "email": "emily.davis@example.com",
    "phone": "9123456789",
    "enrollment_date": "2024-06-20"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 12,
    "name": "Emily Davis",
    "email": "emily.davis@example.com",
    "phone": "9123456789",
    "enrollment_date": "2024-06-20",
    "created_at": "2024-06-20T12:00:00Z",
    "updated_at": "2024-06-20T12:00:00Z",
    "marks": []
  }
}
```

**2. Add Mark for Student (ID: 12)**
```bash
curl -X POST "http://localhost:5000/api/students/12/marks" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Physics",
    "score": 88.5,
    "exam_date": "2024-06-15"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Mark added successfully",
  "data": {
    "id": 26,
    "student_id": 12,
    "subject": "Physics",
    "score": 88.5,
    "exam_date": "2024-06-15",
    "created_at": "2024-06-20T12:05:00Z",
    "updated_at": "2024-06-20T12:05:00Z"
  }
}
```

**3. Get Student with Marks**
```bash
curl -X GET "http://localhost:5000/api/students/12"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 12,
    "name": "Emily Davis",
    "email": "emily.davis@example.com",
    "phone": "9123456789",
    "enrollment_date": "2024-06-20",
    "created_at": "2024-06-20T12:00:00Z",
    "updated_at": "2024-06-20T12:00:00Z",
    "marks": [
      {
        "id": 26,
        "student_id": 12,
        "subject": "Physics",
        "score": 88.5,
        "exam_date": "2024-06-15",
        "created_at": "2024-06-20T12:05:00Z",
        "updated_at": "2024-06-20T12:05:00Z"
      }
    ]
  }
}
```

---

## 🧪 Testing Checklist

Use this checklist when testing the API:

- [ ] Health check returns OK status
- [ ] Can create student with valid data
- [ ] Creation fails with duplicate email
- [ ] Creation fails with invalid email
- [ ] Creation fails with invalid phone
- [ ] Can retrieve all students (paginated)
- [ ] Can retrieve specific student by ID
- [ ] Retrieved student includes all marks
- [ ] Can update student information
- [ ] Update fails with invalid email
- [ ] Can delete a student
- [ ] Deleting student also deletes marks
- [ ] Can add mark for student
- [ ] Adding mark fails if subject already exists
- [ ] Adding mark fails with score > 100
- [ ] Can update mark score
- [ ] Can delete a mark
- [ ] Pagination returns correct metadata
- [ ] Pagination handles invalid page gracefully

---

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Installation guide
- [SCHEMA_DESIGN.md](./SCHEMA_DESIGN.md) - Database design explanation

---

**Last Updated:** June 2024
