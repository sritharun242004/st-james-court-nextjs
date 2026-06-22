'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Wifi, Coffee, Bath, Car, Utensils, Star, Calendar, Check, MapPin, Clock } from 'lucide-react';
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

// Maps a stored amenity name to a representative icon (best-effort by keyword).
const amenityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('wifi') || n.includes('internet')) return <Wifi className="h-5 w-5" />;
  if (n.includes('coffee') || n.includes('tea') || n.includes('bar')) return <Coffee className="h-5 w-5" />;
  if (n.includes('bath') || n.includes('shower')) return <Bath className="h-5 w-5" />;
  if (n.includes('park')) return <Car className="h-5 w-5" />;
  if (n.includes('dining') || n.includes('room service') || n.includes('food') || n.includes('breakfast')) return <Utensils className="h-5 w-5" />;
  return <Check className="h-5 w-5" />;
};

interface RoomView {
  name: string;
  price: number;
  size: string;
  occupancy: number;
  bedType: string;
  heroImage: string;
  images: string[];
  description: string;
  detailedDescription: string;
  features: string[];
  amenities: { name: string; icon: React.ReactNode }[];
  highlights: string[];
}

const PLACEHOLDER_IMAGE = '/images/newrooms/deluxe/room1.JPG';

const RoomDetail = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<RoomView | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let active = true;
    fetch(`/api/rooms/${encodeURIComponent(roomId)}`, { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('not found'))))
      .then(json => {
        if (!active || !json.data) return;
        const d = json.data;
        const images: string[] = Array.isArray(d.images) && d.images.length > 0 ? d.images : [PLACEHOLDER_IMAGE];
        setRoom({
          name: d.name,
          price: d.today_price ? Number(d.today_price) : 0,
          size: d.size_label || '',
          occupancy: d.max_occupancy_per_room || d.capacity || 2,
          bedType: d.bed_type || '',
          heroImage: images[0],
          images,
          description: d.short_description || '',
          detailedDescription: d.long_description || d.short_description || '',
          features: Array.isArray(d.features) ? d.features : [],
          amenities: (Array.isArray(d.amenities) ? d.amenities : []).map((name: string) => ({ name, icon: amenityIcon(name) })),
          highlights: Array.isArray(d.highlights) ? d.highlights : [],
        });
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-resort-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-resort-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Room Not Found</h1>
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative pt-36 pb-12 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-900/50 to-black/30"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4"
        >
          <Link
            href="/rooms"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Rooms
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-end">
            <div>
              <motion.div variants={fadeInUp} custom={0} className="inline-block bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-4">
                {room.bedType} &middot; {room.size}
              </motion.div>
              <motion.h1 variants={fadeInUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-3 sm:mb-4 lg:mb-5">{room.name}</motion.h1>
              <motion.p variants={fadeInUp} custom={2} className="text-base sm:text-lg lg:text-xl leading-relaxed text-white/90 mb-6 max-w-xl">{room.description}</motion.p>
              <motion.div variants={fadeInUp} custom={3} className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 text-sm sm:text-base text-white/80">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Up to {room.occupancy} guests
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {room.size}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            </div>
            <motion.div
              variants={fadeInUp}
              custom={2}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-6 lg:p-8"
            >
              <div className="text-center mb-6">
                <div className="text-sm text-white/70 mb-1">Starting from</div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">₹{room.price.toLocaleString()}</div>
                <div className="text-white/70 text-sm mt-1">per night + GST</div>
              </div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                <Link
                  href="/booking"
                  className="w-full bg-white text-blue-600 px-6 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center justify-center cursor-pointer"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book This Room
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Image Gallery */}
      <section className="py-12 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-full h-56 sm:h-72 lg:h-[520px] rounded-2xl overflow-hidden shadow-resort mb-4">
              <Image
                src={room.images[selectedImage]}
                alt={`${room.name} - Image ${selectedImage + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                unoptimized
              />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                {selectedImage + 1} / {room.images.length}
              </div>
            </div>

            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${room.images.length}, 1fr)` }}>
              {room.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 sm:h-24 rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    selectedImage === index
                      ? 'ring-3 ring-blue-500 shadow-glass scale-[1.02]'
                      : 'opacity-70 hover:opacity-100 hover:shadow-resort'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${room.name} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Room Details */}
      <section className="py-12 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-4 sm:mb-5 lg:mb-6">Room Description</motion.h2>
                <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg text-slate-700 leading-relaxed mb-8">
                  {room.detailedDescription}
                </motion.p>

                <motion.h3 variants={fadeInUp} custom={2} className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-4 sm:mb-5 lg:mb-6">Room Features</motion.h3>
                <motion.div variants={fadeInUp} custom={3} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.h3 variants={fadeInUp} custom={4} className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-4 sm:mb-5 lg:mb-6">Why Choose This Room</motion.h3>
                <motion.div variants={fadeInUp} custom={5} className="space-y-3">
                  {room.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <Star className="h-5 w-5 text-resort-gold mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="glass-card rounded-2xl shadow-resort p-4 sm:p-5 lg:p-6 sticky top-32">
                  <h3 className="text-xl font-bold text-blue-900 mb-6">Room Amenities</h3>
                  <div className="space-y-4 mb-8">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <div className="text-blue-600 mr-3">
                          {amenity.icon}
                        </div>
                        <span className="text-slate-700">{amenity.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-sand-200 pt-6">
                    <h4 className="font-semibold text-blue-900 mb-4">Pricing</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Today&apos;s rate:</span>
                        <span className="font-semibold text-blue-600">₹{room.price.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-500">*Prices exclude 12% GST. Rates may vary by date.</div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                      <Link
                        href="/booking"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 flex items-center justify-center cursor-pointer"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Book Now
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Additional Information */}
      <section className="py-12 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <motion.div variants={fadeInUp} custom={0} whileHover={{ y: -6 }} className="text-center p-4 sm:p-5 lg:p-6 glass-card bg-blue-50/40 rounded-2xl">
              <Clock className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Check-in/Check-out</h3>
              <p className="text-slate-600 text-sm">Check-in: 3:00 PM<br />Check-out: 11:00 AM</p>
            </motion.div>
            <motion.div variants={fadeInUp} custom={1} whileHover={{ y: -6 }} className="text-center p-4 sm:p-5 lg:p-6 glass-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <Car className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Free Parking</h3>
              <p className="text-slate-600 text-sm">Complimentary parking available for all guests</p>
            </motion.div>
            <motion.div variants={fadeInUp} custom={2} whileHover={{ y: -6 }} className="text-center p-4 sm:p-5 lg:p-6 glass-card bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl">
              <Utensils className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Dining</h3>
              <p className="text-slate-600 text-sm">24/7 room service and multiple dining options</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;
