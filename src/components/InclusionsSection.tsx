'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wine, UtensilsCrossed, Waves, Gamepad2, Trophy, Trees, Wifi,
  Car, ShieldCheck, Baby, Clock, PartyPopper, ConciergeBell, Beer, PawPrint
} from 'lucide-react';
import GoldSeparator from '@/components/ui/gold-separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const inclusions = [
  { icon: <Wine className="h-5 w-5" />, text: 'Welcome Drink on Arrival', color: 'from-amber-500 to-yellow-500' },
  { icon: <UtensilsCrossed className="h-5 w-5" />, text: 'Lavish Buffet Breakfast', color: 'from-orange-500 to-red-400' },
  { icon: <Waves className="h-5 w-5" />, text: 'Beach Access up to 07:30 PM', color: 'from-blue-500 to-cyan-400' },
  { icon: <Waves className="h-5 w-5" />, text: 'Swimming Pool Usage up to 07:30 PM', color: 'from-cyan-500 to-blue-400' },
  { icon: <Gamepad2 className="h-5 w-5" />, text: 'Indoor Games (Carrom & Chess)', color: 'from-violet-500 to-purple-400' },
  { icon: <Trophy className="h-5 w-5" />, text: 'Outdoor Games (Cricket, Volleyball & Football)', color: 'from-green-500 to-emerald-400' },
  { icon: <Trees className="h-5 w-5" />, text: 'Lawn Area Access', color: 'from-emerald-500 to-green-400' },
  { icon: <Wifi className="h-5 w-5" />, text: 'Complimentary Wi-Fi in Common Areas', color: 'from-blue-500 to-indigo-400' },
  { icon: <Car className="h-5 w-5" />, text: 'Ample Car Parking Facility', color: 'from-slate-500 to-slate-400' },
  { icon: <ShieldCheck className="h-5 w-5" />, text: '24 Hours Security & Power Backup', color: 'from-blue-600 to-blue-400' },
  { icon: <Baby className="h-5 w-5" />, text: "Children's Play Area Access", color: 'from-pink-500 to-rose-400' },
  { icon: <PartyPopper className="h-5 w-5" />, text: 'All Events, Parties & Corporate Meetings', color: 'from-fuchsia-500 to-pink-400' },
  { icon: <ConciergeBell className="h-5 w-5" />, text: '24/7 Front Office Service & Security', color: 'from-teal-500 to-cyan-500' },
  { icon: <Beer className="h-5 w-5" />, text: 'Liquor Available at MRP (The Ocean Bar)', color: 'from-yellow-600 to-amber-500' },
  { icon: <PawPrint className="h-5 w-5" />, text: 'Pets Welcome (additional charges apply)', color: 'from-lime-500 to-green-500' },
];

interface InclusionsSectionProps {
  className?: string;
}

const InclusionsSection: React.FC<InclusionsSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-14 sm:py-18 lg:py-24 bg-blue-50/60 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12 sm:mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          custom={0}
        >
          <GoldSeparator icon={<Trophy className="h-4 w-4" />} className="mb-4" />
          <h2 className="section-heading">What's Included in Your Stay</h2>
          <p className="section-subheading">
            Every stay at St James Court Beach Resort comes packed with complimentary
            amenities and experiences to make your getaway truly special.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {inclusions.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              custom={index}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="glass-card rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:shadow-glass-lg transition-all duration-300 cursor-default group"
            >
              <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className="text-sm sm:text-base text-slate-700 font-medium leading-snug">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Check-in / Check-out */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="glass-card rounded-2xl p-5 flex items-center gap-4 text-center justify-center"
          >
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Check-in</p>
              <p className="text-lg font-bold text-blue-900">01:00 PM</p>
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            custom={1}
            className="glass-card rounded-2xl p-5 flex items-center gap-4 text-center justify-center"
          >
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-resort-gold to-sand-500 text-white flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Check-out</p>
              <p className="text-lg font-bold text-blue-900">11:00 AM</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InclusionsSection;
