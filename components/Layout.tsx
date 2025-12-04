import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  CreditCard, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  UserCircle,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Attendance', path: '/attendance', icon: UserCheck },
    { label: 'Fees', path: '/fees', icon: CreditCard },
    { label: 'Assignments', path: '/assignments', icon: BookOpen },
    { label: 'Timetable', path: '/timetable', icon: Calendar },
    { label: 'Exams', path: '/exams', icon: GraduationCap },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-primary text-white shadow-xl flex flex-col justify-between
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out`}
      >
        <div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">E</span>
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">EduNova</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-white/10 text-accent font-medium' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon size={20} className={isActive ? 'text-accent' : 'text-gray-400 group-hover:text-white'} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-accent rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-accent" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-primary">
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};