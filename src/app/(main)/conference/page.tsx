'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Presentation, Calendar, Phone, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
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

const venues = [
  {
    name: 'House of Lords',
    subtitle: 'Conference & Banquet Hall',
    image: '/images/conference/conference-hall-2.jpg',
    capacity: 'Up to 300 guests (theater-style)',
    description:
      'The grand House of Lords is a spacious conference and banquet hall ideal for large-scale corporate events, trade shows, seminars, weddings, and private parties. Equipped with modern audio-visual facilities, it can accommodate up to 300 guests in theater-style seating.',
    features: [
      'Modern AV equipment',
      'Flexible seating arrangements',
      'Air-conditioned',
      'Stage & podium',
      'Customizable lighting',
      'Dedicated event coordinator',
    ],
  },
  {
    name: 'Royal Castle',
    subtitle: 'Board Room',
    image: '/images/conference/conference-hall-4.jpg',
    capacity: 'Up to 30 guests',
    description:
      'Royal Castle is an elegant board room designed for intimate corporate meetings, strategy sessions, and private discussions. Furnished with premium conference furniture and equipped with presentation facilities.',
    features: [
      'Premium conference table',
      'Projector & screen',
      'High-speed WiFi',
      'Whiteboard',
      'Soundproof walls',
      'Refreshment service',
    ],
  },
];

const services = [
  {
    title: 'Corporate Events & Conferences',
    description: 'Host impactful corporate gatherings with state-of-the-art facilities and dedicated support.',
    icon: <Presentation className="h-7 w-7" />,
  },
  {
    title: 'Trade Shows & Exhibitions',
    description: 'Spacious venues with flexible layouts to showcase products and services effectively.',
    icon: <Calendar className="h-7 w-7" />,
  },
  {
    title: 'Seminars & Workshops',
    description: 'Ideal settings for knowledge sharing, training programs, and educational sessions.',
    icon: <Users className="h-7 w-7" />,
  },
  {
    title: 'Wedding Receptions',
    description: 'Elegant spaces to celebrate your special day with grandeur and sophistication.',
    icon: <CheckCircle className="h-7 w-7" />,
  },
  {
    title: 'Birthday & Anniversary Parties',
    description: 'Celebrate milestones in style with customizable decor and catering options.',
    icon: <Calendar className="h-7 w-7" />,
  },
  {
    title: 'Team Building Activities',
    description: 'Energize your team with engaging activities in a refreshing beachside environment.',
    icon: <Users className="h-7 w-7" />,
  },
];

const galleryImages = [
  { src: '/images/conference/conference-hall-3.jpg', alt: 'Conference Hall Setup' },
  { src: '/images/conference/conference-hall-5.jpg', alt: 'Meeting Room Arrangement' },
];

const Conference = () => {
  return (
    <div className="bg-resort-pearl">
      {/* Hero Section */}
      <section className="pt-36 pb-14 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/conference/conference-hall-1.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-pearl"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.p variants={fadeInUp} custom={0} className="text-sm uppercase tracking-[0.3em] text-resort-gold font-jost mb-4">
            St James Court Beach Resort
          </motion.p>
          <motion.h1 variants={fadeInUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6">
            Conference & Event Venues
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/80 font-jost">
            Host your next corporate event, seminar, or celebration in our world-class venues
            with stunning ocean views and impeccable hospitality
          </motion.p>
        </motion.div>
      </section>

      {/* Venue Cards - Alternating Layout */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">Our Venues</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-3xl mx-auto mt-4">
              Two distinct spaces designed to meet every event requirement, from grand conferences to private board meetings
            </motion.p>
          </motion.div>

          <div className="space-y-12 sm:space-y-16 lg:space-y-20">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Image - alternates left/right */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-resort group">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      width={800}
                      height={500}
                      className="w-full h-56 sm:h-72 lg:h-[400px] object-cover group-transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  {/* Capacity badge */}
                  <div className="absolute -bottom-4 left-6 glass-card px-5 py-3 rounded-2xl shadow-glass">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-800 font-semibold font-jost">{venue.capacity}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium font-jost mb-4">
                    {venue.subtitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
                    {venue.name}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-600 font-jost leading-relaxed mb-8">
                    {venue.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-blue-900 font-jost mb-4">Features & Facilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {venue.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                          <span className="text-slate-700 font-jost">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                    <Link
                      href="/contact"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3.5 rounded-full font-semibold font-jost shadow-lg hover:shadow-ocean transition-all duration-300 cursor-pointer"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Enquire Now
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
              Events We Host
            </motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-3xl mx-auto mt-4">
              From corporate conferences to milestone celebrations, our venues and expert team
              are ready to make your event a success
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-5 sm:p-6 lg:p-8 shadow-resort hover:shadow-glass-lg transition-shadow duration-300 group"
              >
                <div className="bg-blue-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-blue-900 font-jost mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 font-jost leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Image Gallery Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
              Venue Gallery
            </motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-2xl mx-auto mt-4">
              A glimpse into our conference and event spaces
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.src}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="relative group overflow-hidden rounded-2xl shadow-resort"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={500}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white font-semibold font-jost text-lg">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(/images/conference/conference-hall-1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/85 to-blue-950/90"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Plan Your Event
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-white/90 font-jost mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
            Let our dedicated team help you plan and execute a flawless event.
            Get in touch today to discuss your requirements and book your preferred venue.
          </motion.p>
          <motion.div variants={fadeInUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/contact"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold font-jost shadow-lg hover:shadow-ocean transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/gallery"
                className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold font-jost hover:bg-white hover:text-blue-900 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <Presentation className="mr-2 h-5 w-5" />
                View Gallery
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Conference;
