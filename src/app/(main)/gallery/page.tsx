'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Filter } from 'lucide-react';
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

type BentoSize = 'featured' | 'wide' | 'standard';

type GalleryImage = {
  src: string;
  alt: string;
  category: string;
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'exterior', name: 'Exterior' },
  { id: 'rooms', name: 'Rooms' },
  { id: 'pool', name: 'Pool & Beach' },
  { id: 'dining', name: 'Dining' },
  { id: 'events', name: 'Events' },
  { id: 'conference', name: 'Conference' },
];

const categoryAccent: Record<string, string> = {
  exterior: 'bg-resort-gold',
  rooms: 'bg-resort-gold',
  pool: 'bg-resort-gold',
  dining: 'bg-resort-gold',
  events: 'bg-resort-gold',
  conference: 'bg-resort-gold',
};

const galleryImages: GalleryImage[] = [
  { src: '/images/exterior/IMG_3410.JPG', alt: 'Resort Exterior View', category: 'exterior' },
  { src: '/images/exterior/IMG_3411.JPG', alt: 'Resort Building Front', category: 'exterior' },
  { src: '/images/exterior/IMG_3412.JPG', alt: 'Resort Grounds', category: 'exterior' },
  { src: '/images/exterior/IMG_3413.JPG', alt: 'Resort Landscape', category: 'exterior' },
  { src: '/images/exterior/IMG_3415.JPG', alt: 'Resort Entrance', category: 'exterior' },
  { src: '/images/exterior/IMG_3420.JPG', alt: 'Resort Garden Area', category: 'exterior' },
  { src: '/images/exterior/IMG_3422.JPG', alt: 'Resort Surroundings', category: 'exterior' },
  { src: '/images/gallery/gallery-1.jpg', alt: 'Resort Grounds & Cottages', category: 'exterior' },
  { src: '/images/gallery/gallery-3.jpg', alt: 'Resort Building & Lawn', category: 'exterior' },
  { src: '/images/gallery/gallery-8.jpg', alt: 'Resort Direction Signboard', category: 'exterior' },
  { src: '/images/gallery/gallery-11.jpg', alt: 'Children\'s Play Area', category: 'exterior' },
  { src: '/images/gallery/gallery-15.jpg', alt: 'Beach View from Pergola', category: 'exterior' },
  { src: '/images/gallery/gallery-16.jpg', alt: 'Resort Direction Board', category: 'exterior' },
  { src: '/images/newrooms/deluxe/room1.JPG', alt: 'Deluxe Room', category: 'rooms' },
  { src: '/images/newrooms/deluxe/room2.JPG', alt: 'Deluxe Room Interior', category: 'rooms' },
  { src: '/images/newrooms/deluxe/unnamed.jpg', alt: 'Deluxe Room View', category: 'rooms' },
  { src: '/images/newrooms/super-deluxe/room1.jpg', alt: 'Super Deluxe Room', category: 'rooms' },
  { src: '/images/newrooms/super-deluxe/room2.JPG', alt: 'Super Deluxe Room Interior', category: 'rooms' },
  { src: '/images/newrooms/super-deluxe/room3.JPG', alt: 'Super Deluxe Room Furnishing', category: 'rooms' },
  { src: '/images/newrooms/suite/room1.JPG', alt: 'Executive Suite', category: 'rooms' },
  { src: '/images/newrooms/suite/room2.JPG', alt: 'Executive Suite Interior', category: 'rooms' },
  { src: '/images/newrooms/suite/room3.JPG', alt: 'Executive Suite Living Area', category: 'rooms' },
  { src: '/images/pool-beachview/IMG_3397.JPG', alt: 'Pool & Beach View', category: 'pool' },
  { src: '/images/pool-beachview/IMG_3398.JPG', alt: 'Pool & Beach Panorama', category: 'pool' },
  { src: '/images/pool-beachview/IMG_3399.JPG', alt: 'Pool & Beach Overview', category: 'pool' },
  { src: '/images/gallery/gallery-19.jpg', alt: 'Pool with Resort Building', category: 'pool' },
  { src: '/images/gallery/gallery-20.jpg', alt: 'Pool — Front View', category: 'pool' },
  { src: '/images/gallery/gallery-23.jpg', alt: 'Pool & Resort Side View', category: 'pool' },
  { src: '/images/gallery/gallery-26.jpeg', alt: 'Guests at the Pool', category: 'pool' },
  { src: '/images/dining/dining-hero.jpg', alt: 'Restaurant Overview', category: 'dining' },
  { src: '/images/gallery/gallery-17.jpg', alt: 'Sea View Restaurant', category: 'dining' },
  { src: '/images/dining/dining-4.jpg', alt: 'Beachside Dining', category: 'dining' },
  { src: '/images/gallery/gallery-5.jpg', alt: 'Outdoor Buffet Dinner', category: 'dining' },
  { src: '/images/gallery/gallery-27.jpg', alt: 'Sea Breeze Bar', category: 'dining' },
  { src: '/images/gallery/resort-garden.jpg', alt: 'Restaurant & Bar Area', category: 'dining' },
  { src: '/images/dining/dining-1.jpg', alt: 'Dining Area', category: 'dining' },
  { src: '/images/dining/dining-2.jpg', alt: 'Restaurant Interior', category: 'dining' },
  { src: '/images/dining/dining-3.jpg', alt: 'Dining Setup', category: 'dining' },
  { src: '/images/dining/dining-5.jpg', alt: 'Dining Experience', category: 'dining' },
  { src: '/images/dining/dining-6.jpg', alt: 'Bar Counter', category: 'dining' },
  { src: '/images/dining/dining-7.jpg', alt: 'Fine Dining', category: 'dining' },
  { src: '/images/gallery/gallery-2.jpeg', alt: 'Beach Wedding Ceremony', category: 'events' },
  { src: '/images/gallery/gallery-30.jpeg', alt: 'Night Event with Lights', category: 'events' },
  { src: '/images/events/beach-engagement-2.jpeg', alt: 'Beach Engagement Ceremony', category: 'events' },
  { src: '/images/gallery/gallery-4.jpeg', alt: 'Guests at Resort Event', category: 'events' },
  { src: '/images/gallery/gallery-9.jpg', alt: 'Cricket Trophy Ceremony', category: 'events' },
  { src: '/images/gallery/gallery-10.jpeg', alt: 'Beach Wedding', category: 'events' },
  { src: '/images/gallery/gallery-13.jpeg', alt: 'Wedding Reception', category: 'events' },
  { src: '/images/gallery/gallery-21.jpeg', alt: 'Cricket on the Lawn', category: 'events' },
  { src: '/images/gallery/gallery-22.jpeg', alt: 'Corporate Award Ceremony', category: 'events' },
  { src: '/images/gallery/gallery-24.jpeg', alt: 'Corporate Team Event', category: 'events' },
  { src: '/images/gallery/gallery-25.jpeg', alt: 'Kids at Evening Event', category: 'events' },
  { src: '/images/gallery/gallery-29.jpg', alt: 'Outdoor Catering Event', category: 'events' },
  { src: '/images/gallery/gallery-31.jpg', alt: 'Large Outdoor Feast', category: 'events' },
  { src: '/images/gallery/gallery-32.jpg', alt: 'Outdoor Gathering', category: 'events' },
  { src: '/images/events/birthday-event-1.jpeg', alt: 'Birthday Celebration', category: 'events' },
  { src: '/images/events/birthday-event-2.jpeg', alt: 'Birthday Party Setup', category: 'events' },
  { src: '/images/events/birthday-event-3.jpeg', alt: 'Birthday Decoration', category: 'events' },
  { src: '/images/events/beach-engagement-1.jpeg', alt: 'Beach Engagement', category: 'events' },
  { src: '/images/events/beach-engagement-3.jpeg', alt: 'Beach Engagement Celebration', category: 'events' },
  { src: '/images/gallery/resort-pool-area.jpg', alt: 'Conference Hall — Stage & Seating', category: 'conference' },
  { src: '/images/gallery/gallery-6.jpg', alt: 'Conference Hall with Stage', category: 'conference' },
  { src: '/images/gallery/gallery-12.jpg', alt: 'Conference Hall — Wide View', category: 'conference' },
  { src: '/images/gallery/gallery-14.jpg', alt: 'Corporate Training Session', category: 'conference' },
  { src: '/images/conference/conference-hall-1.jpg', alt: 'Conference Hall', category: 'conference' },
  { src: '/images/conference/conference-hall-2.jpg', alt: 'Conference Setup', category: 'conference' },
  { src: '/images/conference/conference-hall-3.jpg', alt: 'Conference Room', category: 'conference' },
  { src: '/images/conference/conference-hall-4.jpg', alt: 'Training Hall', category: 'conference' },
  { src: '/images/conference/conference-hall-5.jpg', alt: 'Meeting Room', category: 'conference' },
];

const getBentoSize = (index: number): BentoSize => {
  const pos = index % 8;
  if (pos === 0) return 'featured';
  if (pos === 5) return 'wide';
  return 'standard';
};

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <div className="bg-resort-pearl">
      {/* Hero Section */}
      <section className="pt-28 pb-8 sm:pt-44 sm:pb-18 lg:pt-52 lg:pb-24 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/gallery/gallery-bg.jpg)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-pearl"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.p variants={fadeInUp} custom={0} className="text-sm uppercase tracking-[0.3em] text-resort-gold font-jost mb-4">St James Court Beach Resort</motion.p>
          <motion.h1 variants={fadeInUp} custom={1} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-6">Gallery</motion.h1>
          <motion.p variants={fadeInUp} custom={2} className="text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed text-white/80">
            A visual journey through our resort — from sunlit rooms to beachside celebrations
          </motion.p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="py-3 sm:py-4 lg:py-6 bg-white/80 backdrop-blur-xl border-b border-sand-200 sticky top-[60px] sm:top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
            {categories.map((cat) => {
              const count = cat.id === 'all'
                ? galleryImages.length
                : galleryImages.filter(img => img.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/15'
                      : 'bg-resort-pearl text-slate-600 hover:bg-blue-50/60'
                  }`}
                >
                  {cat.name}
                  <span className={`ml-1.5 text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bento Gallery Grid */}
      <section className="py-10 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          {filteredImages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400">No photos in this category yet.</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[200px] gap-2.5 md:gap-3"
              style={{ gridAutoFlow: 'dense' }}
            >
              {filteredImages.map((image, index) => {
                const size = getBentoSize(index);
                const accent = categoryAccent[image.category] || 'bg-resort-gold';
                const spanClass =
                  size === 'featured' ? 'col-span-2 row-span-2'
                  : size === 'wide' ? 'col-span-2'
                  : '';

                return (
                  <div
                    key={image.src}
                    className={`${spanClass} relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-200 shadow-sm hover:shadow-glass-lg transition-shadow duration-500`}
                    onClick={() => openLightbox(index)}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${Math.min(index * 0.03, 0.6)}s both`,
                    }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes={
                        size === 'featured' ? '(max-width: 768px) 100vw, 50vw'
                        : size === 'wide' ? '(max-width: 768px) 100vw, 50vw'
                        : '(max-width: 768px) 50vw, 25vw'
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${accent}`}></span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-jost">
                          {categories.find(c => c.id === image.category)?.name}
                        </span>
                      </div>
                      <p className="text-white font-medium text-xs md:text-sm leading-snug">{image.alt}</p>
                    </div>

                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                        <ZoomIn className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                      </div>
                    </div>

                    <div className={`absolute top-0 left-0 w-0 group-hover:w-10 h-0.5 md:h-1 ${accent} rounded-full transition-all duration-500`} />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
              Showing {filteredImages.length} of {galleryImages.length} photos
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors cursor-pointer"
                >
                  — View All
                </button>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute top-4 left-4 text-white/60 text-sm bg-white/10 px-4 py-2 rounded-full font-jost">
            {lightboxIndex + 1} / {filteredImages.length}
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <span className={`w-2 h-2 rounded-full ${categoryAccent[filteredImages[lightboxIndex].category]}`}></span>
            <span className="text-white/70 text-xs uppercase tracking-wider font-jost">
              {categories.find(c => c.id === filteredImages[lightboxIndex].category)?.name}
            </span>
          </div>

          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all cursor-pointer"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all cursor-pointer"
          >
            <ChevronRight className="h-7 w-7" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 my-16 flex items-center justify-center">
            <Image
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 backdrop-blur-sm px-5 py-2.5 rounded-full font-jost">
            {filteredImages[lightboxIndex].alt}
          </div>

          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}
    </div>
  );
};

export default Gallery;
