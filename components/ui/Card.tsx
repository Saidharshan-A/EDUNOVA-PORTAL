import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, boxShadow: "0 20px 40px -5px rgba(11, 37, 69, 0.08)" } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};