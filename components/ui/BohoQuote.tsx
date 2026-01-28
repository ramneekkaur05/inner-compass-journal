'use client';

import { motion } from 'framer-motion';

interface BohoQuoteProps {
  quote: string;
}

export default function BohoQuote({ quote }: BohoQuoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div 
        className="card p-8 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 241, 232, 0.95) 100%)',
        }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 opacity-20">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 0 Q20 5 15 10 Q10 5 15 0" fill="var(--boho-sage)" />
            <path d="M0 15 Q5 20 10 15 Q5 10 0 15" fill="var(--boho-terracotta)" />
          </svg>
        </div>
        <div className="absolute top-4 right-4 opacity-20 transform rotate-90">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 0 Q20 5 15 10 Q10 5 15 0" fill="var(--boho-sage)" />
            <path d="M0 15 Q5 20 10 15 Q5 10 0 15" fill="var(--boho-terracotta)" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20 transform rotate-270">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 0 Q20 5 15 10 Q10 5 15 0" fill="var(--boho-sage)" />
            <path d="M0 15 Q5 20 10 15 Q5 10 0 15" fill="var(--boho-terracotta)" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-4 opacity-20 transform rotate-180">
          <svg width="30" height="30" viewBox="0 0 30 30">
            <path d="M15 0 Q20 5 15 10 Q10 5 15 0" fill="var(--boho-sage)" />
            <path d="M0 15 Q5 20 10 15 Q5 10 0 15" fill="var(--boho-terracotta)" />
          </svg>
        </div>

        {/* Top ornament */}
        <motion.div
          className="flex justify-center mb-4"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="3" fill="var(--boho-terracotta)" />
            <circle cx="20" cy="20" r="8" stroke="var(--boho-sage)" strokeWidth="1" fill="none" />
            <circle cx="20" cy="20" r="14" stroke="var(--boho-mustard)" strokeWidth="0.5" fill="none" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Quote text */}
        <motion.p
          className="text-xl md:text-2xl handwritten leading-relaxed"
          style={{ 
            color: 'var(--boho-rust)',
            textShadow: '0 2px 4px rgba(184, 92, 56, 0.1)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          "{quote}"
        </motion.p>

        {/* Bottom ornament */}
        <motion.div
          className="flex justify-center mt-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex gap-2 items-center">
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--boho-sage)' }} />
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--boho-terracotta)' }} />
            <div className="w-1 h-1 rounded-full" style={{ background: 'var(--boho-mustard)' }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
