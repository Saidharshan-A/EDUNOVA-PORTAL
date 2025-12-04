import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.studentAssignment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password', 10);

  // Create teacher
  const teacher = await prisma.user.create({
    data: {
      email: 'sarah.j@edunova.edu',
      password,
      name: 'Sarah Jenkins',
      role: 'TEACHER',
      avatar: 'https://picsum.photos/id/65/200/200',
      department: 'Science',
    },
  });

  // Create student
  const student = await prisma.user.create({
    data: {
      email: 'alex.rivera@edunova.edu',
      password,
      name: 'Alex Rivera',
      role: 'STUDENT',
      avatar: 'https://picsum.photos/id/64/200/200',
      grade: '10',
      section: 'A',
      rollNo: '1024',
    },
  });

  // Create attendance records
  const subjects = ['Physics', 'Math', 'Chemistry', 'English', 'History'];
  const statuses: ('PRESENT' | 'ABSENT' | 'LATE')[] = ['PRESENT', 'PRESENT', 'ABSENT', 'PRESENT', 'LATE'];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.attendance.create({
      data: {
        userId: student.id,
        date,
        status: statuses[i],
        subject: subjects[i],
      },
    });
  }

  // Create fees
  await prisma.fee.createMany({
    data: [
      { userId: student.id, title: 'Tuition Fee - Term 1', amount: 1200, dueDate: new Date('2023-09-01'), status: 'PAID' },
      { userId: student.id, title: 'Lab Fee', amount: 150, dueDate: new Date('2023-11-15'), status: 'PENDING' },
      { userId: student.id, title: 'Library Fine', amount: 15, dueDate: new Date('2023-10-01'), status: 'OVERDUE' },
    ],
  });

  // Create assignments
  const assignment1 = await prisma.assignment.create({
    data: { subject: 'Physics', title: 'Thermodynamics Report', dueDate: new Date('2023-11-05') },
  });
  const assignment2 = await prisma.assignment.create({
    data: { subject: 'Mathematics', title: 'Calculus Problem Set', dueDate: new Date('2023-10-30') },
  });
  const assignment3 = await prisma.assignment.create({
    data: { subject: 'Literature', title: 'Shakespeare Essay', dueDate: new Date('2023-10-15') },
  });

  await prisma.studentAssignment.createMany({
    data: [
      { userId: student.id, assignmentId: assignment1.id, status: 'PENDING' },
      { userId: student.id, assignmentId: assignment2.id, status: 'SUBMITTED', submittedAt: new Date() },
      { userId: student.id, assignmentId: assignment3.id, status: 'GRADED', grade: 'A-' },
    ],
  });

  // Create exams
  await prisma.exam.createMany({
    data: [
      { subject: 'Physics Mid-term', date: new Date('2023-11-20'), time: '09:00 AM', room: 'Hall A' },
      { subject: 'Math Final', date: new Date('2023-11-22'), time: '11:00 AM', room: 'Hall B' },
    ],
  });

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: student.id, title: 'Exam Schedule Released', message: 'The mid-term exam schedule is now available.', type: 'INFO' },
      { userId: student.id, title: 'Fee Payment Reminder', message: 'Lab fee payment is due next week.', type: 'ALERT' },
    ],
  });

  console.log('✅ Seeding complete!');
  console.log(`   Teacher: ${teacher.email} / password`);
  console.log(`   Student: ${student.email} / password`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
