'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BohoButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function BohoButton({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = ''
}: BohoButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
