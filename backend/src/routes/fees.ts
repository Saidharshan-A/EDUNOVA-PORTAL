import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';

export const feesRouter = Router();

feesRouter.use(authenticate);

// Get fees
feesRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.role === 'STUDENT' 
      ? req.user!.id 
      : (req.query.userId as string) || undefined;

    const fees = await prisma.fee.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, rollNo: true } },
      },
      orderBy: { dueDate: 'asc' },
    });
    res.json(fees);
  } catch (err) {
    next(err);
  }
});

// Get fee summary
feesRouter.get('/summary', async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.role === 'STUDENT' 
      ? req.user!.id 
      : (req.query.userId as string);

    const fees = await prisma.fee.findMany({ where: { userId } });
    
    const totalDue = fees
      .filter((f) => f.status !== 'PAID')
      .reduce((sum, f) => sum + f.amount, 0);
    
    const totalPaid = fees
      .filter((f) => f.status === 'PAID')
      .reduce((sum, f) => sum + f.amount, 0);

    res.json({
      totalDue,
      totalPaid,
      pending: fees.filter((f) => f.status === 'PENDING').length,
      overdue: fees.filter((f) => f.status === 'OVERDUE').length,
    });
  } catch (err) {
    next(err);
  }
});

// Create fee (teachers only)
const createSchema = z.object({
  userId: z.string(),
  title: z.string(),
  amount: z.number().positive(),
  dueDate: z.string().transform((s) => new Date(s)),
  status: z.enum(['PAID', 'PENDING', 'OVERDUE']).default('PENDING'),
});

feesRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const fee = await prisma.fee.create({ data });
    res.status(201).json(fee);
  } catch (err) {
    next(err);
  }
});

// Update fee status
feesRouter.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const fee = await prisma.fee.findUnique({ where: { id: req.params.id } });
    if (!fee) {
      return res.status(404).json({ error: 'Fee not found' });
    }

    // Students can only mark as PAID, teachers can change any status
    const allowedStatuses = req.user!.role === 'TEACHER' 
      ? ['PAID', 'PENDING', 'OVERDUE'] 
      : ['PAID'];

    const { status } = z.object({
      status: z.enum(['PAID', 'PENDING', 'OVERDUE']).refine(
        (s) => allowedStatuses.includes(s),
        { message: 'Invalid status' }
      ),
    }).parse(req.body);

    const updated = await prisma.fee.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
