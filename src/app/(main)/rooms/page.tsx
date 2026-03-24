'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Star, Calendar, Clock, MapPin, Phone, Utensils, Wine, Waves, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    image: '/images/newrooms/deluxe/room1.JPG',
    gallery: [
      '/images/newrooms/deluxe/room1.JPG',
      '/images/newrooms/deluxe/room2.JPG',
      '/images/newrooms/deluxe/unnamed.jpg',
    ],
    description: 'Comfortable room with twin beds and Fenesta French window, perfect for a relaxing stay.',
    features: ['Twin Beds', 'Fenesta French Window', 'Air Conditioning', '24hrs Hot & Cold Water'],
  },
  SUPER_DELUXE: {
    id: 'super-deluxe',
    category: 'deluxe',
    size: 'Spacious',
    image: '/images/newrooms/super-deluxe/room1.jpg',
    gallery: [
      '/images/newrooms/super-deluxe/room1.jpg',
      '/images/newrooms/super-deluxe/room2.JPG',
      '/images/newrooms/super-deluxe/room3.JPG',
    ],
    description: 'Upgraded room with king size bed and elegant furnishings for enhanced comfort.',
    features: ['King Size Bed', 'Cushion Chair', 'Curtains with Scallops', 'Double Glazing UPVC Window'],
  },
  SUITE: {
    id: 'executive-suite',
    category: 'suite',
    size: 'Luxury Suite',
    image: '/images/newrooms/suite/room1.JPG',
    gallery: [
      '/images/newrooms/suite/room1.JPG',
      '/images/newrooms/suite/room2.JPG',
      '/images/newrooms/suite/room3.JPG',
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
      icon: <Waves className="h-5 w-5 sm:h-8 sm:w-8" />,
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
      icon: <Heart className="h-5 w-5 sm:h-8 sm:w-8" />,
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
      icon: <Utensils className="h-5 w-5 sm:h-8 sm:w-8" />,
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
      <section className="pt-28 pb-8 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Rooms, Dining & Amenities</motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Discover our luxurious accommodations, world-class dining experiences,
            and comprehensive amenities designed for your perfect getaway
          </motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* ROOMS SECTION */}
      <section id="rooms" className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Luxurious Accommodations</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mt-4">
              Choose from our collection of elegantly appointed rooms and suites,
              each designed to provide comfort and stunning views
            </motion.p>
          </motion.div>

          {/* Rooms Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {filteredRooms.map((room, index) => {
              const currentSlide = cardSlides[room.id] || 0;
              const gallery = room.gallery;
              return (
                <motion.div
                  key={room.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-2xl shadow-resort overflow-hidden hover:shadow-glass-lg transition-shadow duration-300 group"
                >
                  {/* Image Carousel */}
                  <div className="relative h-48 sm:h-64 lg:h-72 overflow-hidden">
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
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); setCardSlide(room.id, (currentSlide + 1) % gallery.length); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                          {gallery.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => { e.preventDefault(); setCardSlide(room.id, i); }}
                              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
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

                  <div className="p-3 sm:p-5 lg:p-6">
                    <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2">{room.name}</h3>
                    <p className="text-sm sm:text-base text-slate-600 mb-4">{room.description}</p>

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
                          <div className="w-2 h-2 bg-resort-gold rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <motion.div whileHover={{ scale: 1.05, y: -2 }} className="flex-1">
                        <Link
                          href={`/rooms/${room.id}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 sm:py-3 text-sm sm:text-base rounded-full text-center font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center justify-center cursor-pointer"
                        >
                          View Details
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* DINING SECTION */}
      <section id="dining" className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Culinary Excellence</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mt-4">
              Savor the unique fusion of French culinary artistry and Indian flavors,
              from elegant fine dining to casual beachfront meals
            </motion.p>
          </motion.div>

          {/* Restaurant Selection */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 sm:mb-10 lg:mb-12">
            {restaurants.map((restaurant) => (
              <motion.button
                key={restaurant.id}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => setSelectedRestaurant(restaurant.id)}
                className={`px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer ${
                  selectedRestaurant === restaurant.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-ocean'
                    : 'glass-card text-slate-700 hover:bg-white/80 shadow-sm'
                }`}
              >
                {restaurant.name}
              </motion.button>
            ))}
          </div>

          {/* Featured Restaurant */}
          {restaurants.filter(r => r.id === selectedRestaurant).map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-12 lg:mb-16"
            >
              <div>
                <div className="flex items-center mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
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

                <h3 className="text-xl sm:text-3xl font-bold text-blue-900 mb-4">{restaurant.name}</h3>
                <p className="text-sm sm:text-lg text-slate-600 mb-6">{restaurant.description}</p>

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
                  <h4 className="text-xl font-semibold text-blue-900 mb-4">Signature Specialties</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {restaurant.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-resort-gold rounded-full mr-3"></div>
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
                  className="rounded-2xl shadow-resort w-full h-40 sm:h-72 lg:h-96 object-cover"
                />
                <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 glass-card p-3 sm:p-4 rounded-2xl shadow-glass">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{restaurant.rating}</div>
                  <div className="text-slate-600 text-sm">Guest Rating</div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* All Restaurants Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl shadow-resort overflow-hidden hover:shadow-glass-lg transition-shadow duration-300"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-36 sm:h-48 object-cover"
                />
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-50/80 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {restaurant.type}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-slate-600">{restaurant.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{restaurant.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center text-slate-500 text-sm mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {restaurant.hours}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* AMENITIES SECTION */}
      <section id="amenities" className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">World-Class Amenities</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mt-4">
              Everything you need for the perfect beach vacation, from luxury spa treatments
              to thrilling water sports and cultural experiences
            </motion.p>
          </motion.div>

          {/* Amenity Category Selection */}
          <div className="flex flex-wrap gap-4 justify-center mb-8 sm:mb-10 lg:mb-12">
            {amenityCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => setAmenityCategory(category.id)}
                className={`flex items-center px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 cursor-pointer ${
                  amenityCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-ocean'
                    : 'glass-card text-slate-700 hover:bg-white/80'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Detailed Amenities */}
          {amenityCategories.filter(cat => cat.id === amenityCategory).map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card bg-blue-50/40 rounded-2xl shadow-resort mb-10 p-3 sm:p-6 lg:p-8"
            >
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full mr-4">
                  {category.icon}
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-blue-900">{category.title}</h3>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    variants={fadeInUp}
                    custom={itemIndex}
                    whileHover={{ y: -6 }}
                    className="bg-white/80 backdrop-blur-sm p-3 sm:p-5 lg:p-6 rounded-2xl hover:shadow-glass transition-shadow duration-300"
                  >
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">{item.name}</h4>
                    <p className="text-slate-600">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}

          {/* Featured Amenities */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8"
          >
            <motion.div variants={fadeInUp} custom={0} whileHover={{ y: -6 }} className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Spa Treatment"
                className="w-full h-36 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2">Ayurvedic Spa</h3>
                  <p>Rejuvenating treatments with ocean views</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1} whileHover={{ y: -6 }} className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Water Sports"
                className="w-full h-36 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2">Water Sports</h3>
                  <p>Thrilling adventures on pristine waters</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={2} whileHover={{ y: -6 }} className="relative group overflow-hidden rounded-2xl">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fine Dining"
                className="w-full h-36 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2">Fine Dining</h3>
                  <p>French-Indian fusion culinary excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(/images/gallery/resort-beach-view.jpg)'
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
          <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Luxury?
          </motion.h2>
          <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-white/90 mb-8">
            Book your stay at St James Court Beach Resort and indulge in our world-class
            accommodations, dining, and amenities
          </motion.p>
          <motion.div variants={fadeInUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/booking"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Stay
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }}>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
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

export default Rooms;
