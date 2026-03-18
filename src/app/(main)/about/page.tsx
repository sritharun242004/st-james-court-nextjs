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
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const amenities = [
  'Private Beach Access',
  'Swimming Pool',
  'Sea Queen Restaurant',
  'Sea Breeze Restaurant',
  'The Ocean Bar',
  'Conference Hall (House of Lords)',
  'Board Room (Royal Castle)',
  'Lawn for Events',
  '24/7 Room Service',
  'Free WiFi',
  'Air Conditioning',
  'LCD Television',
  'Intercom Facility',
  'Running Hot & Cold Water',
  'Attached Bathrooms',
  'Wardrobe',
  'Mini Fridge',
  'Tea/Coffee Maker',
  'Iron & Ironing Board',
  'Doctor on Call',
  'Laundry Service',
  'Car Parking',
  'Power Backup',
  'CCTV Surveillance',
  'Fire Safety',
  'Travel Desk',
  'Currency Exchange',
  'Luggage Storage',
  'Wheelchair Access',
  "Children's Play Area",
];

const stats = [
  { label: 'Rooms', value: '40+', icon: <BedDouble className="h-7 w-7" /> },
  { label: 'Years of Excellence', value: '25+', icon: <Award className="h-7 w-7" /> },
  { label: 'Restaurants', value: '3', icon: <UtensilsCrossed className="h-7 w-7" /> },
  { label: 'Event Venues', value: '2', icon: <PartyPopper className="h-7 w-7" /> },
];

const About = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="pt-36 pb-14 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/gallery/resort-exterior-1.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300 font-jost mb-4">
            About Our Resort
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6 leading-tight">
            Only Resort in Pondicherry<br className="hidden md:block" /> Right on the Beach
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed text-white/80 font-jost">
            A beachfront sanctuary where warm hospitality meets the timeless charm of the Bay of Bengal
          </p>
        </AnimatedSection>
      </section>

      {/* Resort Description */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold font-jost mb-6 sm:mb-8">
              <Building2 className="h-4 w-4" />
              Our Story
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-slate-900 mb-6 sm:mb-8">
              St James Court Beach Resort
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-jost mb-8">
              St James Court Beach Resort is located on Pondicherry&apos;s East Coast Road in Chinna Kalapet,
              right on the beach. It is the only resort in Pondicherry situated directly on the beachfront.
              With the Bay of Bengal as your backyard, every moment here is defined by the soothing sound
              of waves, golden sunrises, and the refreshing ocean breeze.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto rounded-full"></div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-500 font-jost text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* NTS Group History */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold font-jost mb-6">
                <Award className="h-4 w-4" />
                Our Legacy
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-slate-900 mb-6">
                The NTS Group
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-jost mb-6">
                Established in 1998, the NTS Group has over 25 years of excellence in hospitality
                and related industries. What began as a vision to deliver outstanding guest
                experiences has grown into a trusted name across multiple sectors.
              </p>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-jost mb-8">
                Sister companies include <span className="font-semibold text-slate-800">NTS Travels &amp; Tours</span> and{' '}
                <span className="font-semibold text-slate-800">NTS Constructions</span>, reflecting
                the group&apos;s diverse expertise and commitment to quality across every venture.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-jost text-slate-700">NTS Travels &amp; Tours</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2.5 rounded-xl">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-sm font-jost text-slate-700">NTS Constructions</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 sm:p-8 lg:p-10 border border-blue-100">
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
                    25+
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl font-jost text-slate-600 mb-8">Years of Excellence</p>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto mb-8 rounded-full"></div>
                  <div className="space-y-4 text-left">
                    {[
                      { year: '1998', text: 'NTS Group established' },
                      { year: '2000s', text: 'NTS Travels & Tours launched' },
                      { year: '2010s', text: 'NTS Constructions founded' },
                      { year: 'Present', text: 'St James Court Beach Resort thrives' },
                    ].map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <span className="text-sm font-bold text-blue-600 font-jost min-w-[60px]">
                          {milestone.year}
                        </span>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-600 font-jost">{milestone.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold font-jost mb-6">
              <Check className="h-4 w-4" />
              Everything You Need
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-slate-900 mb-4">
              Resort Amenities
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto font-jost">
              From private beach access to 24/7 room service, we have thought of every detail
              to make your stay truly exceptional
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white px-3 py-3 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-jost text-sm font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* TripAdvisor Section */}
      <section className="py-10 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-14 text-center border border-blue-100">
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-400 fill-current" />
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Rated Among the Top Beach Resorts in Pondicherry
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-jost max-w-2xl mx-auto mb-6">
              Our guests consistently rate us among the finest beachfront resorts in Pondicherry on TripAdvisor,
              praising our unbeatable location, warm hospitality, and exceptional dining experiences.
            </p>
            <div className="inline-flex items-center gap-2 text-blue-600 font-jost font-semibold text-sm">
              <Star className="h-4 w-4 fill-current" />
              Highly Rated on TripAdvisor
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/gallery/resort-exterior-1.jpg)' }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <AnimatedSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6">
            Experience the Beachfront Difference
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 font-jost mb-8 max-w-2xl mx-auto">
            Book your stay at St James Court Beach Resort and wake up to the sound of waves,
            golden sunrises, and the warmth of true Indian hospitality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Stay
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default About;
