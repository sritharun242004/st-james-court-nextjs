'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, Clock, Users, Star, MapPin } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

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
      <section className="pt-52 pb-20 relative text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/dining/dining-hero.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-8">
            Dining
          </h1>
          <p className="text-2xl font-jost max-w-4xl mx-auto leading-relaxed">
            Savour exquisite flavours at our three signature restaurants, each
            offering a distinct culinary experience by the sea
          </p>
        </AnimatedSection>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 mb-6">
              <Utensils className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-playfair font-bold text-slate-900 mb-4">
              Culinary Experiences
            </h2>
            <p className="text-xl font-jost text-slate-600 leading-relaxed">
              From hearty family meals to breezy beachfront dining and vibrant
              cocktail evenings, St James Court offers a dining experience for
              every mood and occasion.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Restaurants — Alternating Layout */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {restaurants.map((restaurant, index) => {
            const isEven = index % 2 === 0;

            return (
              <AnimatedSection
                key={restaurant.id}
                direction={isEven ? 'left' : 'right'}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Image — appears first on even rows, second on odd rows */}
                <div
                  className={`relative ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  {/* Decorative accent */}
                  <div
                    className={`absolute -z-10 w-full h-full rounded-2xl bg-gradient-to-br from-blue-200 to-teal-200 top-4 ${
                      isEven ? 'left-4' : '-left-4'
                    }`}
                  ></div>
                </div>

                {/* Text Content */}
                <div
                  className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold font-jost mb-4">
                    {restaurant.type}
                  </span>
                  <h3 className="text-4xl font-playfair font-bold text-slate-900 mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-lg font-jost text-blue-600 font-medium mb-6">
                    {restaurant.subtitle}
                  </p>
                  <p className="text-lg font-jost text-slate-600 leading-relaxed mb-8">
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
                    <h4 className="text-sm font-semibold text-slate-900 font-jost uppercase tracking-wider mb-3">
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
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* Extra Dining Images Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-slate-900 mb-4">
              A Glimpse of Our Dining Spaces
            </h2>
            <p className="text-xl font-jost text-slate-600 max-w-3xl mx-auto">
              From elegant interiors to open-air setups by the shore, every meal
              at St James Court is a feast for the senses
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {extraImages.map((img, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.15}
                className="relative group overflow-hidden rounded-xl shadow-lg"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="p-6 text-white font-jost font-medium">
                    {img.alt}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/dining/dining-hero.jpg)' }}
        >
          <div className="absolute inset-0 bg-blue-900/80"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
            Ready to Dine with Us?
          </h2>
          <p className="text-xl font-jost text-white/90 mb-8">
            Book your stay at St James Court Beach Resort and enjoy
            complimentary breakfast at Sea Queen with every reservation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold font-jost hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Utensils className="mr-2 h-5 w-5" />
              Book Your Stay
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold font-jost hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Dining;
