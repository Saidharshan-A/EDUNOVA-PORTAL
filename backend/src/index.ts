import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { attendanceRouter } from './routes/attendance.js';
import { feesRouter } from './routes/fees.js';
import { assignmentsRouter } from './routes/assignments.js';
import { examsRouter } from './routes/exams.js';
import { notificationsRouter } from './routes/notifications.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/fees', feesRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/exams', examsRouter);
app.use('/api/notifications', notificationsRouter);

// Root route
app.get('/', (_, res) => {
  res.json({ 
    name: 'EduNova ERP API',
    version: '1.0.0',
    endpoints: '/api/*',
    health: '/api/health'
  });
});

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
