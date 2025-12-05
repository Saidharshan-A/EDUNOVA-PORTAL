import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Download, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, late: 0, percentage: 0 });
  const [students, setStudents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ userId: '', date: '', status: 'PRESENT', subject: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMonth] = useState('December 2025');

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attendanceData, summaryData] = await Promise.all([
        api.getAttendance(),
        api.getAttendanceSummary(),
      ]);
      setRecords(attendanceData);
      setSummary(summaryData);

      if (isTeacher) {
        const usersData = await api.getUsers('STUDENT');
        setStudents(usersData);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateAttendance(id, newStatus);
      setRecords(records.map(r => r.id === id ? { ...r, status: newStatus } : r));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update attendance');
    }
  };

  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAttendance({
        userId: addForm.userId,
        date: addForm.date,
        status: addForm.status,
        subject: addForm.subject,
      });
      setShowAddModal(false);
      setAddForm({ userId: '', date: '', status: 'PRESENT', subject: '' });
      loadData();
    } catch (err) {
      alert('Failed to add attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'LATE': return 'bg-yellow-100 text-yellow-800';
      case 'EXCUSED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Attendance Records</h1>
        <div className="flex space-x-2">
          {isTeacher && (
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              Add Attendance
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
              <span className="font-semibold text-lg">{currentMonth}</span>
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
            </div>
            <div className="flex space-x-2 text-sm">
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Present</span>
              <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Absent</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-xs font-medium text-gray-500 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const status = i % 7 === 0 ? 'absent' : (i % 5 === 0 ? 'late' : 'present');
              const isWeekend = (i + 1) % 7 === 0 || (i + 1) % 7 === 1;

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative border 
                    ${isWeekend
                      ? 'bg-gray-50 border-transparent text-gray-400'
                      : 'bg-white border-gray-100 hover:border-primary hover:shadow-md cursor-pointer'}`}
                >
                  <span>{day}</span>
                  {!isWeekend && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 
                      ${status === 'present' ? 'bg-green-500' : status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'}`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/10 relative">
                <span className="text-3xl font-bold text-primary">{summary.percentage}%</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Overall Attendance</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Classes</span>
                <span className="font-semibold">{summary.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Present</span>
                <span className="font-semibold text-green-600">{summary.present}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Absent</span>
                <span className="font-semibold text-red-600">{summary.absent}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Late</span>
                <span className="font-semibold text-yellow-600">{summary.late}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed History</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                {isTeacher && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {isTeacher && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.subject}</td>
                  {isTeacher && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.user?.name}</td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === record.id ? (
                      <select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded px-2 py-1"
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="EXCUSED">Excused</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    )}
                  </td>
                  {isTeacher && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === record.id ? (
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">
                          <X size={16} />
                        </button>
                      ) : (
                        <button onClick={() => setEditingId(record.id)} className="text-primary hover:text-accent">
                          Edit
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Attendance Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Attendance</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddAttendance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={addForm.userId}
                    onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">Select student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={addForm.date}
                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={addForm.subject}
                    onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="e.g., Physics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="EXCUSED">Excused</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" isLoading={isSubmitting}>Add Record</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
