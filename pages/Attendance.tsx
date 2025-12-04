import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getAttendance } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const Attendance: React.FC = () => {
  const { user } = useAuth();
  const records = getAttendance('student');
  const [currentMonth, setCurrentMonth] = useState('October 2023');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Attendance Records</h1>
        <div className="flex space-x-2">
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

           {/* Calendar Grid Placeholder - In a real app, use a proper date library */}
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
                   <span className="text-3xl font-bold text-primary">92%</span>
                   <svg className="absolute inset-0 transform -rotate-90" width="100%" height="100%">
                      <circle cx="64" cy="64" r="58" stroke="#0B2545" strokeWidth="8" fill="none" strokeDasharray="365" strokeDashoffset="30" strokeLinecap="round" />
                   </svg>
                </div>
                <p className="mt-2 text-sm text-gray-500">Overall Attendance</p>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Total Classes</span>
                 <span className="font-semibold">142</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Present</span>
                 <span className="font-semibold text-green-600">130</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-600">Absent</span>
                 <span className="font-semibold text-red-600">12</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                {user?.role === 'teacher' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">09:00 AM - 10:30 AM</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  {user?.role === 'teacher' && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-accent">Edit</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};