'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface JournalSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function JournalSection({ title, icon, children }: JournalSectionProps) {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <motion.span 
            className="text-2xl"
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {icon}
          </motion.span>
        )}
        <h2 
          className="text-base font-semibold tracking-tight"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--boho-rust)'
          }}
        >
          {title}
        </h2>
      </div>
      <div>
        {children}
      </div>
    </motion.div>
  );
}
