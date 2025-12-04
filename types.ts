export type UserRole = 'teacher' | 'student' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  details?: {
    grade?: string;
    section?: string;
    rollNo?: string;
    department?: string;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  subject?: string;
}

export interface FeeRecord {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status?: 'Submitted' | 'Pending' | 'Graded';
  grade?: string;
}

export interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  room: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}