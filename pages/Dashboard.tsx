import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getAttendance, getAssignments, getFees, getExams } from '../services/dataService';
import { Calendar, CheckCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const assignments = getAssignments();
  const fees = getFees();
  const exams = getExams();

  const isTeacher = user?.role === 'teacher';

  const attendancePercentage = 88;
  const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
  const nextExam = exams[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Welcome back, {user?.name.split(' ')[0]}. Here's your daily overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Download Report</Button>
          {isTeacher && <Button size="sm">Add New Class</Button>}
        </div>
      </div>

      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card hoverEffect className="flex items-center space-x-4 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="p-3 bg-accent/10 rounded-xl text-accent relative z-10">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Attendance</p>
              <h3 className="text-2xl font-bold text-gray-900">{attendancePercentage}%</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card hoverEffect className="flex items-center space-x-4 relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-400/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 relative z-10">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
              <h3 className="text-2xl font-bold text-gray-900">{pendingAssignments}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card hoverEffect className="flex items-center space-x-4 relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
             <div className="p-3 bg-primary/10 rounded-xl text-primary relative z-10">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Next Exam</p>
              <h3 className="text-lg font-bold text-gray-900 truncate w-32">{nextExam?.subject || 'None'}</h3>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card hoverEffect className="flex items-center space-x-4 relative overflow-hidden group">
             <div className="absolute right-0 top-0 w-24 h-24 bg-green-400/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div className="p-3 bg-green-50 rounded-xl text-green-600 relative z-10">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fees Status</p>
              <h3 className="text-lg font-bold text-gray-900">{fees.find(f => f.status === 'Pending') ? 'Pending' : 'Paid'}</h3>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Activity / Attendance Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900">Weekly Activity</h3>
                <select className="text-sm border-gray-200 rounded-lg shadow-sm focus:border-primary focus:ring focus:ring-primary/20 outline-none px-3 py-1">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: 'Mon', val: 90 }, { day: 'Tue', val: 85 }, { day: 'Wed', val: 95 }, { day: 'Thu', val: 88 }, { day: 'Fri', val: 92 }
                  ]}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B2545" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0B2545" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#0B2545', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#0B2545" 
                      strokeWidth={3} 
                      dot={{r: 4, fill: '#0B2545', strokeWidth: 2, stroke: '#fff'}} 
                      activeDot={{r: 8, fill: '#3AAFA9', stroke: '#fff', strokeWidth: 3}} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Assignments Table */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Upcoming Assignments</h3>
                <a href="#/assignments" className="text-sm text-accent font-medium hover:text-accent/80 transition-colors">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {assignments.slice(0, 3).map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.subject}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.title}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.dueDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-medium rounded-full 
                            ${assignment.status === 'Submitted' ? 'bg-green-100 text-green-700' : 
                              assignment.status === 'Graded' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {assignment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-8">
          
          {/* Notifications */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                <button className="text-gray-400 hover:text-primary transition-colors"><TrendingUp size={18} /></button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-2 h-2 mt-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(58,175,169,0.5)]"></div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Exam Schedule Update</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">The mid-term physics exam has been rescheduled to Room 304 due to maintenance.</p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">2 hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Fee Balance Mini Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-blue-100 text-sm font-medium">Total Balance Due</p>
                   <div className="p-2 bg-white/10 rounded-lg">
                      <DollarSign size={16} className="text-white" />
                   </div>
                </div>
                <h3 className="text-4xl font-serif font-bold mb-1">$150.00</h3>
                <p className="text-xs text-blue-200 mb-6">Due by Nov 15, 2023</p>
                <Button size="sm" className="w-full bg-white text-primary hover:bg-blue-50 border-none font-semibold">
                  Pay Now
                </Button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};