"# EduCluster - Educational Management System

A comprehensive educational management system with role-based access control and admin approval workflow.

## Features

### Two-Step Account Creation Process

- **Students**: Immediate account creation and login
- **Faculty/HOD/Principal**: Request submission → Admin approval → Account activation

### Role-Based Access

- **Principal**: Full system administration
- **HOD**: Department management
- **Faculty**: Course and assignment management
- **Student**: Learning and assignment submission
- **Admin**: User approval and system management

### Admin Panel

- Hardcoded admin credentials for simplicity
- View and manage pending account requests
- Approve or reject non-student registrations
- Monitor system statistics

## Quick Start

### 1. Start the Backend Server

```bash
# Run the batch file to start backend
start-backend.bat

# Or manually:
cd backend
npm install
npm run dev
```

Backend will run on: `http://localhost:3001`

### 2. Start the Frontend

```bash
cd educluster
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Admin Access

Access the admin panel at: `http://localhost:5173/admin`

**Admin Credentials:**

- ID: `admin123`
- Password: `admin@123`

## User Workflow

### For Students

1. Go to signup page
2. Select "Student" role
3. Fill registration form
4. Account created immediately
5. Automatic login

### For Faculty/HOD/Principal

1. Go to signup page
2. Select desired role (Faculty/HOD/Principal)
3. Fill registration form
4. Request submitted to admin
5. Wait for admin approval
6. Login after approval

### For Admin

1. Go to admin panel (`/admin`)
2. Login with admin credentials
3. View pending requests
4. Approve or reject requests
5. Monitor system statistics

## API Endpoints

### Authentication

- `POST /api/signup/student` - Direct student registration
- `POST /api/signup/request` - Non-student registration request
- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login

### Admin Management

- `GET /api/admin/pending-requests` - Get pending requests
- `POST /api/admin/approve/:requestId` - Approve request
- `POST /api/admin/reject/:requestId` - Reject request
- `GET /api/admin/users` - Get all approved users

## Project Structure

```
EduCluster/
├── backend/                 # Express.js backend
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── educluster/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Login.jsx   # Updated login component
│   │   ├── pages/
│   │   │   ├── SignUp.jsx  # Two-step signup
│   │   │   └── AdminPanel.jsx # Admin dashboard
│   │   └── ...
│   └── ...
├── start-backend.bat       # Backend startup script
└── README.md              # This file
```

## Technology Stack

### Backend

- Node.js + Express.js
- In-memory data storage (easily replaceable with database)
- bcryptjs for password hashing
- CORS enabled for frontend communication

### Frontend

- React 18 with Vite
- Styled Components for styling
- Framer Motion for animations
- React Router for navigation
- React Icons for UI icons

## Development Notes

- No JWT tokens used (as requested for simplicity)
- Hardcoded admin credentials
- In-memory storage (replace with database in production)
- Simple validation and error handling
- Responsive design for various screen sizes

## Next Steps for Production

1. Replace in-memory storage with a database (PostgreSQL/MySQL)
2. Add proper authentication with JWT tokens
3. Implement email notifications for account approvals
4. Add file upload capabilities for assignments
5. Implement proper logging and monitoring
6. Add unit and integration tests
7. Set up proper environment configuration"
