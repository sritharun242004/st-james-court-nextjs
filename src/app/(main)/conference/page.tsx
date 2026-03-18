'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Presentation, Calendar, Phone, CheckCircle } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

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
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="pt-36 pb-14 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/conference/conference-hall-1.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300 font-jost mb-4">
            St James Court Beach Resort
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6">
            Conference & Event Venues
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/80 font-jost">
            Host your next corporate event, seminar, or celebration in our world-class venues
            with stunning ocean views and impeccable hospitality
          </p>
        </AnimatedSection>
      </section>

      {/* Venue Cards - Alternating Layout */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">Our Venues</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-3xl mx-auto">
              Two distinct spaces designed to meet every event requirement, from grand conferences to private board meetings
            </p>
          </AnimatedSection>

          <div className="space-y-12 sm:space-y-16 lg:space-y-20">
            {venues.map((venue, index) => (
              <AnimatedSection
                key={venue.name}
                delay={index * 0.15}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? 'lg:direction-rtl' : ''
                }`}
              >
                {/* Image - alternates left/right */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      width={800}
                      height={500}
                      className="w-full h-56 sm:h-72 lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  {/* Capacity badge */}
                  <div className="absolute -bottom-4 left-6 bg-white px-5 py-3 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-slate-800 font-semibold font-jost">{venue.capacity}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-medium font-jost mb-4">
                    {venue.subtitle}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
                    {venue.name}
                  </h3>
                  <p className="text-base sm:text-lg text-slate-600 font-jost leading-relaxed mb-8">
                    {venue.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-slate-900 font-jost mb-4">Features & Facilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {venue.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                          <span className="text-slate-700 font-jost">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-7 py-3.5 rounded-full font-semibold font-jost hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Enquire Now
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Events We Host
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-3xl mx-auto">
              From corporate conferences to milestone celebrations, our venues and expert team
              are ready to make your event a success
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.title}
                delay={index * 0.1}
                className="bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-600 group-hover:to-teal-500 transition-all duration-300">
                  <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 font-jost mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 font-jost leading-relaxed">
                  {service.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Venue Gallery
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-jost max-w-2xl mx-auto">
              A glimpse into our conference and event spaces
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((image, index) => (
              <AnimatedSection
                key={image.src}
                delay={index * 0.15}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
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
              </AnimatedSection>
            ))}
          </div>
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
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <AnimatedSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Plan Your Event
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 font-jost mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto">
            Let our dedicated team help you plan and execute a flawless event.
            Get in touch today to discuss your requirements and book your preferred venue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold font-jost hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
            <Link
              href="/gallery"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold font-jost hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Presentation className="mr-2 h-5 w-5" />
              View Gallery
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Conference;
