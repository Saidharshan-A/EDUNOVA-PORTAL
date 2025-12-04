import { User, AttendanceRecord, FeeRecord, Assignment, ExamSchedule, Notification } from '../types';

// Mock Data
export const MOCK_STUDENT: User = {
  id: 's1',
  name: 'Alex Rivera',
  email: 'alex.rivera@edunova.edu',
  role: 'student',
  avatar: 'https://picsum.photos/id/64/200/200',
  details: { grade: '10', section: 'A', rollNo: '1024' }
};

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'Sarah Jenkins',
  email: 'sarah.j@edunova.edu',
  role: 'teacher',
  avatar: 'https://picsum.photos/id/65/200/200',
  details: { department: 'Science' }
};

export const getAttendance = (role: 'student' | 'teacher'): AttendanceRecord[] => {
  return [
    { id: '1', date: '2023-10-25', status: 'Present', subject: 'Physics' },
    { id: '2', date: '2023-10-24', status: 'Present', subject: 'Math' },
    { id: '3', date: '2023-10-23', status: 'Absent', subject: 'Chemistry' },
    { id: '4', date: '2023-10-22', status: 'Present', subject: 'English' },
    { id: '5', date: '2023-10-21', status: 'Late', subject: 'History' },
  ];
};

export const getFees = (): FeeRecord[] => {
  return [
    { id: '1', title: 'Tuition Fee - Term 1', amount: 1200, dueDate: '2023-09-01', status: 'Paid' },
    { id: '2', title: 'Lab Fee', amount: 150, dueDate: '2023-11-15', status: 'Pending' },
    { id: '3', title: 'Library Fine', amount: 15, dueDate: '2023-10-01', status: 'Overdue' },
  ];
};

export const getAssignments = (): Assignment[] => {
  return [
    { id: '1', subject: 'Physics', title: 'Thermodynamics Report', dueDate: '2023-11-05', status: 'Pending' },
    { id: '2', subject: 'Mathematics', title: 'Calculus Problem Set', dueDate: '2023-10-30', status: 'Submitted' },
    { id: '3', subject: 'Literature', title: 'Shakespeare Essay', dueDate: '2023-10-15', status: 'Graded', grade: 'A-' },
  ];
};

export const getExams = (): ExamSchedule[] => {
  return [
    { id: '1', subject: 'Physics Mid-term', date: '2023-11-20', time: '09:00 AM', room: 'Hall A' },
    { id: '2', subject: 'Math Final', date: '2023-11-22', time: '11:00 AM', room: 'Hall B' },
  ];
};

export const getNotifications = (): Notification[] => {
  return [
    { id: '1', title: 'Exam Schedule Released', message: 'The mid-term exam schedule is now available.', date: '2 hrs ago', read: false, type: 'info' },
    { id: '2', title: 'Fee Payment Reminder', message: 'Lab fee payment is due next week.', date: '1 day ago', read: false, type: 'alert' },
  ];
};