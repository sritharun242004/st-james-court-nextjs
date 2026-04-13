'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to send message');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-28 pb-8 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-exterior-2.jpg)' }}
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
          <motion.h1 variants={fadeInUp} custom={1} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6">Contact Us</motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed text-white/80">
            We would love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Form + Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column — Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="glass-card rounded-2xl shadow-resort p-4 sm:p-6 md:p-8 lg:p-10">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-playfair font-bold text-blue-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-600 font-jost text-sm sm:text-base mb-6 sm:mb-8">
                  Fill in the form below and our team will get back to you within 24 hours.
                </p>

                {submitted && (
                  <div className="mb-6 bg-blue-50/50 border border-blue-200 text-blue-800 rounded-xl px-5 py-4 text-sm font-medium">
                    ✓ Thank you! Your message has been sent. We&apos;ll get back to you within 24 hours.
                  </div>
                )}

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400 bg-white/80"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400 bg-white/80"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400 bg-white/80"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400 resize-none bg-white/80"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="h-5 w-5" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Right Column — Contact Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="space-y-3 sm:space-y-6">
                {[
                  {
                    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
                    title: 'Resort Address',
                    content: (
                      <p className="text-slate-600 font-jost leading-relaxed">
                        State Highway 49, opp. Pondicherry Engg. College,<br />
                        Chinna Kalapet, Puducherry 605014
                      </p>
                    ),
                  },
                  {
                    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
                    title: 'Corporate Office',
                    content: (
                      <p className="text-slate-600 font-jost leading-relaxed">
                        NTS Group, 211 Chetty St,<br />
                        Pondicherry - 605001
                      </p>
                    ),
                  },
                  {
                    icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
                    title: 'Phone',
                    content: (
                      <div className="space-y-1 text-slate-600 font-jost">
                        <p>0413 2655 174</p>
                        <p>0413 2655275 / 76</p>
                        <p className="pt-1">
                          <span className="text-slate-500 text-sm">Mobile:</span>{' '}
                          <Link href="tel:+919655669023" className="hover:text-blue-600 transition-colors">
                            +91 96556 69023
                          </Link>
                        </p>
                        <p>
                          <span className="text-slate-500 text-sm">Mobile:</span>{' '}
                          <Link href="tel:+919443252776" className="hover:text-blue-600 transition-colors">
                            +91 94432 52776
                          </Link>
                        </p>
                      </div>
                    ),
                  },
                  {
                    icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
                    title: 'Email',
                    content: (
                      <Link
                        href="mailto:info@stjamescourtbeachresort.com"
                        className="text-slate-600 font-jost hover:text-blue-600 transition-colors"
                      >
                        info@stjamescourtbeachresort.com
                      </Link>
                    ),
                  },
                  {
                    icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />,
                    title: 'Hours',
                    content: (
                      <>
                        <p className="text-slate-600 font-jost">24/7 Reception</p>
                        <p className="text-slate-500 font-jost text-sm mt-1">
                          Our front desk is available around the clock for all your needs.
                        </p>
                      </>
                    ),
                  },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass-card rounded-2xl shadow-resort p-3 sm:p-5 lg:p-6 hover:shadow-glass-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-blue-900 font-playfair mb-1">{card.title}</h3>
                        {card.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Google Map Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-10 lg:mb-12"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-playfair font-bold text-blue-900 mb-4">Find Us</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-slate-600 font-jost max-w-2xl mx-auto mt-4">
              Located along the scenic East Coast Road, our resort is easily accessible
              from Puducherry city centre and Chennai.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <iframe
              src="https://maps.google.com/maps?cid=15575676781392154147&output=embed"
              width="100%"
              height="384"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl shadow-resort"
              title="St James Court Beach Resort Location"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
