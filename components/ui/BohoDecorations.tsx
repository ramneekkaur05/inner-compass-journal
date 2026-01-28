'use client';

import { motion } from 'framer-motion';

export default function BohoDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated floating leaf - top right */}
      <motion.div
        className="absolute"
        style={{ top: '15%', right: '10%', opacity: 0.08 }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="80" height="80" viewBox="0 0 100 100">
          <path 
            d="M50 10 Q70 30 80 50 Q70 70 50 90 Q30 70 20 50 Q30 30 50 10Z" 
            fill="var(--boho-sage)"
          />
        </svg>
      </motion.div>

      {/* Animated floating sun - top left */}
      <motion.div
        className="absolute"
        style={{ top: '20%', left: '8%', opacity: 0.06 }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="20" fill="var(--boho-mustard)" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2="80"
              y2="50"
              stroke="var(--boho-terracotta)"
              strokeWidth="2"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      </motion.div>

      {/* Animated mandala - bottom right */}
      <motion.div
        className="absolute"
        style={{ bottom: '10%', right: '15%', opacity: 0.07 }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="var(--boho-sage)" strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="var(--boho-terracotta)" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="var(--boho-mustard)" strokeWidth="0.5" fill="none" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              <circle cx="50" cy="15" r="3" fill="var(--boho-clay)" />
              <path d="M50 20 L50 80" stroke="var(--boho-olive)" strokeWidth="0.5" opacity="0.3" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Animated flower - bottom left */}
      <motion.div
        className="absolute"
        style={{ bottom: '25%', left: '12%', opacity: 0.08 }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="70" height="70" viewBox="0 0 100 100">
          {/* Petals */}
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="30"
              rx="12"
              ry="20"
              fill="var(--boho-terracotta)"
              transform={`rotate(${angle} 50 50)`}
              opacity="0.6"
            />
          ))}
          {/* Center */}
          <circle cx="50" cy="50" r="10" fill="var(--boho-mustard)" />
        </svg>
      </motion.div>

      {/* Animated dots/stars scattered */}
      {[
        { top: '30%', left: '20%', delay: 0 },
        { top: '60%', right: '25%', delay: 1 },
        { top: '45%', left: '15%', delay: 2 },
        { bottom: '40%', right: '30%', delay: 1.5 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ ...pos, opacity: 0.15 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: pos.delay,
            ease: "easeInOut"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="2" fill="var(--boho-sage)" />
            <circle cx="10" cy="10" r="5" fill="none" stroke="var(--boho-clay)" strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}

      {/* Wavy lines decoration */}
      <motion.div
        className="absolute"
        style={{ top: '50%', right: '5%', opacity: 0.05 }}
        animate={{
          x: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="60" height="200" viewBox="0 0 60 200">
          <path
            d="M30 0 Q40 50 30 100 Q20 150 30 200"
            stroke="var(--boho-olive)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M20 0 Q30 50 20 100 Q10 150 20 200"
            stroke="var(--boho-sage)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
}
