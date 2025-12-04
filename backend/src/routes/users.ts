import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.use(authenticate);

// Get all users (teachers only)
usersRouter.get('/', requireRole('TEACHER'), async (req: AuthRequest, res, next) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role: role as 'TEACHER' | 'STUDENT' } : undefined,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        grade: true,
        section: true,
        rollNo: true,
        department: true,
      },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get user by ID
usersRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        grade: true,
        section: true,
        rollNo: true,
        department: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Update user profile
const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  department: z.string().optional(),
});

usersRouter.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    if (req.user!.id !== req.params.id && req.user!.role !== 'TEACHER') {
      return res.status(403).json({ error: 'Cannot update other users' });
    }

    const data = updateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        grade: true,
        section: true,
        rollNo: true,
        department: true,
      },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});
