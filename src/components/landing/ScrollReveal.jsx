import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, className = '', variants, once = true, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const resolvedVariants = variants || {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={resolvedVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
