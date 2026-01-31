# HRMS Lite

A lightweight Human Resource Management System (HRMS) web application for managing employee records and tracking daily attendance.

## 🚀 Live Demo

- **Frontend**: 
- **Backend API**: 

## 📋 Features

### Employee Management
- Add new employees with unique Employee ID, Name, Email, and Department
- View all employees in a searchable table
- Delete employees (cascades to remove attendance records)

### Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance records with filtering by date
- Per-employee attendance summary

### Dashboard
- Overview of total employees
- Today's attendance statistics
- Department-wise employee distribution
- Quick navigation to key features

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (React)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Reducer
- **Deployment**: Vercel

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL (production)
- **CORS**: django-cors-headers
- **Deployment**: Render

## 📁 Project Structure

```
hrms-lite/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities, types, store
│   └── public/            # Static assets
│
└── backend/               # Django backend
    ├── hrms_lite/         # Django project settings
    ├── employees/         # Employee app
    ├── attendance/        # Attendance app
    └── requirements.txt   # Python dependencies
```

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+
- pnpm (or npm/yarn)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
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

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your backend URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`

## 📡 API Endpoints

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
| GET | `/api/attendance/` | List all attendance |
| POST | `/api/attendance/` | Mark attendance |
| GET | `/api/attendance/{id}/` | Get attendance record |
| PUT | `/api/attendance/{id}/` | Update attendance |
| DELETE | `/api/attendance/{id}/` | Delete attendance |
| GET | `/api/attendance/employee/{id}/` | Get employee attendance |
| GET | `/api/attendance/summary/` | Attendance summary |

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: 

### Backend (Render)

1. Create new web service
2. Connect GitHub repository
3. Set environment variables:
   - `SECRET_KEY`: Django secret key
   - `DEBUG`: False
   - `ALLOWED_HOSTS`: 
   - `CORS_ALLOWED_ORIGINS`: 
4. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
5. Start command: `gunicorn hrms_lite.wsgi:application`

## 📝 Assumptions & Limitations

- Single admin user (no authentication required per assignment)
- SQLite for development (easily switchable to PostgreSQL)
- One attendance record per employee per day
- Leave management and payroll features are out of scope

## ✨ Bonus Features Implemented

- Filter attendance records by date
- Display total present days per employee
- Dashboard summary with counts and quick actions
- Loading, empty, and error states

## 📄 License

MIT

---
