import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ScrollReveal({ children, className = '', delay = 0, style = {}, type = 'fade-up' }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  let initial = { opacity: 0, y: 40 };
  if (type === 'fade-left') initial = { opacity: 0, x: 40 };
  if (type === 'fade-right') initial = { opacity: 0, x: -40 };
  if (type === 'zoom-in') initial = { opacity: 0, scale: 0.9 };

  let animate = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? animate : initial}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
