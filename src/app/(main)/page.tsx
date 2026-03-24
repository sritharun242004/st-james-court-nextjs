'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Calendar, Waves, Utensils, Sparkles, MapPin, Phone, Mail, Send, ChevronDown, Anchor } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import WaveDivider from '@/components/ui/wave-divider';
import GoldSeparator from '@/components/ui/gold-separator';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Home = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const features = [
    {
      icon: <Waves className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Beachfront Access",
      description: "Direct access to pristine sandy beaches"
    },
    {
      icon: <Utensils className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Fine Dining",
      description: "French-Indian fusion cuisine & local delicacies"
    },
    {
      icon: <Sparkles className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Lawn",
      description: "Refreshing natural open lawn for events"
    },
    {
      icon: <Users className="h-5 w-5 sm:h-7 sm:w-7" />,
      title: "Event Spaces",
      description: "Perfect venues for weddings & celebrations"
    }
  ];

  const testimonials = [
    {
      name: "Ananya & Vikram Nair",
      location: "Kochi, Kerala",
      rating: 5,
      text: "An absolutely magical experience! The beachfront location and French colonial charm made our honeymoon unforgettable."
    },
    {
      name: "Rajesh Venkataraman",
      location: "Mumbai, India",
      rating: 5,
      text: "Perfect blend of luxury and local culture. The staff went above and beyond to make our family vacation special."
    },
    {
      name: "Deepika & Suresh Iyer",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      text: "Felt like home away from home with the beautiful French architecture and warm Indian hospitality."
    }
  ];

  const faqs = [
    { q: "What are your check-in and check-out times?", a: "Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request." },
    { q: "Do you provide airport transportation?", a: "Yes, we offer complimentary airport pickup and drop-off service from Puducherry Airport. Please inform us 24 hours in advance." },
    { q: "What dining options are available?", a: "We have 3 dining venues — Sea Queen (family restaurant), Sea Breeze (beachfront open air), and The Ocean (bar & restaurant) — plus 24/7 room service." },
    { q: "Is WiFi available throughout the resort?", a: "Yes, complimentary high-speed WiFi is available throughout the resort, including all rooms and common areas." },
    { q: "Are pets allowed at the resort?", a: "Currently, we do not allow pets at the resort, with the exception of certified service animals." },
    { q: "What activities are available for children?", a: "We offer a kids' club with supervised activities, children's pool, playground, and special children's menu at our restaurants." },
  ];

  return (
    <div className="bg-resort-cream">
      {/* Hero Video Section */}
      <section className="relative w-full h-screen overflow-hidden bg-blue-950">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src="/hero-compressed.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-bold text-white tracking-wide"
            initial={mounted ? { opacity: 0, y: 40 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
          >
            St James Court
          </motion.h1>
          <motion.div
            className="w-24 h-0.5 bg-resort-gold mx-auto my-4 sm:my-6"
            initial={mounted ? { scaleX: 0, opacity: 0 } : false}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-playfair italic text-white/90 tracking-wider"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
          >
            Where Tranquility Meets the Sea
          </motion.p>
          <motion.div
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4"
            initial={mounted ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-lg rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 inline-flex items-center justify-center"
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/rooms"
                className="border-2 border-white/70 text-white px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
              >
                View Rooms
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={mounted ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-8 w-8 text-white/70" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Waves className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">
              Experience Luxury by the Sea
            </h2>
            <p className="section-subheading">
              Discover the perfect blend of French colonial elegance and Indian warmth
              at our premier beachfront resort in Pondicherry.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="p-4 sm:p-6 lg:p-7 rounded-2xl glass-card hover:shadow-glass-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3 md:flex-col md:items-center md:gap-0">
                  <motion.div
                    className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-ocean-600 text-white rounded-2xl md:mb-4 shadow-ocean group-hover:shadow-lg transition-shadow duration-300"
                    whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-playfair font-semibold text-blue-900 md:mb-2 md:text-center">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base md:text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#f0f4fa" />

      {/* Room Booking Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-blue-50/60">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Calendar className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">
              Book Your Perfect Stay
            </h2>
            <p className="section-subheading">
              Choose your dates and find the perfect room for your beachfront getaway
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="glass-card rounded-2xl shadow-resort p-5 sm:p-7 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900 mb-6">Quick Booking</h3>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900/80 mb-2">Check-in Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 sm:p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900/80 mb-2">Check-out Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 sm:p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-900/80 mb-2">Adults</label>
                      <select className="w-full p-2.5 sm:p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200">
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>3 Adults</option>
                        <option>4+ Adults</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-900/80 mb-2">Children</label>
                      <select className="w-full p-2.5 sm:p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200">
                        <option>0 Children</option>
                        <option>1 Child</option>
                        <option>2 Children</option>
                        <option>3+ Children</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-900/80 mb-2">Room Type</label>
                    <select className="w-full p-2.5 sm:p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200">
                      <option>Any Room Type</option>
                      <option>Deluxe Room</option>
                      <option>Super Deluxe</option>
                      <option>Executive Suite Room</option>
                    </select>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/booking"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-xl font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 inline-flex items-center justify-center"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Check Availability
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                { icon: <Star className="h-5 w-5 text-resort-gold" />, bg: "bg-sand-50", title: "Best Rate Guarantee", desc: "Book directly with us for the best rates and exclusive perks" },
                { icon: <Users className="h-5 w-5 text-blue-600" />, bg: "bg-blue-50", title: "Free Cancellation", desc: "Cancel up to 48 hours before arrival with no penalty" },
                { icon: <Sparkles className="h-5 w-5 text-ocean-500" />, bg: "bg-ocean-50", title: "Exclusive Amenities", desc: "Complimentary breakfast, WiFi, and airport transfers included" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  custom={i}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  className="glass-card rounded-xl p-4 sm:p-6 cursor-pointer group"
                >
                  <div className="flex items-center mb-3">
                    <div className={`${card.bg} p-2.5 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300`}>
                      {card.icon}
                    </div>
                    <h4 className="font-semibold text-blue-900">{card.title}</h4>
                  </div>
                  <p className="text-slate-600 text-sm pl-12">{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#FFFBF5" />

      {/* Resort Gallery */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <motion.div
              className="flex justify-center mb-6"
              variants={scaleIn}
            >
              <div className="rounded-2xl shadow-glass p-1 bg-white/80">
                <img
                  src="/logo.jpeg"
                  alt="St James Court Beach Resort Logo"
                  className="h-24 w-24 rounded-xl object-contain"
                />
              </div>
            </motion.div>
            <h2 className="section-heading">Resort Gallery</h2>
            <p className="section-subheading">
              Discover the beauty and elegance of St James Court Beach Resort through our curated collection
            </p>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div
            className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-3 md:gap-4 md:h-[700px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {/* Main large image */}
            <motion.div
              variants={scaleIn}
              className="col-span-2 h-44 sm:h-56 md:h-auto md:row-span-2 relative group overflow-hidden rounded-2xl shadow-resort"
            >
              <img
                src="/images/gallery/gallery-1.jpg"
                alt="St James Court Beach Resort Grounds"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent">
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="text-2xl sm:text-3xl font-playfair font-bold mb-2">Beachfront Paradise</h3>
                  <p className="text-sm sm:text-base opacity-90">Where pristine beaches meet luxury hospitality</p>
                </div>
              </div>
            </motion.div>

            {[
              { src: "/images/newrooms/super-deluxe/room1.jpg", alt: "Sea View Balcony Room", title: "Sea View Rooms", desc: "Luxury accommodations" },
              { src: "/images/dining/dining-4.jpg", alt: "Beachside Dining", title: "Sea Queen Restaurant", desc: "Multi-cuisine dining" },
              { src: "/images/gallery/gallery-20.jpg", alt: "Resort Swimming Pool", title: "Swimming Pool", desc: "Refreshing retreat" },
              { src: "/images/gallery/gallery-26.jpeg", alt: "Guests at the Pool", title: "Pool & Recreation", desc: "Fun in the sun" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i + 1}
                className="col-span-1 h-32 sm:h-40 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-glass cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs opacity-90">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Beach Celebrations */}
            <motion.div
              variants={fadeInUp}
              custom={5}
              className="col-span-1 h-36 sm:h-44 md:col-span-2 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-glass cursor-pointer"
            >
              <img
                src="/images/events/beach-engagement-2.jpeg"
                alt="Beach Celebrations"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Beach Celebrations</h4>
                  <p className="text-xs opacity-90">Dream events by the sea</p>
                </div>
              </div>
            </motion.div>

            {/* Resort Exterior */}
            <motion.div
              variants={fadeInUp}
              custom={6}
              className="col-span-1 h-36 sm:h-44 md:col-span-2 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-glass cursor-pointer"
            >
              <img
                src="/images/gallery/resort-exterior-1.jpg"
                alt="Resort Exterior"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Resort Grounds</h4>
                  <p className="text-xs opacity-90">Scenic beachfront property</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#f8f6f3" />

      {/* About Preview */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center mb-6">
                <div className="rounded-xl shadow-glass mr-4 p-0.5 bg-white/80">
                  <img
                    src="/logo.jpeg"
                    alt="St James Court Beach Resort Logo"
                    className="h-14 w-14 rounded-xl object-contain"
                  />
                </div>
                <div className="h-px bg-gradient-to-r from-resort-gold to-transparent flex-1" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-6">
                A Heritage of Hospitality
              </h2>
              <p className="text-sm sm:text-lg text-slate-600 mb-5 leading-relaxed">
                Situated on Pondicherry&apos;s East Coast Road in Chinna Kalapet, St James Court Beach Resort
                is the only resort in Pondicherry right on the beach. A unit of the NTS Group — established
                in 1998 with over 25 years of excellence in hospitality — we offer world-class amenities
                and warm Indian hospitality.
              </p>
              <p className="text-sm sm:text-lg text-slate-600 mb-8 leading-relaxed">
                From our pristine beachfront overlooking the Bay of Bengal to our 40 elegantly
                designed rooms and suites, 3 restaurants, and 2 event venues, every detail has
                been crafted to ensure an unforgettable stay.
              </p>
              <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.3 }}>
                <Link
                  href="/about"
                  className="inline-flex items-center text-resort-gold font-semibold hover:text-sand-700 transition-colors group"
                >
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-resort-lg">
                <img
                  src="https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Resort Architecture"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-4 -left-4 glass-card p-4 sm:p-6 rounded-xl shadow-resort"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-gradient-ocean">25+</div>
                <div className="text-slate-600 text-sm sm:text-base">Years of Excellence</div>
              </motion.div>
              <motion.div
                className="absolute -top-3 -right-3 glass-card p-3 sm:p-4 rounded-xl shadow-glass"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                animate={{ y: [0, -5, 0] }}
              >
                <div className="text-xl sm:text-2xl font-bold text-resort-gold">40+</div>
                <div className="text-slate-600 text-xs sm:text-sm">Luxury Rooms</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#FFFBF5" />

      {/* Testimonials */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Star className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">What Our Guests Say</h2>
            <p className="section-subheading">
              Discover why travelers from around the world choose St James Court
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="glass-card p-5 sm:p-6 lg:p-7 rounded-2xl cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-resort-gold/0 via-resort-gold to-resort-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center mb-4 gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-resort-gold fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-5 italic text-sm sm:text-base leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-ocean-500 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900 text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-slate-500 text-xs sm:text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a
              href="https://www.google.com/maps/place/St.+James+Court+Beach+Resort+in+Pondicherry/@12.014554,79.86009,16z/data=!4m11!3m10!1s0x3a53644f0648516b:0xd827eb825b2dce23!5m2!4m1!1i2!8m2!3d12.0145542!4d79.8600897!9m1!1b1!16s%2Fg%2F1tf5zqh9?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-resort-gold font-semibold hover:text-sand-700 transition-colors group"
              whileHover={{ x: 4 }}
            >
              Read More Reviews
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#f0f4fa" />

      {/* FAQ Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator className="mb-4" />
            <h2 className="section-heading">Frequently Asked Questions</h2>
            <p className="section-subheading">
              Get answers to common questions about your stay at St James Court Beach Resort
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  className="glass-card rounded-xl overflow-hidden group"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-blue-900 group-hover:text-blue-600 transition-colors duration-300 pr-2">
                      {faq.q}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <ChevronDown className="h-4 w-4 text-resort-gold" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                          <div className="pt-3 border-t border-sand-200/50">
                            <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/faq"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-300"
                >
                  View All FAQs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/85 to-blue-950/90" />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <GoldSeparator className="mb-6" />
          <h2 className="text-xl sm:text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
            Ready for Your Perfect Getaway?
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Book your stay at St James Court Beach Resort and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-resort-gold to-sand-600 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold shadow-gold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <a
                href="#contact"
                className="border-2 border-white/40 text-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 inline-flex items-center justify-center"
              >
                Get in Touch
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#FFFBF5" />

      {/* Featured Rooms Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Sparkles className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">Luxurious Accommodations</h2>
            <p className="section-subheading">
              Choose from our collection of elegantly appointed rooms and suites,
              each designed to provide comfort and stunning views
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {[
              { src: "/images/newrooms/deluxe/room1.JPG", title: "Deluxe Room", desc: "Twin beds with Fenesta French window and modern amenities", price: "₹4,500", link: "/rooms/deluxe-room" },
              { src: "/images/newrooms/super-deluxe/room1.jpg", title: "Super Deluxe", desc: "King size bed with cushion chair and premium amenities", price: "₹5,500", link: "/rooms/super-deluxe" },
              { src: "/images/newrooms/suite/room1.JPG", title: "Executive Suite Room", desc: "Premium suite with private balcony and luxurious amenities", price: "₹6,500", link: "/rooms/executive-suite" },
            ].map((room, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                custom={i}
                whileHover={{ y: -8, transition: { duration: 0.4 } }}
                className="group relative overflow-hidden rounded-2xl shadow-glass hover:shadow-resort-lg transition-all duration-500 cursor-pointer bg-white"
              >
                <div className="overflow-hidden">
                  <img
                    src={room.src}
                    alt={room.title}
                    className="w-full h-44 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-xl font-playfair font-bold text-blue-900 mb-2">{room.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{room.desc}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-gradient-ocean">{room.price}</span>
                      <span className="text-slate-500 text-sm">/night</span>
                    </div>
                    <Link
                      href={room.link}
                      className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                <div className="absolute top-3 right-3 glass-card px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-resort-gold">Premium</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/rooms"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-300"
              >
                View All Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#f8f6f3" />

      {/* Dining Experience Section */}
      <section className="py-14 sm:py-18 lg:py-24 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <GoldSeparator icon={<Utensils className="h-4 w-4" />} className="mb-4 justify-start" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-6">
                Culinary Excellence
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                Savour an array of multi-cuisine delicacies across our three distinctive restaurants.
                From fresh seafood caught daily to traditional South Indian favourites, every meal
                is a celebration of flavours.
              </p>
              <motion.div
                className="space-y-3 mb-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  "Sea Queen — Family Restaurant (Multi-Cuisine)",
                  "Sea Breeze — Beachfront Open Air Dining",
                  "The Ocean — Bar & Restaurant",
                  "24/7 Room Service — Dining at Your Convenience"
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeInUp} custom={i} className="flex items-center group cursor-pointer">
                    <div className="w-2 h-2 bg-resort-gold rounded-full mr-3 group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-slate-700 group-hover:text-blue-600 transition-colors duration-300">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-resort-lg">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fine Dining Experience"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-2xl bg-gradient-to-br from-resort-gold/20 to-transparent -z-10" />
              <div className="absolute -top-3 -left-3 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fill="#FFFBF5" />

      {/* Contact Section */}
      <section id="contact" className="py-14 sm:py-18 lg:py-24 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12 sm:mb-14 lg:mb-18"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeInUp}
            custom={0}
          >
            <GoldSeparator icon={<Mail className="h-4 w-4" />} className="mb-4" />
            <h2 className="section-heading">Get in Touch</h2>
            <p className="section-subheading">
              Ready to plan your perfect beachfront getaway? Contact us today and let us help you create unforgettable memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="glass-card rounded-2xl shadow-resort p-5 sm:p-7 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200 ${
                        validationErrors.name ? 'border-coral-400' : 'border-sand-200'
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200 ${
                        validationErrors.email ? 'border-coral-400' : 'border-sand-200'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 sm:p-4 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200"
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200 ${
                        validationErrors.subject ? 'border-coral-400' : 'border-sand-200'
                      }`}
                    />
                  </div>

                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/80 transition-all duration-200 resize-none ${
                      validationErrors.message ? 'border-coral-400' : 'border-sand-200'
                    }`}
                  ></textarea>

                  {Object.keys(validationErrors).length > 0 && (
                    <div className="text-coral-500 text-sm">
                      Please correct the errors above.
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-xl font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 flex items-center justify-center cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {[
                {
                  icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Call Us",
                  lines: ["+91 94432 52776", "+91 94432 52777 (Reservations)"],
                  action: { href: "tel:+919443252776", icon: <Phone className="h-4 w-4 mr-2" />, text: "Call Now" }
                },
                {
                  icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Email Us",
                  lines: ["Reservation@stjamescourtbeachresort.com"],
                  action: { href: "mailto:Reservation@stjamescourtbeachresort.com", icon: <Mail className="h-4 w-4 mr-2" />, text: "Send Email" }
                },
                {
                  icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />,
                  title: "Visit Us",
                  lines: ["State Highway 49, opp. Pondicherry Engg. College,", "Chinna Kalapet, Puducherry 605014, India"],
                  action: { href: "https://maps.app.goo.gl/nBSzW6Xhiu3XetNK6", icon: <MapPin className="h-4 w-4 mr-2" />, text: "Get Directions", external: true }
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  custom={i}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  className="glass-card rounded-xl px-5 py-4 sm:px-7 sm:py-5 cursor-pointer group"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-blue-600 to-ocean-600 text-white p-2.5 sm:p-3 rounded-xl mr-4 shadow-ocean group-hover:shadow-lg transition-shadow duration-300">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-blue-900">{card.title}</h3>
                      {card.lines.map((line, j) => (
                        <p key={j} className="text-slate-600 text-sm sm:text-base">{line}</p>
                      ))}
                    </div>
                  </div>
                  <a
                    href={card.action.href}
                    target={card.action.external ? '_blank' : undefined}
                    rel={card.action.external ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center text-resort-gold font-semibold hover:text-sand-700 transition-colors text-sm sm:text-base ml-14"
                  >
                    {card.action.icon}
                    {card.action.text}
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
