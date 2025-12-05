import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Calendar, MapPin, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Exams: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: '', date: '', time: '', room: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await api.getExams();
      setExams(data);
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createExam(form);
      setShowModal(false);
      setForm({ subject: '', date: '', time: '', room: '' });
      loadData();
    } catch (err) {
      alert('Failed to create exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Exam Schedule</h1>
        {isTeacher && <Button onClick={() => setShowModal(true)}>Schedule Exam</Button>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {exams.map((exam) => (
          <Card key={exam.id} hoverEffect>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <GraduationCap className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{exam.subject}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p className="flex items-center gap-2"><Calendar size={14} /> {new Date(exam.date).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><Clock size={14} /> {exam.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} /> {exam.room}</p>
                </div>
              </div>
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
                <h2 className="text-xl font-bold">Schedule Exam</h2>
                <button onClick={() => setShowModal(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <input type="text" placeholder="Time (e.g., 09:00 AM)" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <input type="text" placeholder="Room" value={form.room} onChange={(e) => setForm({...form, room: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" required />
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1" isLoading={isSubmitting}>Schedule</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
