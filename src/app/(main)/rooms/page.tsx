'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Star, Calendar, Clock, MapPin, Phone, Utensils, Wine, Waves, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

// Static data that DB doesn't store (images, descriptions, features)
const roomStaticData: Record<string, {
  id: string;
  category: string;
  size: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
}> = {
  DELUXE: {
    id: 'deluxe-room',
    category: 'deluxe',
    size: 'Standard',
    image: '/images/rooms/deluxe/deluxe-room-1.jpg',
    gallery: [
      '/images/rooms/deluxe/deluxe-room-1.jpg',
      '/images/rooms/deluxe/deluxe-room-2.jpg',
      '/images/rooms/deluxe/deluxe-room-3.jpg',
    ],
    description: 'Comfortable room with twin beds and Fenesta French window, perfect for a relaxing stay.',
    features: ['Twin Beds', 'Fenesta French Window', 'Air Conditioning', '24hrs Hot & Cold Water'],
  },
  SUPER_DELUXE: {
    id: 'super-deluxe',
    category: 'deluxe',
    size: 'Spacious',
    image: '/images/rooms/super-deluxe/super-deluxe-room-1.jpg',
    gallery: [
      '/images/rooms/super-deluxe/super-deluxe-room-1.jpg',
      '/images/rooms/super-deluxe/super-deluxe-room-2.jpg',
      '/images/rooms/super-deluxe/super-deluxe-room-3.jpg',
      '/images/rooms/super-deluxe/super-deluxe-balcony-sea-view.jpg',
    ],
    description: 'Upgraded room with king size bed and elegant furnishings for enhanced comfort.',
    features: ['King Size Bed', 'Cushion Chair', 'Curtains with Scallops', 'Double Glazing UPVC Window'],
  },
  SUITE: {
    id: 'executive-suite',
    category: 'suite',
    size: 'Luxury Suite',
    image: '/images/rooms/suite/suite-room-1.jpg',
    gallery: [
      '/images/rooms/suite/suite-room-1.jpg',
      '/images/rooms/suite/suite-room-2.jpg',
      '/images/rooms/suite/suite-room-3.jpg',
    ],
    description: 'Premium suite with king size bed, luxurious cushion sofa and private balcony for the ultimate experience.',
    features: ['King Size Bed', 'Luxurious Cushion Sofa', 'Private Balcony', 'Shower and Bath Tub'],
  },
};

const Rooms = () => {
  const [roomFilter, setRoomFilter] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState('sea-queen');
  const [amenityCategory, setAmenityCategory] = useState('beach');
  const [dbRooms, setDbRooms] = useState<Array<{ code: string; name: string; capacity: number; today_price: number | null }>>([]);

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(json => { if (json.data) setDbRooms(json.data); })
      .catch(() => {});
  }, []);

  // Per-card carousel state
  const [cardSlides, setCardSlides] = useState<Record<string, number>>({});
  const setCardSlide = useCallback((roomId: string, idx: number) => {
    setCardSlides(prev => ({ ...prev, [roomId]: idx }));
  }, []);

  // Merge DB data with static data
  const rooms = dbRooms.length > 0
    ? dbRooms.map(db => {
        const staticInfo = roomStaticData[db.code] || roomStaticData.DELUXE;
        return {
          id: staticInfo.id,
          name: db.name,
          category: staticInfo.category,
          price: db.today_price ? Number(db.today_price) : 0,
          size: staticInfo.size,
          occupancy: db.capacity || 2,
          image: staticInfo.image,
          gallery: staticInfo.gallery,
          description: staticInfo.description,
          features: staticInfo.features,
        };
      })
    : Object.entries(roomStaticData).map(([code, s]) => ({
        id: s.id,
        name: code === 'DELUXE' ? 'Deluxe Room' : code === 'SUPER_DELUXE' ? 'Super Deluxe' : 'Executive Suite Room',
        category: s.category,
        price: code === 'DELUXE' ? 4500 : code === 'SUPER_DELUXE' ? 5500 : 6500,
        size: s.size,
        occupancy: 2,
        image: s.image,
        gallery: s.gallery,
        description: s.description,
        features: s.features,
      }));

  // Restaurant data
  const restaurants = [
    {
      id: 'sea-queen',
      name: 'Sea Queen',
      type: 'Family Restaurant',
      cuisine: 'Multi-Cuisine',
      hours: '7:00 AM - 11:00 PM',
      image: '/images/dining/dining-1.jpg',
      description: 'Our signature family restaurant serving a wide range of multi-cuisine dishes in a comfortable indoor setting, perfect for family gatherings and celebrations.',
      specialties: ['South Indian Thali', 'North Indian Curries', 'Chinese Specials', 'Continental Dishes'],
      priceRange: '₹₹₹',
      rating: 4.8
    },
    {
      id: 'sea-breeze',
      name: 'Sea Breeze',
      type: 'Beachfront Open Air',
      cuisine: 'Coastal & Seafood',
      hours: '7:00 AM - 10:30 PM',
      image: '/images/dining/dining-3.jpg',
      description: 'Dine under the open sky with the sound of waves as your backdrop. Fresh seafood and coastal delicacies served right on the waterfront.',
      specialties: ['Fresh Grilled Seafood', 'Prawns Masala', 'Beach BBQ Platter', 'Coastal Fish Fry'],
      priceRange: '₹₹₹',
      rating: 4.6
    },
    {
      id: 'the-ocean',
      name: 'The Ocean',
      type: 'Bar & Restaurant',
      cuisine: 'Contemporary & Cocktails',
      hours: '11:00 AM - 11:00 PM',
      image: '/images/dining/dining-5.jpg',
      description: 'A stylish bar and restaurant offering contemporary cuisine paired with handcrafted cocktails and an extensive beverage menu.',
      specialties: ['Signature Cocktails', 'Grilled Platters', 'Finger Foods', 'Premium Spirits'],
      priceRange: '₹₹₹',
      rating: 4.7
    }
  ];

  // Amenities data
  const amenityCategories = [
    {
      id: 'beach',
      title: "Beach & Water Activities",
      icon: <Waves className="h-8 w-8" />,
      items: [
        { name: "Private Beach Access", description: "Exclusive beachfront with pristine sandy shores" },
        { name: "Water Sports Center", description: "Kayaking, jet skiing, and parasailing" },
        { name: "Swimming Pools", description: "Multiple pools including infinity and kids' pools" },
        { name: "Beach Volleyball", description: "Professional court with equipment provided" },
        { name: "Fishing Trips", description: "Organized deep-sea and coastal fishing excursions" },
        { name: "Sunset Cruises", description: "Romantic boat trips along the coast" }
      ]
    },
    {
      id: 'wellness',
      title: "Wellness & Recreation",
      icon: <Heart className="h-8 w-8" />,
      items: [
        { name: "Ayurvedic Spa", description: "Traditional treatments with ocean views" },
        { name: "Yoga Pavilion", description: "Daily sunrise and sunset yoga sessions" },
        { name: "Fitness Center", description: "State-of-the-art gym with personal trainers" },
        { name: "Meditation Garden", description: "Peaceful space for mindfulness practices" },
        { name: "Tennis Court", description: "Professional court with equipment rental" },
        { name: "Cycling Tours", description: "Guided bike tours through French Quarter" }
      ]
    },
    {
      id: 'dining',
      title: "Dining & Entertainment",
      icon: <Utensils className="h-8 w-8" />,
      items: [
        { name: "Sea Queen", description: "Family restaurant with multi-cuisine indoor dining" },
        { name: "Sea Breeze", description: "Beachfront open-air dining with ocean views" },
        { name: "The Ocean", description: "Bar & restaurant with cocktails and contemporary cuisine" },
        { name: "Coffee Shop", description: "Artisanal coffee and fresh pastries" },
        { name: "Room Service", description: "24-hour gourmet dining in your room" },
        { name: "Cultural Shows", description: "Traditional Indian dance and music performances" }
      ]
    }
  ];

  const roomCategories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'deluxe', name: 'Deluxe' },
    { id: 'suite', name: 'Suites' }
  ];

  const filteredRooms = roomFilter === 'all' ? rooms : rooms.filter(room => room.category === roomFilter);

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-36 pb-12 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Rooms, Dining & Amenities</h1>
          <p className="text-base sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Discover our luxurious accommodations, world-class dining experiences,
            and comprehensive amenities designed for your perfect getaway
          </p>
        </AnimatedSection>
      </section>

      {/* ROOMS SECTION */}
      <section id="rooms" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Luxurious Accommodations</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our collection of elegantly appointed rooms and suites,
              each designed to provide comfort and stunning views
            </p>
          </AnimatedSection>


          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredRooms.map((room, index) => {
              const currentSlide = cardSlides[room.id] || 0;
              const gallery = room.gallery;
              return (
                <AnimatedSection
                  key={room.id}
                  delay={index * 0.1}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
                >
                  {/* Image Carousel */}
                  <div className="relative h-72 overflow-hidden">
                    {gallery.map((img, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: currentSlide === i ? 1 : 0 }}
                      >
                        <Image
                          src={img}
                          alt={`${room.name} - Photo ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index === 0 && i === 0}
                        />
                      </div>
                    ))}

                    {/* Carousel Controls */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.preventDefault(); setCardSlide(room.id, (currentSlide - 1 + gallery.length) % gallery.length); }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); setCardSlide(room.id, (currentSlide + 1) % gallery.length); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {gallery.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => { e.preventDefault(); setCardSlide(room.id, i); }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === i ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
                      <span className="text-blue-600 font-semibold">₹{room.price.toLocaleString()}/night</span>
                    </div>

                    {/* Image Count Badge */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs z-10">
                      {currentSlide + 1}/{gallery.length}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 lg:p-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2">{room.name}</h3>
                    <p className="text-slate-600 mb-4">{room.description}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Starting from:</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-blue-600">₹{room.price.toLocaleString()}</span>
                          <span className="text-sm text-slate-500">/night +GST</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {room.occupancy} guests
                        </span>
                        <span>{room.size}</span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {room.features.slice(0, 4).map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center text-sm text-slate-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        href={`/rooms/${room.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2.5 sm:py-3 rounded-lg text-center font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* DINING SECTION */}
      <section id="dining" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Culinary Excellence</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Savor the unique fusion of French culinary artistry and Indian flavors,
              from elegant fine dining to casual beachfront meals
            </p>
          </AnimatedSection>

          {/* Restaurant Selection */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 sm:mb-10 lg:mb-12">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => setSelectedRestaurant(restaurant.id)}
                className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 ${
                  selectedRestaurant === restaurant.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {restaurant.name}
              </button>
            ))}
          </div>

          {/* Featured Restaurant */}
          {restaurants.filter(r => r.id === selectedRestaurant).map((restaurant) => (
            <AnimatedSection key={restaurant.id} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-12 lg:mb-16">
              <div>
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {restaurant.type}
                  </span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(restaurant.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-slate-600">{restaurant.rating}</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{restaurant.name}</h3>
                <p className="text-base sm:text-lg text-slate-600 mb-6">{restaurant.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-slate-600">
                    <Utensils className="h-5 w-5 mr-2 text-blue-600" />
                    {restaurant.cuisine}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    {restaurant.hours}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Wine className="h-5 w-5 mr-2 text-blue-600" />
                    {restaurant.priceRange}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Reservations Available
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Signature Specialties</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {restaurant.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-slate-700">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="rounded-lg shadow-xl w-full h-56 sm:h-72 lg:h-96 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{restaurant.rating}</div>
                  <div className="text-slate-600 text-sm">Guest Rating</div>
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* All Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {restaurants.map((restaurant, index) => (
              <AnimatedSection
                key={restaurant.id}
                delay={index * 0.1}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {restaurant.type}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-slate-600">{restaurant.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{restaurant.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {restaurant.hours}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section id="amenities" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">World-Class Amenities</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need for the perfect beach vacation, from luxury spa treatments
              to thrilling water sports and cultural experiences
            </p>
          </AnimatedSection>

          {/* Amenity Category Selection */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 sm:mb-10 lg:mb-12">
            {amenityCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setAmenityCategory(category.id)}
                className={`flex items-center px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 ${
                  amenityCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </button>
            ))}
          </div>

          {/* Detailed Amenities */}
          {amenityCategories.filter(cat => cat.id === amenityCategory).map((category) => (
            <AnimatedSection key={category.id} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg mb-10 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 rounded-full mr-4">
                  {category.icon}
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.name}</h4>
                    <p className="text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          ))}

          {/* Featured Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
            <AnimatedSection className="relative group overflow-hidden rounded-xl">
              <img
                src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Spa Treatment"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Ayurvedic Spa</h3>
                  <p>Rejuvenating treatments with ocean views</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="relative group overflow-hidden rounded-xl">
              <img
                src="https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Water Sports"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Water Sports</h3>
                  <p>Thrilling adventures on pristine waters</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4} className="relative group overflow-hidden rounded-xl">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fine Dining"
                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">Fine Dining</h3>
                  <p>French-Indian fusion culinary excellence</p>
                </div>
              </div>
            </AnimatedSection>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(/images/gallery/resort-beach-view.jpg)'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <AnimatedSection className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8">
            Book your stay at St James Court Beach Resort and indulge in our world-class
            accommodations, dining, and amenities
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
              Contact Us
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Rooms;
