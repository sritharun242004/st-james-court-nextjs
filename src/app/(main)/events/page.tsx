'use client';

import React, { useState } from 'react';
import { Heart, Users, Briefcase, Calendar, Star, Phone, Mail, MapPin, Gift, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const Events = () => {
  const [selectedPackage, setSelectedPackage] = useState('wedding');

  const eventPackages = [
    {
      id: 'wedding',
      name: 'Beach Wedding',
      icon: <Heart className="h-8 w-8" />,
      price: 'Starting from ₹2,50,000',
      capacity: 'Up to 150 guests',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Beachfront ceremony setup',
        'Bridal suite preparation',
        'Professional photography',
        'Floral decorations',
        'Multi-course dinner',
        'Wedding cake',
        'Accommodation for couple',
        'Event coordination'
      ],
      description: 'Exchange vows with the pristine beach as your backdrop in an unforgettable oceanfront ceremony.'
    },
    {
      id: 'corporate',
      name: 'Banquet Hall Events',
      icon: <Briefcase className="h-8 w-8" />,
      price: 'Starting from ₹25,000/day',
      capacity: 'Up to 200 participants',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Elegant banquet hall',
        'Audio/visual equipment',
        'Air conditioning',
        'Catering services',
        'Stage and lighting',
        'Decoration services',
        'Parking facilities',
        'Event coordination'
      ],
      description: 'Host elegant corporate events, conferences, and celebrations in our sophisticated banquet hall.'
    },
    {
      id: 'celebration',
      name: 'Lawn Events',
      icon: <Users className="h-8 w-8" />,
      price: 'Starting from ₹35,000',
      capacity: 'Up to 300 guests',
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Spacious outdoor lawn',
        'Garden setting',
        'Flexible seating arrangements',
        'Weather backup options',
        'Catering packages',
        'Sound system',
        'Lighting arrangements',
        'Event planning'
      ],
      description: 'Celebrate under the open sky in our beautiful lawn area, perfect for large gatherings and outdoor events.'
    },
    {
      id: 'wedding-hall',
      name: 'Wedding Hall',
      icon: <Heart className="h-8 w-8" />,
      price: 'Starting from ₹1,50,000',
      capacity: 'Up to 250 guests',
      image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: [
        'Dedicated wedding hall',
        'Bridal preparation room',
        'Mandap setup included',
        'Professional photography',
        'Floral decorations',
        'Multi-cuisine catering',
        'Guest accommodation',
        'Wedding coordination'
      ],
      description: 'Our elegant wedding hall provides the perfect indoor venue for your dream wedding celebration.'
    }
  ];

  const venues = [
    {
      name: 'Beach',
      capacity: 'Up to 150 guests',
      image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Ocean views', 'Sunset ceremonies', 'Natural lighting', 'Sea breeze']
    },
    {
      name: 'Banquet Hall',
      capacity: 'Up to 200 guests',
      style: 'Elegant indoor space',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Air conditioning', 'Modern AV equipment', 'Elegant interiors', 'Stage facility']
    },
    {
      name: 'Wedding Hall',
      capacity: 'Up to 250 guests',
      style: 'Traditional wedding venue',
      image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Mandap setup', 'Bridal room', 'Traditional decor', 'Photography areas']
    },
    {
      name: 'Lawn',
      capacity: 'Up to 300 guests',
      style: 'Spacious outdoor garden',
      image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: ['Open sky setting', 'Garden ambiance', 'Flexible layout', 'Natural lighting']
    }
  ];

  const testimonials = [
    {
      name: 'Priya & Arjun',
      event: 'Wedding Hall Ceremony',
      rating: 5,
      text: 'Our wedding hall ceremony was absolutely perfect! The traditional setup and elegant decor made our special day unforgettable.',
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'TechCorp India',
      event: 'Banquet Hall Conference',
      rating: 5,
      text: 'The banquet hall provided the perfect setting for our corporate event. Professional facilities and excellent service.',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'The Sharma Family',
      event: 'Lawn Celebration',
      rating: 5,
      text: 'The lawn venue was perfect for our family celebration. Beautiful outdoor setting with excellent arrangements.',
      image: 'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-36 pb-12 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Events & Celebrations</motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Create unforgettable memories with our exceptional event planning services
            and stunning beachfront venues
          </motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Package Selection */}
      <section className="py-8 bg-resort-cream border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {eventPackages.map((pkg) => (
              <motion.button
                key={pkg.id}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`flex items-center px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-ocean'
                    : 'glass-card text-slate-700 hover:bg-white/80'
                }`}
              >
                {pkg.icon}
                <span className="ml-2">{pkg.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Package */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            {eventPackages.filter(pkg => pkg.id === selectedPackage).map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
              >
                <div>
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full mr-4">
                      {pkg.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">{pkg.name}</h2>
                  </div>

                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6">{pkg.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-slate-600">
                      <Gift className="h-5 w-5 mr-2 text-blue-600" />
                      {pkg.price}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      {pkg.capacity}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">Package Includes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-resort-gold rounded-full mr-3"></div>
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center cursor-pointer">
                      <Calendar className="h-5 w-5 mr-2" />
                      Check Availability
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center cursor-pointer">
                      <Phone className="h-5 w-5 mr-2" />
                      Speak to Planner
                    </motion.button>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="rounded-2xl shadow-resort w-full h-56 sm:h-72 lg:h-96 object-cover"
                  />
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 glass-card p-3 sm:p-4 rounded-2xl shadow-glass">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-slate-600 text-sm mt-1">5-Star Service</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Event Venues */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Stunning Event Venues</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 mt-4">
              Choose from our variety of beautiful spaces, each with its own unique charm
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {venues.map((venue, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="glass-card bg-blue-50/40 rounded-2xl overflow-hidden shadow-resort hover:shadow-glass-lg transition-shadow duration-300"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">{venue.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{venue.capacity}</p>
                  <p className="text-slate-600 text-sm mb-4">{venue.style}</p>
                  <div className="space-y-2">
                    {venue.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-resort-gold rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Event Planning Process */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Our Event Planning Process</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 mt-4">
              From concept to celebration, we handle every detail to ensure your event is perfect
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {[
              { num: 1, title: 'Initial Consultation', desc: 'Discuss your vision, requirements, and budget with our expert planners' },
              { num: 2, title: 'Custom Proposal', desc: 'Receive a detailed proposal with venue options, menu, and timeline' },
              { num: 3, title: 'Event Coordination', desc: 'Our team manages all vendors, setup, and logistics for a seamless event' },
              { num: 4, title: 'Perfect Execution', desc: 'Enjoy your special day while we ensure everything runs flawlessly' },
            ].map((step, index) => (
              <motion.div key={step.num} variants={fadeInUp} custom={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-blue-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Happy Clients</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 mt-4">
              See what our clients say about their unforgettable events at our resort
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-5 sm:p-6 lg:p-8 shadow-resort hover:shadow-glass-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-blue-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.event}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920)'
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
          <motion.h2 variants={fadeInUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Planning Your Perfect Event
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 lg:mb-8">
            Let our expert event planners bring your vision to life at our stunning beachfront resort
          </motion.p>
          <motion.div variants={fadeInUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05, y: -2 }} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center justify-center cursor-pointer">
              <Mail className="h-5 w-5 mr-2" />
              Request Proposal
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, y: -2 }} className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-200 flex items-center justify-center cursor-pointer">
              <Phone className="h-5 w-5 mr-2" />
              Call Event Planner
            </motion.button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Events;
