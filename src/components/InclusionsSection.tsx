'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wine, UtensilsCrossed, Waves, Gamepad2, Trees, Wifi,
  Car, ShieldCheck, Clock, PartyPopper, ConciergeBell, PawPrint,
  Sparkles, Coffee, Compass
} from 'lucide-react';
import GoldSeparator from '@/components/ui/gold-separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  },
};

const primaryExperiences = [
  {
    id: 'beach',
    tag: 'Signature Experience',
    title: 'Beach Access Until 07:30 PM',
    description: 'Step directly onto our serene private beach. Relish the warm gold sands, watch gentle ocean waves, and enjoy shoreline seating in a luxury coastal atmosphere.',
    image: '/images/pool-beachview/IMG_3397.JPG',
    icon: <Waves className="h-6 w-6 text-resort-gold" />,
    className: 'lg:col-span-4 lg:row-span-2 min-h-[420px] sm:min-h-[480px] lg:min-h-[500px]',
  },
  {
    id: 'breakfast',
    tag: 'Gastronomy',
    title: 'Complimentary Buffet Breakfast',
    description: 'Start your morning with a lavish, ocean-view dining experience featuring local & international delicacies.',
    image: '/images/gallery/gallery-17.jpg',
    icon: <UtensilsCrossed className="h-5 w-5 text-resort-gold" />,
    className: 'lg:col-span-2 lg:row-span-1 min-h-[220px] sm:min-h-[240px]',
  },
  {
    id: 'pool',
    tag: 'Wellness & Leisure',
    title: 'Swimming Pool Access',
    description: 'Unwind by our luxury swimming pool, framed by lush tropical greenery and relaxing sunbeds. Open until 07:30 PM.',
    image: '/images/gallery/gallery-26.jpeg',
    icon: <Waves className="h-5 w-5 text-resort-gold" />,
    className: 'lg:col-span-2 lg:row-span-1 min-h-[220px] sm:min-h-[240px]',
  },
  {
    id: 'recreation',
    tag: 'Leisure',
    title: 'Activities & Recreation',
    description: 'Family-friendly fun including children\'s play area, indoor board games (Carrom & Chess), and outdoor sports like cricket and volleyball.',
    image: '/images/gallery/gallery-11.jpg',
    icon: <Gamepad2 className="h-5 w-5 text-resort-gold" />,
    className: 'lg:col-span-2 min-h-[260px] sm:min-h-[280px]',
  },
  {
    id: 'events',
    tag: 'Celebrations',
    title: 'Events & Celebrations',
    description: 'Host unforgettable milestones from beach weddings and private parties to corporate meetings in our scenic event venues.',
    image: '/images/events/beach-engagement-2.jpeg',
    icon: <PartyPopper className="h-5 w-5 text-resort-gold" />,
    className: 'lg:col-span-2 min-h-[260px] sm:min-h-[280px]',
  },
  {
    id: 'bar',
    tag: 'Hospitality',
    title: 'Ocean Bar & Welcome Drink',
    description: 'Indulge in a refreshing welcome drink upon arrival. Explore premium liquors available at MRP at The Ocean Bar.',
    image: '/images/dining/dining-6.jpg',
    icon: <Wine className="h-5 w-5 text-resort-gold" />,
    className: 'lg:col-span-2 min-h-[260px] sm:min-h-[280px]',
  },
];

const supportingAmenities = [
  {
    icon: <Wifi className="h-5 w-5 text-resort-gold" />,
    title: 'Complimentary Wi-Fi',
    description: 'High-speed internet in all common areas.',
  },
  {
    icon: <Car className="h-5 w-5 text-resort-gold" />,
    title: 'Ample Car Parking',
    description: 'Secure, spacious parking for guests.',
  },
  {
    icon: <ConciergeBell className="h-5 w-5 text-resort-gold" />,
    title: '24/7 Front Office',
    description: 'Round-the-clock reception to assist you.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-resort-gold" />,
    title: 'Security & Power Backup',
    description: '24-hour monitoring and continuous power.',
  },
  {
    icon: <PawPrint className="h-5 w-5 text-resort-gold" />,
    title: 'Pets Welcome',
    description: 'Bring your furry companions (charges apply).',
  },
  {
    icon: <Trees className="h-5 w-5 text-resort-gold" />,
    title: 'Lawn Area Access',
    description: 'Lush green lawns for relaxing walks.',
  },
];

interface InclusionsSectionProps {
  className?: string;
}

const InclusionsSection: React.FC<InclusionsSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-20 sm:py-24 lg:py-28 bg-[#FFFBF5]/90 border-t border-b border-resort-gold/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          custom={0}
        >
          <span className="font-jost text-xs sm:text-sm uppercase tracking-[0.25em] text-resort-gold font-semibold mb-4 block">
            Exclusive Amenities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-resort-navy-deep tracking-wide mb-6">
            What's Included in Your Stay
          </h2>
          <GoldSeparator icon={<Compass className="h-5 w-5 text-resort-gold" />} className="mb-6" />
          <p className="text-base sm:text-lg lg:text-xl font-jost text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Every stay at St. James Court Beach Resort comes packed with complimentary amenities and experiences designed to make your getaway truly unforgettable.
          </p>
        </motion.div>

        {/* Premium Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {primaryExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              variants={fadeInUp}
              custom={index}
              className={`relative rounded-[32px] overflow-hidden group shadow-resort border border-slate-100/50 bg-white hover:-translate-y-1 hover:shadow-resort-lg transition-all duration-500 ease-out flex flex-col justify-end ${exp.className}`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
                />
                {/* Elegant Luxury Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent opacity-60 z-10" />
              </div>

              {/* Card Content */}
              <div className="relative z-20 p-6 sm:p-8 md:p-10 text-white flex flex-col h-full justify-between pointer-events-none">
                {/* Top Badge/Tag & Icon */}
                <div className="flex justify-between items-start w-full">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-jost font-semibold tracking-widest uppercase text-resort-gold bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-resort-gold/20">
                    {exp.tag}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    {exp.icon}
                  </div>
                </div>

                {/* Bottom Text Description */}
                <div className="mt-8">
                  <h3 className={`font-playfair font-bold text-white mb-2 leading-tight ${exp.id === 'beach' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>
                    {exp.title}
                  </h3>
                  <p className={`font-jost text-white/80 leading-relaxed ${exp.id === 'beach' ? 'text-sm sm:text-base max-w-xl' : 'text-xs sm:text-sm'}`}>
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Supporting Amenities Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="font-jost text-xs sm:text-sm uppercase tracking-[0.2em] text-resort-gold/80 font-medium mb-2 block">
              Essential Comforts
            </span>
            <h3 className="text-xl sm:text-2xl font-playfair font-bold text-resort-navy-deep">
              Standard Guest Services & Conveniences
            </h3>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {supportingAmenities.map((amenity, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                className="bg-white/70 backdrop-blur-sm border border-resort-gold/10 hover:border-resort-gold/30 rounded-2xl p-6 transition-all duration-300 shadow-glass hover:shadow-glass-lg hover:-translate-y-0.5 group flex flex-col items-center text-center justify-between min-h-[160px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFFBF5] border border-resort-gold/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm mb-4">
                  {amenity.icon}
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-[#071c3e] text-base mb-1.5 leading-snug">
                    {amenity.title}
                  </h4>
                  <p className="font-jost text-slate-500 text-xs sm:text-[13px] leading-relaxed">
                    {amenity.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Check-in / Check-out */}
        <motion.div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="bg-white/80 backdrop-blur-sm border border-resort-gold/10 rounded-2xl p-6 flex items-center gap-5 hover:shadow-glass transition-all duration-300"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#103D80]/5 text-[#103D80] flex items-center justify-center shadow-sm">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest font-jost">Check-in Time</p>
              <p className="text-xl font-bold font-playfair text-[#071c3e]">01:00 PM</p>
            </div>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            custom={1}
            className="bg-white/80 backdrop-blur-sm border border-resort-gold/10 rounded-2xl p-6 flex items-center gap-5 hover:shadow-glass transition-all duration-300"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-resort-gold/10 text-resort-gold flex items-center justify-center shadow-sm">
              <Clock className="h-6 w-6" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest font-jost">Check-out Time</p>
              <p className="text-xl font-bold font-playfair text-[#071c3e]">11:00 AM</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InclusionsSection;

