import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const classesRouter = Router();

classesRouter.use(authenticate);

// Get all classes
classesRouter.get('/', async (_req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(classes);
  } catch (err) {
    next(err);
  }
});

// Create class (teachers only)
const createSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  schedule: z.string(),
  room: z.string(),
});

classesRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const newClass = await prisma.class.create({ data });
    res.status(201).json(newClass);
  } catch (err) {
    next(err);
  }
});

// Update class (teachers only)
classesRouter.patch('/:id', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.partial().parse(req.body);
    const updated = await prisma.class.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete class (teachers only)
classesRouter.delete('/:id', requireRole('TEACHER'), async (req, res, next) => {
  try {
    await prisma.class.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
