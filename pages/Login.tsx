import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ChevronLeft, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const isTeacher = role === 'teacher';
  
  useEffect(() => {
    setEmail(isTeacher ? "sarah.j@edunova.edu" : "alex.rivera@edunova.edu");
  }, [isTeacher]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#F6F8FA] z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-100 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-teal-50 rounded-full blur-[100px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-900/5 z-10 overflow-hidden border border-white/50"
      >
        <div className="p-8 md:p-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary mb-8 transition-colors group">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isTeacher ? 'bg-primary text-white' : 'bg-accent text-white'}`}
            >
              <User size={28} />
            </motion.div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
              {isTeacher ? 'Teacher Portal' : 'Student Login'}
            </h2>
            <p className="text-gray-500 mt-2">
              Welcome back. Please enter your details.
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Forgot password?</a>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base rounded-xl group relative overflow-hidden" 
              size="lg" 
              isLoading={isLoading}
              variant={isTeacher ? 'primary' : 'secondary'}
            >
              <span className="relative z-10 flex items-center justify-center">
                Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400">
               Protected by Enterprise Grade Security
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
