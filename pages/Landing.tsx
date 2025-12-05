import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Shield, Zap, Globe, Layers, Layout, Users, ArrowRight, Check } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll Parallax setup
  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);
  const yHeroText = useTransform(scrollY, [0, 500], [0, 120]);
  const yHeroImage = useTransform(scrollY, [0, 500], [0, -40]); // Reduced upward movement for stacked layout
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  
  // Background shapes parallax
  const yShape1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const yShape2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotateShape = useTransform(scrollY, [0, 1000], [0, 45]);

  // Mouse interaction for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]); 
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

  // Smooth out the mouse movement with heavier physics for a "premium" feel
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-primary/10 selection:text-primary" ref={containerRef}>
      
      {/* Navbar - Minimal & Classy */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 duration-300">
                <span className="font-serif font-bold text-white text-xl">E</span>
              </div>
              <span className="font-serif font-bold text-2xl text-primary tracking-tight">EduNova</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
               <NavLink href="#">Solution</NavLink>
               <NavLink href="#">Institutions</NavLink>
               <NavLink href="#">Pricing</NavLink>
            </div>
            <div className="flex gap-4 items-center">
               <button onClick={() => navigate('/login/student')} className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                 Student Log in
               </button>
               <Button variant="primary" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30" onClick={() => navigate('/login/teacher')}>
                 Teacher Access
               </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[95vh] flex flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Deep Parallax Background Layers */}
        <div className="absolute inset-0 -z-30 overflow-hidden pointer-events-none">
          {/* Layer 1: Slow moving gradient blobs */}
          <motion.div style={{ y: yBackground, rotate: rotateShape }} className="absolute top-[-20%] right-[10%] w-[70vw] h-[70vw] bg-gradient-to-br from-blue-50/80 to-teal-50/50 rounded-full blur-[120px]" />
          <motion.div style={{ y: yBackground }} className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-indigo-50/80 to-purple-50/30 rounded-full blur-[120px]" />
          
          {/* Layer 2: Faster moving shapes */}
          <motion.div style={{ y: yShape1 }} className="absolute top-[20%] left-[10%] opacity-40">
             <div className="w-32 h-32 rounded-full border border-primary/5 bg-gradient-to-b from-white/40 to-transparent backdrop-blur-sm" />
          </motion.div>
          <motion.div style={{ y: yShape2 }} className="absolute bottom-[40%] right-[15%] opacity-40">
             <div className="w-48 h-48 rounded-full border border-accent/10 bg-gradient-to-t from-white/40 to-transparent backdrop-blur-sm" />
          </motion.div>

          {/* Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
            
            {/* Text Content */}
            <motion.div 
               style={{ y: yHeroText, opacity: opacityHero }}
               className="max-w-4xl relative text-center flex flex-col items-center z-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-primary text-xs font-bold tracking-wide uppercase mb-8 mx-auto"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                The Future of EdTech
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-primary tracking-tight leading-[1] mb-8"
              >
                Campus 
                <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary ml-4">Synched.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto font-light"
              >
                An elegant ERP solution that disappears into the background, letting educators teach and students thrive.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 items-center justify-center"
              >
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 bg-primary border border-primary/10" onClick={() => navigate('/login/student')}>
                  <span>Student Login</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full" onClick={() => navigate('/login/teacher')}>
                  <span>Teacher Login</span>
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero 3D Interactive Element */}
            <div className="relative perspective-2000 w-full max-w-5xl mt-16 lg:mt-20 h-[500px] flex items-center justify-center">
               <motion.div
                  style={{ rotateX: springRotateX, rotateY: springRotateY, y: yHeroImage }}
                  initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  className="relative z-10 w-full flex justify-center"
               >
                  {/* Floating Glass Cards Composition */}
                  <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/8]">
                     
                     {/* Main Dashboard Panel - Glassmorphic - Centered */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[75%] bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 p-6 flex flex-col overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-900 flex items-center justify-center text-white">
                              <Layout size={20} />
                           </div>
                           <div>
                              <div className="h-2 w-24 bg-gray-200 rounded-full mb-2" />
                              <div className="h-2 w-16 bg-gray-100 rounded-full" />
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                           <div className="h-32 bg-white/50 rounded-2xl border border-white/50 p-4 shadow-sm">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                                 <Users size={16} />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">1,240</div>
                              <div className="text-xs text-gray-400">Active Students</div>
                           </div>
                           <div className="h-32 bg-white/50 rounded-2xl border border-white/50 p-4 shadow-sm">
                              <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center mb-3">
                                 <Zap size={16} />
                              </div>
                              <div className="text-2xl font-bold text-gray-800">98%</div>
                              <div className="text-xs text-gray-400">Attendance Rate</div>
                           </div>
                        </div>
                        
                        <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 p-4">
                           {[1,2].map(i => (
                              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                                 <div className="w-8 h-8 rounded-lg bg-white shadow-sm" />
                                 <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                                 <div className="w-12 h-2 bg-gray-200 rounded-full" />
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Floating Element 1: Notification */}
                     <motion.div 
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute right-[5%] lg:right-[15%] top-12 w-64 bg-white rounded-2xl shadow-xl shadow-blue-900/10 p-4 border border-gray-50 flex items-center gap-4 hidden sm:flex"
                     >
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                           <Check size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 text-sm">Exam Schedule</p>
                           <p className="text-xs text-gray-500">Published successfully</p>
                        </div>
                     </motion.div>

                     {/* Floating Element 2: User Card */}
                     <motion.div 
                        animate={{ y: [15, -15, 15] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute left-[5%] lg:left-[15%] bottom-20 w-56 bg-white/90 backdrop-blur rounded-2xl shadow-xl shadow-purple-900/10 p-4 border border-white/50 hidden sm:block"
                     >
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-400" />
                           <div className="h-2 w-20 bg-gray-200 rounded-full" />
                        </div>
                        <div className="space-y-2">
                           <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                           <div className="h-1.5 w-2/3 bg-gray-100 rounded-full" />
                        </div>
                     </motion.div>
                  </div>
               </motion.div>

               {/* Ambient Glow behind 3D element */}
               <motion.div 
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-tr from-primary/10 to-accent/10 blur-[80px] -z-10 rounded-full" 
               />
            </div>
        </div>
      </section>

      {/* Features - Scroll Reveal Section */}
      <section className="py-32 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="grid md:grid-cols-2 gap-16 items-start">
             <div className="sticky top-32">
               <motion.h2 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight"
               >
                 Designed for the <br /> 
                 <span className="text-accent">modern campus.</span>
               </motion.h2>
               <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  EduNova replaces clunky legacy systems with a breath of fresh air. 
                  Every interaction is crafted to save time and reduce stress for teachers and students alike.
               </p>
               <Button variant="outline" className="rounded-full px-8">Explore Features</Button>
             </div>

             <div className="grid gap-8">
                {[
                  { title: "Real-time Attendance", icon: Users, desc: "Mark attendance in seconds with intuitive lists or QR codes." },
                  { title: "Smart Fee Management", icon: Shield, desc: "Automated reminders and secure payment gateways integrated." },
                  { title: "Academic Timeline", icon: Layers, desc: "A visual journey of assignments, exams, and milestones." },
                  { title: "Global Access", icon: Globe, desc: "Secure cloud infrastructure accessible from any device, anywhere." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="bg-gray-50 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <item.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
             </div>
           </div>
        </div>
      </section>

      {/* Large Parallax Image Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-center justify-center">
         <motion.div 
            style={{ y: useTransform(scrollY, [1000, 2500], [-100, 100]) }}
            className="absolute inset-0 bg-primary"
         >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary" />
         </motion.div>
         
         <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h2 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-4xl md:text-6xl font-serif font-bold text-white mb-8"
            >
               "Finally, software that feels like it was made for humans."
            </motion.h2>
            <p className="text-blue-200 text-lg">Dr. Elena Rostova, Dean of Sciences</p>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
              <div className="text-center md:text-left">
                 <span className="font-serif font-bold text-3xl text-primary tracking-tight">EduNova</span>
                 <p className="text-gray-500 mt-2">Empowering the next generation.</p>
              </div>
              <div className="flex gap-4">
                 <Button className="rounded-full">Get Started</Button>
              </div>
           </div>
           
           <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
              <p>© 2024 EduNova Inc.</p>
              <div className="flex gap-8">
                 <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                 <a href="#" className="hover:text-primary transition-colors">Terms</a>
                 <a href="#" className="hover:text-primary transition-colors">Support</a>
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-sm font-medium text-gray-500 hover:text-primary transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
  </a>
);