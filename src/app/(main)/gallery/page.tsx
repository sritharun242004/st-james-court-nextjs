'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Filter } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

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
  exterior: 'bg-blue-500',
  rooms: 'bg-blue-500',
  pool: 'bg-blue-500',
  dining: 'bg-blue-500',
  events: 'bg-blue-500',
  conference: 'bg-blue-500',
};

const galleryImages: GalleryImage[] = [
  // === Exterior ===
  { src: '/images/gallery/gallery-1.jpg', alt: 'Resort Grounds & Cottages', category: 'exterior' },
  { src: '/images/gallery/gallery-3.jpg', alt: 'Resort Building & Lawn', category: 'exterior' },
  { src: '/images/gallery/gallery-8.jpg', alt: 'Resort Direction Signboard', category: 'exterior' },
  { src: '/images/gallery/gallery-11.jpg', alt: 'Children\'s Play Area', category: 'exterior' },
  { src: '/images/gallery/gallery-15.jpg', alt: 'Beach View from Pergola', category: 'exterior' },
  { src: '/images/gallery/gallery-16.jpg', alt: 'Resort Direction Board', category: 'exterior' },

  // === Rooms ===
  { src: '/images/gallery/resort-interior-1.jpg', alt: 'Room — King Bed & Seating', category: 'rooms' },
  { src: '/images/gallery/gallery-7.jpg', alt: 'Room — King Bed Setup', category: 'rooms' },
  { src: '/images/gallery/gallery-18.jpg', alt: 'Room — Bed & Amenities', category: 'rooms' },
  { src: '/images/gallery/gallery-33.jpg', alt: 'Room — TV, Fridge & Desk', category: 'rooms' },
  { src: '/images/rooms/deluxe/deluxe-room-1.jpg', alt: 'Deluxe Room', category: 'rooms' },
  { src: '/images/rooms/deluxe/deluxe-room-2.jpg', alt: 'Deluxe Room Interior', category: 'rooms' },
  { src: '/images/rooms/deluxe/deluxe-room-3.jpg', alt: 'Deluxe Room View', category: 'rooms' },
  { src: '/images/rooms/super-deluxe/super-deluxe-room-1.jpg', alt: 'Super Deluxe Room', category: 'rooms' },
  { src: '/images/rooms/super-deluxe/super-deluxe-room-2.jpg', alt: 'Super Deluxe Room Interior', category: 'rooms' },
  { src: '/images/rooms/super-deluxe/super-deluxe-room-3.jpg', alt: 'Super Deluxe Room Furnishing', category: 'rooms' },
  { src: '/images/rooms/super-deluxe/super-deluxe-balcony-sea-view.jpg', alt: 'Super Deluxe Balcony Sea View', category: 'rooms' },
  { src: '/images/rooms/suite/suite-room-1.jpg', alt: 'Executive Suite', category: 'rooms' },
  { src: '/images/rooms/suite/suite-room-2.jpg', alt: 'Executive Suite Interior', category: 'rooms' },
  { src: '/images/rooms/suite/suite-room-3.jpg', alt: 'Executive Suite Living Area', category: 'rooms' },

  // === Pool & Beach ===
  { src: '/images/gallery/gallery-19.jpg', alt: 'Pool with Resort Building', category: 'pool' },
  { src: '/images/gallery/gallery-20.jpg', alt: 'Pool — Front View', category: 'pool' },
  { src: '/images/gallery/gallery-23.jpg', alt: 'Pool & Resort Side View', category: 'pool' },
  { src: '/images/gallery/gallery-26.jpeg', alt: 'Guests at the Pool', category: 'pool' },

  // === Dining ===
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

  // === Events ===
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

  // === Conference ===
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

// Compute bento size based on position in filtered array
// Pattern every 8 items: featured(2x2) + 4 std + wide(2x1) + 2 std = 3 full rows
// Row 1: featured(2col) + std + std = 4 cols
// Row 2: featured(2col continues) + std + std = 4 cols
// Row 3: wide(2col) + std + std = 4 cols
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
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="pt-52 pb-24 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/gallery/gallery-bg.jpg)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-50"></div>
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300 font-jost mb-4">St James Court Beach Resort</p>
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-6">Gallery</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white/80">
            A visual journey through our resort — from sunlit rooms to beachside celebrations
          </p>
        </AnimatedSection>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-[72px] z-30">
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
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/15'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
      <section className="py-10 bg-slate-50">
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
                const accent = categoryAccent[image.category] || 'bg-blue-500';
                const spanClass =
                  size === 'featured' ? 'col-span-2 row-span-2'
                  : size === 'wide' ? 'col-span-2'
                  : '';

                return (
                  <div
                    key={image.src}
                    className={`${spanClass} relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500`}
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

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Hover content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${accent}`}></span>
                        <span className="text-[10px] md:text-xs uppercase tracking-wider text-white/60 font-jost">
                          {categories.find(c => c.id === image.category)?.name}
                        </span>
                      </div>
                      <p className="text-white font-medium text-xs md:text-sm leading-snug">{image.alt}</p>
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 md:p-2">
                        <ZoomIn className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                      </div>
                    </div>

                    {/* Corner accent line */}
                    <div className={`absolute top-0 left-0 w-0 group-hover:w-10 h-0.5 md:h-1 ${accent} rounded-full transition-all duration-500`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Image Count Footer */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm">
              Showing {filteredImages.length} of {galleryImages.length} photos
              {activeCategory !== 'all' && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
            className="absolute top-4 right-4 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-all"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
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
