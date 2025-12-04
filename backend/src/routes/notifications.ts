import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';

export const notificationsRouter = Router();

notificationsRouter.use(authenticate);

// Get notifications for current user
notificationsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// Get unread count
notificationsRouter.get('/unread-count', async (req: AuthRequest, res, next) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.id, read: false },
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// Create notification (teachers only - for sending to students)
const createSchema = z.object({
  userId: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.enum(['INFO', 'ALERT', 'SUCCESS']).default('INFO'),
});

notificationsRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const notification = await prisma.notification.create({ data });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
});

// Broadcast notification to all students (teachers only)
const broadcastSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.enum(['INFO', 'ALERT', 'SUCCESS']).default('INFO'),
});

notificationsRouter.post('/broadcast', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const { title, message, type } = broadcastSchema.parse(req.body);
    
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true },
    });

    const created = await prisma.notification.createMany({
      data: students.map((s) => ({
        userId: s.id,
        title,
        message,
        type,
      })),
    });
    res.status(201).json({ count: created.count });
  } catch (err) {
    next(err);
  }
});

// Mark as read
notificationsRouter.patch('/:id/read', async (req: AuthRequest, res, next) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.id },
      data: { read: true },
    });
    res.json(notification);
  } catch (err) {
    next(err);
  }
});

// Mark all as read
notificationsRouter.post('/mark-all-read', async (req: AuthRequest, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});
