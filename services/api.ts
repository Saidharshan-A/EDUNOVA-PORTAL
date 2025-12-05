const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('erp_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('erp_token', token);
    } else {
      localStorage.removeItem('erp_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData: any) {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Users
  async getUsers(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.request<any[]>(`/users${query}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  // Attendance
  async getAttendance(params?: { userId?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any[]>(`/attendance${query ? `?${query}` : ''}`);
  }

  async getAttendanceSummary(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any>(`/attendance/summary${query}`);
  }

  async createAttendance(data: any) {
    return this.request<any>('/attendance', { method: 'POST', body: JSON.stringify(data) });
  }

  async bulkCreateAttendance(data: any) {
    return this.request<any>('/attendance/bulk', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateAttendance(id: string, status: string) {
    return this.request<any>(`/attendance/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  // Fees
  async getFees(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any[]>(`/fees${query}`);
  }

  async getFeesSummary(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<any>(`/fees/summary${query}`);
  }

  async createFee(data: any) {
    return this.request<any>('/fees', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateFeeStatus(id: string, status: string) {
    return this.request<any>(`/fees/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  // Assignments
  async getAssignments() {
    return this.request<any[]>('/assignments');
  }

  async createAssignment(data: any) {
    return this.request<any>('/assignments', { method: 'POST', body: JSON.stringify(data) });
  }

  async submitAssignment(id: string) {
    return this.request<any>(`/assignments/${id}/submit`, { method: 'POST' });
  }

  async gradeAssignment(id: string, studentId: string, grade: string) {
    return this.request<any>(`/assignments/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify({ studentId, grade }),
    });
  }

  // Exams
  async getExams() {
    return this.request<any[]>('/exams');
  }

  async getUpcomingExams() {
    return this.request<any[]>('/exams/upcoming');
  }

  async createExam(data: any) {
    return this.request<any>('/exams', { method: 'POST', body: JSON.stringify(data) });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/notifications/unread-count');
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/mark-all-read', { method: 'POST' });
  }

  // Classes
  async getClasses() {
    return this.request<any[]>('/classes');
  }

  async createClass(data: { name: string; subject: string; schedule: string; room: string }) {
    return this.request<any>('/classes', { method: 'POST', body: JSON.stringify(data) });
  }

  async updateClass(id: string, data: any) {
    return this.request<any>(`/classes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  }

  async deleteClass(id: string) {
    return this.request<any>(`/classes/${id}`, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
