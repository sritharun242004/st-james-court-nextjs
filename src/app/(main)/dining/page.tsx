'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Clock, Users, Star, MapPin } from 'lucide-react';
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

const restaurants = [
  {
    id: 'sea-queen',
    name: 'Sea Queen',
    subtitle: 'Family Restaurant',
    image: '/images/dining/dining-1.jpg',
    type: 'Indoor Multi-Cuisine',
    hours: '7:00 AM - 11:00 PM',
    capacity: '100+ guests',
    description:
      'The signature family restaurant at St James Court, Sea Queen serves a wide range of multi-cuisine dishes including South Indian, North Indian, Chinese, and Continental. Perfect for family gatherings, celebrations, and everyday dining in a comfortable air-conditioned indoor setting.',
    highlights: [
      'Multi-cuisine menu',
      'Family-friendly atmosphere',
      'Air-conditioned comfort',
      'Live kitchen counters',
    ],
  },
  {
    id: 'sea-breeze',
    name: 'Sea Breeze',
    subtitle: 'Beachfront Open Air Restaurant',
    image: '/images/dining/dining-3.jpg',
    type: 'Beachfront Open Air',
    hours: '7:00 AM - 10:30 PM',
    capacity: '80+ guests',
    description:
      'Dine under the open sky with the sound of waves as your backdrop. Sea Breeze offers a unique waterfront dining experience, serving fresh seafood and coastal delicacies. Open for breakfast, lunch, and dinner with breathtaking ocean views.',
    highlights: [
      'Beachfront location',
      'Fresh seafood daily',
      'Sunrise breakfast',
      'Sunset dinner',
    ],
  },
  {
    id: 'the-ocean',
    name: 'The Ocean',
    subtitle: 'Bar & Restaurant',
    image: '/images/dining/dining-5.jpg',
    type: 'Bar & Restaurant',
    hours: '11:00 AM - 11:00 PM',
    capacity: '60+ guests',
    description:
      'A stylish bar and restaurant offering contemporary cuisine paired with handcrafted cocktails and an extensive beverage menu. The Ocean is the perfect spot for evening drinks, casual dining, and socializing.',
    highlights: [
      'Handcrafted cocktails',
      'Premium spirits',
      'Live music (weekends)',
      'Contemporary cuisine',
    ],
  },
];

const extraImages = [
  { src: '/images/dining/dining-2.jpg', alt: 'Restaurant Interior' },
  { src: '/images/dining/dining-4.jpg', alt: 'Beachside Dining Setup' },
  { src: '/images/dining/dining-6.jpg', alt: 'Bar Counter' },
];

const Dining = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-28 pb-8 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/dining/dining-hero.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">
            Dining
          </motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-2xl font-jost max-w-4xl mx-auto leading-relaxed">
            Savour exquisite flavours at our three signature restaurants, each
            offering a distinct culinary experience by the sea
          </motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Intro Section */}
      <section className="py-16 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 mb-6">
              <Utensils className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2 variants={fadeInUp} custom={1} className="text-xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
              Culinary Experiences
            </motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={2} className="text-base sm:text-lg lg:text-xl font-jost text-slate-600 leading-relaxed mt-4">
              From hearty family meals to breezy beachfront dining and vibrant
              cocktail evenings, St James Court offers a dining experience for
              every mood and occasion.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Restaurants — Alternating Layout */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4 space-y-12 sm:space-y-16 lg:space-y-24">
          {restaurants.map((restaurant, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center"
              >
                {/* Image — appears first on even rows, second on odd rows */}
                <div
                  className={`relative ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-resort group">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-44 sm:h-80 lg:h-[400px] object-cover group-transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  {/* Decorative accent */}
                  <div
                    className={`hidden sm:block absolute -z-10 w-full h-full rounded-2xl bg-blue-200/50 top-4 ${
                      isEven ? 'left-4' : '-left-4'
                    }`}
                  ></div>
                </div>

                {/* Text Content */}
                <div
                  className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold font-jost mb-4">
                    {restaurant.type}
                  </span>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-base sm:text-lg font-jost text-blue-600 font-medium mb-6">
                    {restaurant.subtitle}
                  </p>
                  <p className="text-base sm:text-lg font-jost text-slate-600 leading-relaxed mb-8">
                    {restaurant.description}
                  </p>

                  {/* Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="flex items-center text-slate-700 font-jost">
                      <Clock className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{restaurant.hours}</span>
                    </div>
                    <div className="flex items-center text-slate-700 font-jost">
                      <Users className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{restaurant.capacity}</span>
                    </div>
                    <div className="flex items-center text-slate-700 font-jost">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Resort Premises</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-2">
                    <h4 className="text-sm font-semibold text-blue-900 font-jost uppercase tracking-wider mb-3">
                      Highlights
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {restaurant.highlights.map((highlight, hIdx) => (
                        <div
                          key={hIdx}
                          className="flex items-center text-sm text-slate-600 font-jost"
                        >
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-2 flex-shrink-0" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Extra Dining Images Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">
              A Glimpse of Our Dining Spaces
            </motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl font-jost text-slate-600 max-w-3xl mx-auto mt-4">
              From elegant interiors to open-air setups by the shore, every meal
              at St James Court is a feast for the senses
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {extraImages.map((img, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="relative group overflow-hidden rounded-2xl shadow-resort"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-36 sm:h-56 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="p-4 sm:p-5 lg:p-6 text-white font-jost font-medium">
                    {img.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/dining/dining-hero.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/85 to-blue-950/90"></div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Ready to Dine with Us?
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl font-jost text-white/90 mb-4 sm:mb-6 lg:mb-8">
            Book your stay at St James Court Beach Resort and enjoy
            complimentary breakfast at Sea Queen with every reservation
          </motion.p>
          <motion.div variants={fadeInUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-semibold font-jost shadow-lg hover:shadow-ocean transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <Utensils className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-semibold font-jost hover:bg-white hover:text-blue-900 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Dining;
