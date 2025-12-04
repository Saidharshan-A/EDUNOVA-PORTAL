import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';

export const attendanceRouter = Router();

attendanceRouter.use(authenticate);

// Get attendance records
attendanceRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    const targetUserId = req.user!.role === 'STUDENT' 
      ? req.user!.id 
      : (userId as string) || undefined;

    const records = await prisma.attendance.findMany({
      where: {
        userId: targetUserId,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, rollNo: true },
        },
      },
      orderBy: { date: 'desc' },
    });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// Get attendance summary
attendanceRouter.get('/summary', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.role === 'STUDENT' 
      ? req.user!.id 
      : (req.query.userId as string);

    const [total, present, absent, late] = await Promise.all([
      prisma.attendance.count({ where: { userId } }),
      prisma.attendance.count({ where: { userId, status: 'PRESENT' } }),
      prisma.attendance.count({ where: { userId, status: 'ABSENT' } }),
      prisma.attendance.count({ where: { userId, status: 'LATE' } }),
    ]);

    res.json({
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    });
  } catch (err) {
    next(err);
  }
});

// Create attendance record (teachers only)
const createSchema = z.object({
  userId: z.string(),
  date: z.string().transform((s) => new Date(s)),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  subject: z.string(),
});

attendanceRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const record = await prisma.attendance.create({
      data,
      include: {
        user: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

// Bulk create attendance (teachers only)
const bulkSchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  subject: z.string(),
  records: z.array(z.object({
    userId: z.string(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  })),
});

attendanceRouter.post('/bulk', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const { date, subject, records } = bulkSchema.parse(req.body);
    
    const created = await prisma.attendance.createMany({
      data: records.map((r) => ({
        userId: r.userId,
        status: r.status,
        date,
        subject,
      })),
    });
    res.status(201).json({ count: created.count });
  } catch (err) {
    next(err);
  }
});

// Update attendance record (teachers only)
attendanceRouter.patch('/:id', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const { status } = z.object({
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    }).parse(req.body);

    const record = await prisma.attendance.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(record);
  } catch (err) {
    next(err);
  }
});
