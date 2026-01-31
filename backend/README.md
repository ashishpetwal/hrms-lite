# HRMS Lite Backend

A Django REST API backend for the HRMS Lite (Human Resource Management System) application.

## Tech Stack

- **Framework**: Django 4.2+
- **API**: Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers
- **Production Server**: Gunicorn + WhiteNoise

## Features

- **Employee Management**
  - Create, Read, Delete employees
  - Unique employee ID and email validation
  - Department tracking

- **Attendance Management**
  - Mark attendance (Present/Absent)
  - View attendance records by employee
  - Filter by date, status
  - Attendance summary per employee (bonus)

## API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Create new employee |
| GET | `/api/employees/{id}/` | Get employee details |
| PUT | `/api/employees/{id}/` | Update employee |
| DELETE | `/api/employees/{id}/` | Delete employee |

### Attendance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/` | List all attendance records |
| POST | `/api/attendance/` | Mark attendance |
| GET | `/api/attendance/{id}/` | Get attendance record |
| PUT | `/api/attendance/{id}/` | Update attendance |
| DELETE | `/api/attendance/{id}/` | Delete attendance record |
| GET | `/api/attendance/employee/{id}/` | Get attendance by employee |
| GET | `/api/attendance/summary/` | Get attendance summary |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API root info |
| GET | `/api/health/` | Health check |

## Local Setup

### Prerequisites

- Python 3.10+
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## Environment Variables

Create a `.env` file for configuration:

```env
# Django settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (for PostgreSQL)
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=hrms_lite
# DB_USER=postgres
# DB_PASSWORD=your-password
# DB_HOST=localhost
# DB_PORT=5432
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "status_code": 400,
    "message": "Error description",
    "details": { ... }
  }
}
```

## Sample API Requests

### Create Employee
```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering"
  }'
```

### Mark Attendance
```bash
curl -X POST http://localhost:8000/api/attendance/ \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": 1,
    "date": "2026-01-31",
    "status": "present"
  }'
```

## Deployment

### Render / Railway

1. Set environment variables:
   - `SECRET_KEY`: Generate a secure key
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: Your domain
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL

2. Build command:
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```

3. Start command:
   ```bash
   gunicorn hrms_lite.wsgi:application
   ```

## Project Structure

```
backend/
├── hrms_lite/           # Django project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   ├── asgi.py
│   └── exceptions.py
├── employees/           # Employee app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── attendance/          # Attendance app
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── manage.py
├── requirements.txt
└── README.md
```

## Assumptions & Limitations

- Single admin user (no authentication)
- SQLite database for simplicity (can be switched to PostgreSQL)
- No leave management or payroll features (out of scope)
- One attendance record per employee per day

## License

MIT
