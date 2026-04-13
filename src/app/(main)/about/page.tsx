'use client';

import React from 'react';
import Link from 'next/link';
import {
  Check,
  Star,
  Calendar,
  Phone,
  Building2,
  Award,
  BedDouble,
  UtensilsCrossed,
  PartyPopper,
  Anchor,
} from 'lucide-react';
import { motion } from 'framer-motion';
import WaveDivider from '@/components/ui/wave-divider';
import GoldSeparator from '@/components/ui/gold-separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const amenities = [
  'Private Beach Access', 'Swimming Pool', 'Sea Queen Restaurant', 'Sea Breeze Restaurant',
  'The Ocean Bar', 'Conference Hall (House of Lords)', 'Board Room (Royal Castle)', 'Lawn for Events',
  '24/7 Room Service', 'Free WiFi', 'Air Conditioning', 'LCD Television',
  'Intercom Facility', 'Running Hot & Cold Water', 'Attached Bathrooms', 'Wardrobe',
  'Mini Fridge', 'Tea/Coffee Maker', 'Iron & Ironing Board', 'Doctor on Call',
  'Laundry Service', 'Car Parking', 'Power Backup', 'CCTV Surveillance',
  'Fire Safety', 'Travel Desk', 'Currency Exchange', 'Luggage Storage',
  'Wheelchair Access', "Children's Play Area",
];

const stats = [
  { label: 'Rooms', value: '40+', icon: <BedDouble className="h-7 w-7" /> },
  { label: 'Years of Excellence', value: '25+', icon: <Award className="h-7 w-7" /> },
  { label: 'Restaurants', value: '3', icon: <UtensilsCrossed className="h-7 w-7" /> },
  { label: 'Event Venues', value: '2', icon: <PartyPopper className="h-7 w-7" /> },
];

const About = () => {
  return (
    <div className="bg-resort-cream">
      {/* Hero Section */}
      <section className="pt-36 pb-14 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-exterior-1.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-resort-gold-light font-jost mb-4">
            About Our Resort
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
            Only Resort in Pondicherry<br className="hidden md:block" /> Right on the Beach
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/80 font-jost">
            A beachfront sanctuary where warm hospitality meets the timeless charm of the Bay of Bengal
          </p>
        </motion.div>
      </section>

      {/* Resort Description */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold font-jost mb-6 sm:mb-8 border border-blue-100">
              <Building2 className="h-4 w-4" />
              Our Story
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-blue-900 mb-6 sm:mb-8">
              St James Court Beach Resort
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-jost mb-8">
              St James Court Beach Resort is located on Pondicherry&apos;s East Coast Road in Chinna Kalapet,
              right on the beach. It is the only resort in Pondicherry situated directly on the beachfront.
              With the Bay of Bengal as your backyard, every moment here is defined by the soothing sound
              of waves, golden sunrises, and the refreshing ocean breeze.
            </p>
            <div className="gold-line w-24 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Stats Section */}
      <section className="py-12 sm:py-14 lg:py-18 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-ocean-600 text-white rounded-2xl mb-4 shadow-ocean">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-blue-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 font-jost text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* NTS Group History */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="inline-flex items-center gap-2 bg-sand-50 text-resort-gold px-5 py-2 rounded-full text-sm font-semibold font-jost mb-6 border border-sand-200">
                <Award className="h-4 w-4" />
                Our Legacy
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-blue-900 mb-6">
                The NTS Group
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-jost mb-6">
                Established in 1998, the NTS Group has over 25 years of excellence in hospitality
                and related industries. What began as a vision to deliver outstanding guest
                experiences has grown into a trusted name across multiple sectors.
              </p>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-jost mb-8">
                Sister companies include <span className="font-semibold text-blue-900">NTS Travels &amp; Tours</span> and{' '}
                <span className="font-semibold text-blue-900">NTS Constructions</span>, reflecting
                the group&apos;s diverse expertise and commitment to quality across every venture.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-sand-50 px-4 py-2.5 rounded-xl border border-sand-200/50">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-jost text-slate-700">NTS Travels &amp; Tours</span>
                </div>
                <div className="flex items-center gap-2 bg-sand-50 px-4 py-2.5 rounded-xl border border-sand-200/50">
                  <div className="w-3 h-3 bg-ocean-500 rounded-full"></div>
                  <span className="text-sm font-jost text-slate-700">NTS Constructions</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="glass-card-dark rounded-2xl p-6 sm:p-8 lg:p-10">
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-bold text-gradient-ocean mb-2">
                    25+
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-jost text-slate-600 mb-8">Years of Excellence</p>
                  <div className="gold-line w-16 mx-auto mb-8 rounded-full"></div>
                  <div className="space-y-4 text-left">
                    {[
                      { year: '1998', text: 'NTS Group established' },
                      { year: '2000s', text: 'NTS Travels & Tours launched' },
                      { year: '2010s', text: 'NTS Constructions founded' },
                      { year: 'Present', text: 'St James Court Beach Resort thrives' },
                    ].map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <span className="text-sm font-bold text-resort-gold font-jost min-w-[60px]">
                          {milestone.year}
                        </span>
                        <div className="w-2 h-2 bg-resort-gold rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 font-jost">{milestone.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Amenities Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-10 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Check className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">Resort Amenities</h2>
            <p className="section-subheading">
              From private beach access to 24/7 room service, we have thought of every detail
              to make your stay truly exceptional
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index % 8}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 glass-card px-3 py-3 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4 rounded-xl cursor-pointer group"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-ocean-600 rounded-full flex items-center justify-center shadow-ocean group-hover:shadow-lg transition-shadow duration-300">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-slate-700 font-jost text-sm font-medium">{amenity}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* TripAdvisor Section */}
      <section className="py-12 sm:py-14 lg:py-18 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="glass-card-dark rounded-2xl p-6 sm:p-8 md:p-10 lg:p-14 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-resort-gold fill-current" />
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
              Rated Among the Top Beach Resorts in Pondicherry
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-jost max-w-2xl mx-auto mb-6">
              Our guests consistently rate us among the finest beachfront resorts in Pondicherry on TripAdvisor,
              praising our unbeatable location, warm hospitality, and exceptional dining experiences.
            </p>
            <div className="inline-flex items-center gap-2 text-resort-gold font-jost font-semibold text-sm">
              <Star className="h-4 w-4 fill-current" />
              Highly Rated on TripAdvisor
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16 sm:py-20 lg:py-28 relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: 'url(/images/gallery/resort-exterior-1.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/85 to-blue-950/90"></div>
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GoldSeparator className="mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Experience the Beachfront Difference
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 font-jost mb-10 max-w-2xl mx-auto">
            Book your stay at St James Court Beach Resort and wake up to the sound of waves,
            golden sunrises, and the warmth of true Indian hospitality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-resort-gold to-sand-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-gold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="border-2 border-white/40 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
