import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: '', title: '', dueDate: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAssignment(form);
      setShowModal(false);
      setForm({ subject: '', title: '', dueDate: '' });
      loadData();
    } catch (err) {
      alert('Failed to create assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      await api.submitAssignment(id);
      loadData();
    } catch (err) {
      alert('Failed to submit assignment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-green-100 text-green-800';
      case 'GRADED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Assignments</h1>
        {isTeacher && <Button onClick={() => setShowModal(true)}>Create Assignment</Button>}
      </div>

      <div className="grid gap-4">
        {assignments.map((a) => (
          <Card key={a.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.subject} • Due: {new Date(a.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>
                {a.status} {a.grade && `(${a.grade})`}
              </span>
              {!isTeacher && a.status === 'PENDING' && (
                <Button size="sm" onClick={() => handleSubmit(a.id)}>Submit</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold">Create Assignment</h2>
                <button onClick={() => setShowModal(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" isLoading={isSubmitting}>Create</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
