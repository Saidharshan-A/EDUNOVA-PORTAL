# EduNova ERP Backend

Node.js/Express backend API with PostgreSQL and Prisma ORM.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string.

4. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

5. Seed the database:
```bash
npm run db:seed
```

6. Start development server:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (teachers only)
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user

### Attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/summary` - Get attendance summary
- `POST /api/attendance` - Create record (teachers)
- `POST /api/attendance/bulk` - Bulk create (teachers)
- `PATCH /api/attendance/:id` - Update record (teachers)

### Fees
- `GET /api/fees` - Get fees
- `GET /api/fees/summary` - Get fee summary
- `POST /api/fees` - Create fee (teachers)
- `PATCH /api/fees/:id` - Update fee status

### Assignments
- `GET /api/assignments` - Get assignments
- `POST /api/assignments` - Create assignment (teachers)
- `POST /api/assignments/:id/submit` - Submit (students)
- `POST /api/assignments/:id/grade` - Grade (teachers)

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/upcoming` - Get upcoming exams
- `POST /api/exams` - Create exam (teachers)
- `PATCH /api/exams/:id` - Update exam (teachers)
- `DELETE /api/exams/:id` - Delete exam (teachers)

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `POST /api/notifications` - Send notification (teachers)
- `POST /api/notifications/broadcast` - Broadcast to all (teachers)
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read

## Test Credentials

- Teacher: `sarah.j@edunova.edu` / `password`
- Student: `alex.rivera@edunova.edu` / `password`
