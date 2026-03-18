'use client';

import React, { useState } from 'react';
import { Heart, Users, Briefcase, Calendar, Star, Phone, Mail, MapPin, Gift, Camera } from 'lucide-react';

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
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Events & Celebrations</h1>
          <p className="text-base sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Create unforgettable memories with our exceptional event planning services
            and stunning beachfront venues
          </p>
        </div>
      </section>

      {/* Package Selection */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {eventPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`flex items-center px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {pkg.icon}
                <span className="ml-2">{pkg.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Package */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {eventPackages.filter(pkg => pkg.id === selectedPackage).map((pkg) => (
            <div key={pkg.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-3 rounded-full mr-4">
                    {pkg.icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">{pkg.name}</h2>
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
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Package Includes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Check Availability
                  </button>
                  <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Speak to Planner
                  </button>
                </div>
              </div>

              <div className="relative">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="rounded-lg shadow-xl w-full h-56 sm:h-72 lg:h-96 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-slate-600 text-sm mt-1">5-Star Service</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Venues */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Stunning Event Venues</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Choose from our variety of beautiful spaces, each with its own unique charm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {venues.map((venue, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{venue.name}</h3>
                  <p className="text-blue-600 font-medium mb-1">{venue.capacity}</p>
                  <p className="text-slate-600 text-sm mb-4">{venue.style}</p>
                  <div className="space-y-2">
                    {venue.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Planning Process */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Event Planning Process</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              From concept to celebration, we handle every detail to ensure your event is perfect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                1
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-3">Initial Consultation</h3>
              <p className="text-slate-600">
                Discuss your vision, requirements, and budget with our expert planners
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                2
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-3">Custom Proposal</h3>
              <p className="text-slate-600">
                Receive a detailed proposal with venue options, menu, and timeline
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                3
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-3">Event Coordination</h3>
              <p className="text-slate-600">
                Our team manages all vendors, setup, and logistics for a seamless event
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg sm:text-xl lg:text-2xl font-bold">
                4
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-3">Perfect Execution</h3>
              <p className="text-slate-600">
                Enjoy your special day while we ensure everything runs flawlessly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Happy Clients</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              See what our clients say about their unforgettable events at our resort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-5 sm:p-6 lg:p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600 text-sm">{testimonial.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start Planning Your Perfect Event
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 lg:mb-8">
            Let our expert event planners bring your vision to life at our stunning beachfront resort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              Request Proposal
            </button>
            <button className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white hover:text-slate-900 transition-all duration-200 flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              Call Event Planner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;