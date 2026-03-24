'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GoldSeparatorProps {
  icon?: React.ReactNode;
  className?: string;
}

const GoldSeparator: React.FC<GoldSeparatorProps> = ({ icon, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center justify-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-resort-gold/60"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      {icon ? (
        <span className="text-resort-gold">{icon}</span>
      ) : (
        <div className="w-2 h-2 rounded-full bg-resort-gold" />
      )}
      <motion.div
        className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-resort-gold/60"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default GoldSeparator;
