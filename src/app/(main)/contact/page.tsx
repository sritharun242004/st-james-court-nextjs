'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show a success state
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-52 pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-exterior-2.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300 font-jost mb-4">
            St James Court Beach Resort
          </p>
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/80">
            We would love to hear from you. Reach out for reservations, inquiries, or just to say hello.
          </p>
        </AnimatedSection>
      </section>

      {/* Contact Form + Info Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column — Contact Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <h2 className="text-3xl font-playfair font-bold text-slate-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-600 font-jost mb-8">
                  Fill in the form below and our team will get back to you within 24 hours.
                </p>

                {submitted && (
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-teal-50 border border-teal-200 text-teal-800 rounded-xl px-5 py-4 text-sm font-medium">
                    Thank you for your message! We will get back to you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email */}
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Phone */}
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Message */}
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
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-jost text-slate-900 placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </form>
              </div>
            </AnimatedSection>

            {/* Right Column — Contact Info Cards */}
            <AnimatedSection direction="right">
              <div className="space-y-6">
                {/* Resort Address */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-playfair mb-1">Resort Address</h3>
                      <p className="text-slate-600 font-jost leading-relaxed">
                        State Highway 49, opp. Pondicherry Engg. College,<br />
                        Chinna Kalapet, Puducherry 605014
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corporate Office */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-playfair mb-1">Corporate Office</h3>
                      <p className="text-slate-600 font-jost leading-relaxed">
                        NTS Group, 211 Chetty St,<br />
                        Pondicherry - 605001
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-playfair mb-1">Phone</h3>
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
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-playfair mb-1">Email</h3>
                      <Link
                        href="mailto:info@stjamescourtbeachresort.com"
                        className="text-slate-600 font-jost hover:text-blue-600 transition-colors"
                      >
                        info@stjamescourtbeachresort.com
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-playfair mb-1">Hours</h3>
                      <p className="text-slate-600 font-jost">24/7 Reception</p>
                      <p className="text-slate-500 font-jost text-sm mt-1">
                        Our front desk is available around the clock for all your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-slate-900 mb-4">Find Us</h2>
            <p className="text-xl text-slate-600 font-jost max-w-2xl mx-auto">
              Located along the scenic East Coast Road, our resort is easily accessible
              from Puducherry city centre and Chennai.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="up" delay={0.2}>
            <iframe
              src="https://maps.google.com/maps?cid=15575676781392154147&output=embed"
              width="100%"
              height="384"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-96 rounded-xl shadow-xl"
              title="St James Court Beach Resort Location"
            ></iframe>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Contact;
