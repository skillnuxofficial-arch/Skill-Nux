import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RevealText = ({ text, type = 'word', className = '', delay = 0, once = true, style = {} }) => {
  const { ref, inView } = useInView({ triggerOnce: once, threshold: 0.1 });

  if (typeof text !== 'string') return <span className={className} style={style}>{text}</span>;

  let items = [];
  if (type === 'word') {
    items = text.split(' ').map((word, i) => ({ text: word + '\u00A0', key: i }));
  } else if (type === 'letter') {
    items = text.split('').map((char, i) => ({ text: char === ' ' ? '\u00A0' : char, key: i }));
  } else if (type === 'line') {
    items = text.split('\n').map((line, i) => ({ text: line, key: i }));
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: type === 'letter' ? 0.02 : 0.08, 
        delayChildren: delay 
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 150,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <motion.span
      ref={ref}
      style={{ display: type === 'line' ? 'block' : 'inline-flex', flexWrap: 'wrap', overflow: 'hidden', ...style }}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {items.map((item) => (
        <motion.span
          variants={child}
          key={item.key}
          style={{ display: type === 'line' ? 'block' : 'inline-block' }}
        >
          {item.text}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default RevealText;
