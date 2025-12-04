import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';

export const examsRouter = Router();

examsRouter.use(authenticate);

// Get all exams
examsRouter.get('/', async (_req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(exams);
  } catch (err) {
    next(err);
  }
});

// Get upcoming exams
examsRouter.get('/upcoming', async (_req, res, next) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });
    res.json(exams);
  } catch (err) {
    next(err);
  }
});

// Create exam (teachers only)
const createSchema = z.object({
  subject: z.string(),
  date: z.string().transform((s) => new Date(s)),
  time: z.string(),
  room: z.string(),
});

examsRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const exam = await prisma.exam.create({ data });
    res.status(201).json(exam);
  } catch (err) {
    next(err);
  }
});

// Update exam (teachers only)
examsRouter.patch('/:id', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.partial().parse(req.body);
    const exam = await prisma.exam.update({
      where: { id: req.params.id },
      data,
    });
    res.json(exam);
  } catch (err) {
    next(err);
  }
});

// Delete exam (teachers only)
examsRouter.delete('/:id', requireRole('TEACHER'), async (req, res, next) => {
  try {
    await prisma.exam.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
