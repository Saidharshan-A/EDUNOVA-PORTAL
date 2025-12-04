import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.js';

export const assignmentsRouter = Router();

assignmentsRouter.use(authenticate);

// Get assignments
assignmentsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    if (req.user!.role === 'STUDENT') {
      const studentAssignments = await prisma.studentAssignment.findMany({
        where: { userId: req.user!.id },
        include: {
          assignment: true,
        },
        orderBy: { assignment: { dueDate: 'asc' } },
      });
      res.json(studentAssignments.map((sa) => ({
        id: sa.id,
        subject: sa.assignment.subject,
        title: sa.assignment.title,
        dueDate: sa.assignment.dueDate,
        status: sa.status,
        grade: sa.grade,
      })));
    } else {
      const assignments = await prisma.assignment.findMany({
        include: {
          students: {
            include: {
              user: { select: { id: true, name: true, rollNo: true } },
            },
          },
        },
        orderBy: { dueDate: 'asc' },
      });
      res.json(assignments);
    }
  } catch (err) {
    next(err);
  }
});

// Create assignment (teachers only)
const createSchema = z.object({
  subject: z.string(),
  title: z.string(),
  dueDate: z.string().transform((s) => new Date(s)),
  studentIds: z.array(z.string()).optional(),
});

assignmentsRouter.post('/', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const { studentIds, ...data } = createSchema.parse(req.body);
    
    const assignment = await prisma.assignment.create({
      data: {
        ...data,
        students: studentIds ? {
          create: studentIds.map((userId) => ({ userId })),
        } : undefined,
      },
      include: { students: true },
    });
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
});

// Submit assignment (students only)
assignmentsRouter.post('/:id/submit', requireRole('STUDENT'), async (req: AuthRequest, res, next) => {
  try {
    const studentAssignment = await prisma.studentAssignment.update({
      where: {
        userId_assignmentId: {
          userId: req.user!.id,
          assignmentId: req.params.id,
        },
      },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
    });
    res.json(studentAssignment);
  } catch (err) {
    next(err);
  }
});

// Grade assignment (teachers only)
const gradeSchema = z.object({
  studentId: z.string(),
  grade: z.string(),
});

assignmentsRouter.post('/:id/grade', requireRole('TEACHER'), async (req, res, next) => {
  try {
    const { studentId, grade } = gradeSchema.parse(req.body);
    
    const studentAssignment = await prisma.studentAssignment.update({
      where: {
        userId_assignmentId: {
          userId: studentId,
          assignmentId: req.params.id,
        },
      },
      data: {
        status: 'GRADED',
        grade,
      },
    });
    res.json(studentAssignment);
  } catch (err) {
    next(err);
  }
});
