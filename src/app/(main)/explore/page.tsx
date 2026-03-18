'use client';

import React, { useState } from 'react';
import { MapPin, Clock, Star, Camera, Navigation, Utensils, TreePine, Building, ExternalLink } from 'lucide-react';

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Attractions', icon: <MapPin className="h-5 w-5" /> },
    { id: 'beach', name: 'Beaches', icon: <Navigation className="h-5 w-5" /> },
    { id: 'temple', name: 'Temples & Spiritual', icon: <Building className="h-5 w-5" /> },
    { id: 'nature', name: 'Nature & Parks', icon: <TreePine className="h-5 w-5" /> },
    { id: 'heritage', name: 'Heritage Sites', icon: <Camera className="h-5 w-5" /> },
    { id: 'dining', name: 'Local Dining', icon: <Utensils className="h-5 w-5" /> },
    { id: 'activities', name: 'Activities', icon: <Camera className="h-5 w-5" /> },
  ];

  const attractions = [
    // Walking Distance (0-2 km)
    {
      id: 1,
      category: 'temple',
      name: 'Sai Baba Temple',
      distance: '0.2 km',
      duration: '30 min',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/5709968/pexels-photo-5709968.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The famed Sai Baba Temple is just steps from the resort, popular for morning prayers and spiritual solace.',
      highlights: ['Morning Prayers', 'Peaceful Atmosphere', 'Walking Distance', 'Spiritual Experience'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sai+Baba+Temple%2C+Puducherry+Engineering+College%2C+Chinna+Kalapet%2C+Pondicherry',
    },
    {
      id: 2,
      category: 'temple',
      name: 'Kalapet Shri Bala Murugan Temple',
      distance: '0.8 km',
      duration: '30 min',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/29082079/pexels-photo-29082079.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Local Murugan shrine with a colorful gopuram in Kalapet, popular for quick prayers and community rituals.',
      highlights: ['Colorful Gopuram', 'Community Rituals', 'Local Culture', 'Walking Distance'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kalapet+Shri+Bala+Murugan+Temple%2C+Pondicherry',
    },
    // Short Drive (2-10 km)
    {
      id: 16,
      category: 'activities',
      name: 'Scuba Diving at Temple Adventures',
      distance: '5 km',
      duration: 'Half day',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Discover underwater temples and marine life in the Bay of Bengal with professional instructors.',
      highlights: ['Underwater Temples', 'Marine Life', 'Professional Instructors', 'Equipment Provided'],
      price: '₹3,500 per person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Temple+Adventures+Scuba+Diving+Pondicherry',
    },
    {
      id: 3,
      category: 'dining',
      name: 'Auroville Punjabi Dhaba',
      distance: '6 km',
      duration: '1 hr',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Unpretentious spot for veg North Indian thalis and Punjabi dishes near Auroville; budget-friendly with outdoor seating.',
      highlights: ['North Indian Thalis', 'Budget Friendly', 'Outdoor Seating', 'Veg Cuisine'],
      price: '₹200-400 per person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Auroville+Punjabi+Dhaba%2C+Auroville+Rd%2C+Bommayapalayam',
    },
    {
      id: 4,
      category: 'dining',
      name: 'Hope Cafe Auroville',
      distance: '6 km',
      duration: '1 hr',
      rating: 4.4,
      image: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Wood-fired pizzas, sandwiches, and veg cafe fare in a cozy Auroville setting; great for coffee and quick bites.',
      highlights: ['Wood-fired Pizzas', 'Cozy Ambiance', 'Coffee & Bites', 'Auroville Vibes'],
      price: '₹300-600 per person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hope+Cafe+Auroville+Main+Road',
    },
    {
      id: 5,
      category: 'dining',
      name: 'Conscious Cafe',
      distance: '6 km',
      duration: '1 hr',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Vegan/veg menu with laksa, lattes, and healthy options in a trendy, quiet spot; popular for brunch.',
      highlights: ['Vegan Menu', 'Healthy Options', 'Trendy Ambiance', 'Brunch Spot'],
      price: '₹400-700 per person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Conscious+Cafe%2C+Auroville+Rd%2C+Bommayapalayam',
    },
    {
      id: 17,
      category: 'dining',
      name: 'Cafe des Arts',
      distance: '8 km',
      duration: '1-2 hrs',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Authentic French cuisine in a charming colonial setting with local artwork and a curated wine selection.',
      highlights: ['French Cuisine', 'Colonial Ambiance', 'Art Gallery', 'Wine Selection'],
      price: '₹800-1,500 per person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Cafe+des+Arts+Pondicherry',
    },
    {
      id: 6,
      category: 'nature',
      name: 'Ousteri Lake (Osudu Lake)',
      distance: '10 km',
      duration: '2-3 hrs',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/32279595/pexels-photo-32279595.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Scenic lake spanning 390 hectares, ideal for birdwatching and boating; a nature lovers paradise between Pondy and TN border.',
      highlights: ['Birdwatching', 'Boating', 'Nature Walks', '390 Hectare Lake'],
      price: '~₹200',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ousteri+Lake%2C+Pondicherry',
    },
    // Medium Drive (10-20 km)
    {
      id: 7,
      category: 'beach',
      name: 'Paradise Beach',
      distance: '12 km',
      duration: '2-3 hrs',
      rating: 4.4,
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Pristine golden sands reached by a 20-30 min boat ride from Chunnambar; perfect for relaxation and water sports.',
      highlights: ['Boat Ride Access', 'Golden Sands', 'Water Sports', 'Secluded Beach'],
      price: 'Boat ~₹200-300/person',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Paradise+Beach%2C+Pondicherry',
    },
    {
      id: 8,
      category: 'heritage',
      name: 'Arikamedu Archaeological Site',
      distance: '13 km',
      duration: '1 hr',
      rating: 3.6,
      image: 'https://images.pexels.com/photos/28656073/pexels-photo-28656073.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient Roman-Chola port ruins dating back to 1st century BC with fascinating artifacts; a key Indo-Roman trade site.',
      highlights: ['Roman Ruins', 'Archaeological Site', 'Indo-Roman Trade', 'Historical Artifacts'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Arikamedu+Archaeological+Site%2C+Pondicherry',
    },
    {
      id: 9,
      category: 'temple',
      name: 'Matrimandir, Auroville',
      distance: '13 km',
      duration: '2 hrs',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/3974244/pexels-photo-3974244.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Iconic golden dome meditation center in Auroville; book passes in advance for inner chamber views amid beautiful gardens.',
      highlights: ['Golden Dome', 'Meditation Center', 'Beautiful Gardens', 'Advance Booking'],
      price: 'Free (pass required)',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Matrimandir%2C+Auroville',
    },
    {
      id: 10,
      category: 'beach',
      name: 'Serenity Beach',
      distance: '14 km',
      duration: '1 hr',
      rating: 4.2,
      image: 'https://images.pexels.com/photos/1139541/pexels-photo-1139541.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Calm rocky beach near Kottakupam with stunning sunsets and fewer crowds; perfect for peaceful walks.',
      highlights: ['Stunning Sunsets', 'Fewer Crowds', 'Rocky Shoreline', 'Peaceful Walks'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Serenity+Beach%2C+Pondicherry',
    },
    {
      id: 11,
      category: 'temple',
      name: 'Sri Aurobindo Ashram',
      distance: '15 km',
      duration: '1-2 hrs',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/4915549/pexels-photo-4915549.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Spiritual hub founded by Sri Aurobindo with peaceful gardens and samadhi; a place for meditation and quiet reflection.',
      highlights: ['Meditation Hall', 'Peaceful Gardens', 'Samadhi', 'Spiritual Experience'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Aurobindo+Ashram%2C+Pondicherry',
    },
    {
      id: 12,
      category: 'beach',
      name: 'Promenade Beach (Rock Beach)',
      distance: '16 km',
      duration: '1 hr',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/17945496/pexels-photo-17945496.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Iconic seafront with Gandhi statue and lighthouse views; perfect for evening strolls and street food.',
      highlights: ['Gandhi Statue', 'Lighthouse Views', 'Evening Strolls', 'Street Food'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Promenade+Beach%2C+Pondicherry',
    },
    {
      id: 13,
      category: 'temple',
      name: 'Arulmigu Manakula Vinayagar Temple',
      distance: '16 km',
      duration: '45 min',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/28867654/pexels-photo-28867654.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Vibrant Ganesha temple with elephant blessings and colorful rituals; one of the most famous temples in Pondicherry.',
      highlights: ['Elephant Blessings', 'Colorful Rituals', 'Historic Temple', 'Vibrant Atmosphere'],
      price: 'Free (donations)',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Manakula+Vinayagar+Temple%2C+Pondicherry',
    },
    {
      id: 18,
      category: 'heritage',
      name: 'French Quarter (White Town)',
      distance: '16 km',
      duration: '2-3 hrs',
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1799730/pexels-photo-1799730.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Explore the charming colonial architecture, yellow buildings, and cobblestone streets of the French Quarter.',
      highlights: ['Colonial Architecture', 'Cafes & Boutiques', 'Photography Spots', 'Walking Tours'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=French+Quarter+White+Town+Pondicherry',
    },
    {
      id: 19,
      category: 'heritage',
      name: 'Sacred Heart Basilica',
      distance: '16 km',
      duration: '1 hr',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/6395411/pexels-photo-6395411.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Beautiful Gothic architecture and stunning stained glass windows in this historic church.',
      highlights: ['Gothic Architecture', 'Stained Glass', 'Religious History', 'Photography'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sacred+Heart+Basilica+Pondicherry',
    },
    // Day Trip (17-20 km)
    {
      id: 14,
      category: 'heritage',
      name: 'Pondicherry Museum',
      distance: '17 km',
      duration: '1 hr',
      rating: 4.3,
      image: 'https://images.pexels.com/photos/58599/pexels-photo-58599.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Rich collection of French colonial artifacts, sculptures, and historical portraits showcasing Pondicherry heritage.',
      highlights: ['Colonial Artifacts', 'Historical Portraits', 'Sculptures', 'French Heritage'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pondicherry+Museum',
    },
    {
      id: 15,
      category: 'nature',
      name: 'Botanical Gardens',
      distance: '18 km',
      duration: '2-3 hrs',
      rating: 4.2,
      image: 'https://images.pexels.com/photos/14024974/pexels-photo-14024974.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Lush 22-acre garden with exotic plants, musical fountain, toy train, and peaceful walking paths.',
      highlights: ['Exotic Plants', 'Musical Fountain', 'Toy Train', 'Picnic Spots'],
      price: 'Free',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Botanical+Gardens%2C+Pondicherry',
    },
  ];

  const filteredAttractions = selectedCategory === 'all'
    ? attractions
    : attractions.filter(attraction => attraction.category === selectedCategory);

  const itineraries = [
    {
      name: 'Beach & Nature Lover',
      description: 'Sun, sand, and serene lakes',
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      stops: [
        'Paradise Beach - Boat ride & morning swim (2-3 hrs)',
        'Ousteri Lake - Birdwatching & picnic lunch (2 hrs)',
        'Serenity Beach - Sunset views (1 hr)',
      ],
    },
    {
      name: 'Culture & Heritage Explorer',
      description: 'History, ruins, and colonial charm',
      gradient: 'from-orange-500 to-red-500',
      image: 'https://images.pexels.com/photos/1799730/pexels-photo-1799730.jpeg?auto=compress&cs=tinysrgb&w=800',
      stops: [
        'Arikamedu Ruins - Morning history walk (1 hr)',
        'Matrimandir - Auroville culture visit (2 hrs)',
        'Sri Aurobindo Ashram & Promenade - Afternoon stroll (2 hrs)',
      ],
    },
    {
      name: 'Spiritual & Wellness Seeker',
      description: 'Meditation, temples, and mindful dining',
      gradient: 'from-purple-500 to-pink-500',
      image: 'https://images.pexels.com/photos/3974244/pexels-photo-3974244.jpeg?auto=compress&cs=tinysrgb&w=800',
      stops: [
        'Sai Baba Temple - Morning prayers (30 min)',
        'Matrimandir - Meditation session (2 hrs)',
        'Sri Aurobindo Ashram - Quiet reflection (1 hr)',
        'Conscious Cafe - Vegan wellness lunch (1 hr)',
      ],
    },
  ];

  // Group attractions by distance zone for the "all" view
  const distanceZones = [
    { label: 'Walking Distance', subtitle: '0-2 km from resort', ids: [1, 2] },
    { label: 'Short Drive', subtitle: '2-10 km', ids: [16, 3, 4, 5, 17, 6] },
    { label: 'Medium Drive', subtitle: '10-20 km', ids: [7, 8, 9, 10, 11, 12, 13, 18, 19, 14, 15] },
  ];

  const renderAttractionCard = (attraction: typeof attractions[0]) => (
    <div key={attraction.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img
        src={attraction.image}
        alt={attraction.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {attraction.distance}
          </span>
          {attraction.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-slate-600">{attraction.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{attraction.name}</h3>
        <p className="text-slate-600 text-sm mb-4">{attraction.description}</p>

        <div className="flex items-center text-slate-500 text-sm mb-4">
          <Clock className="h-4 w-4 mr-1" />
          {attraction.duration}
          <span className="mx-2">&bull;</span>
          <span className="font-medium text-blue-600">{attraction.price}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {attraction.highlights.slice(0, 4).map((highlight, index) => (
            <div key={index} className="flex items-center text-xs text-slate-600">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
              {highlight}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <a
            href={attraction.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-lg transition-all duration-200"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <a
            href={attraction.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 border border-blue-600 text-blue-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            Maps
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-36 pb-12 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/1799730/pexels-photo-1799730.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Explore Pondicherry</h1>
          <p className="text-base sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Discover the rich cultural heritage, stunning beaches, and unique Franco-Tamil culture —
            all just minutes from St James Court Beach Resort
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-3 py-2 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Must-Visit Attractions</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Discover the best of Pondicherry&apos;s culture, history, and natural beauty
            </p>
          </div>

          {selectedCategory === 'all' ? (
            // Grouped by distance when showing all
            <div className="space-y-10 sm:space-y-12 lg:space-y-16">
              {distanceZones.map((zone) => {
                const zoneAttractions = attractions.filter(a => zone.ids.includes(a.id));
                if (zoneAttractions.length === 0) return null;
                return (
                  <div key={zone.label}>
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-slate-900">{zone.label}</h3>
                      <p className="text-slate-500">{zone.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {zoneAttractions.map(renderAttractionCard)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Flat grid when filtered by category
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredAttractions.map(renderAttractionCard)}
            </div>
          )}
        </div>
      </section>

      {/* Suggested Itineraries */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Suggested Day Itineraries</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Curated one-day plans to make the most of your stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {itineraries.map((itinerary, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                <div className="relative h-40 sm:h-44 lg:h-48">
                  <img src={itinerary.image} alt={itinerary.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent`}></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{itinerary.name}</h3>
                    <p className="text-white/80 text-sm">{itinerary.description}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="space-y-4">
                    {itinerary.stops.map((stop, stopIndex) => (
                      <div key={stopIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {stopIndex + 1}
                        </div>
                        <p className="text-sm text-slate-700">{stop}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Trip Packages */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Day Trip Packages</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Explore beyond Pondicherry with our curated day trip experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                name: 'Mahabalipuram Heritage Tour',
                distance: '~95 km via ECR',
                duration: 'Full day (7 AM - 7 PM)',
                image: 'https://images.pexels.com/photos/30312127/pexels-photo-30312127.jpeg?auto=compress&cs=tinysrgb&w=600',
                highlights: [
                  'Shore Temple (UNESCO, 8th century) - ₹40/₹600',
                  'Pancha Rathas (5 monolithic chariots)',
                  'Rock Cut Caves (Pallava sculptures)',
                  'Beach Resort Lunch (~₹500-800)',
                ],
                price: '₹2,200-2,800/person',
                bestTime: 'Oct-Mar',
                mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shore+Temple+Mahabalipuram',
              },
              {
                name: 'Pichavaram Mangroves & Chidambaram',
                distance: '~65 km via ECR South',
                duration: 'Full day',
                image: 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=600',
                highlights: [
                  'Pichavaram Mangrove Forest boat ride - ₹50-150/boat',
                  'Chidambaram Nataraja Temple (Pancha Bhuta Stalam) - Free',
                  'Porto Novo (Parangipettai) Beach viewpoint - Free',
                  'Fresh seafood lunch on ECR (~₹400)',
                ],
                price: '₹3,000-4,500/person',
                bestTime: 'Early morning for mangrove boat ride',
                mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pichavaram+Mangrove+Forest',
              },
              {
                name: 'Chidambaram & Kumbakonam',
                distance: '~120 km via NH32',
                duration: 'Full day',
                image: 'https://images.pexels.com/photos/33253295/pexels-photo-33253295.jpeg?auto=compress&cs=tinysrgb&w=600',
                highlights: [
                  'Nataraja Temple (1,000 pillar hall) - Free',
                  'Temple Architecture (5 elemental kosas)',
                  'Sarangapani Vishnu Temple, Kumbakonam',
                  'Temple tank aarti + Brass shopping',
                ],
                price: '₹2,600-3,000/person',
                bestTime: 'Nov-Feb',
                mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nataraja+Temple+Chidambaram',
              },
            ].map((trip, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 sm:p-5 lg:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{trip.name}</h3>
                  <div className="flex items-center text-slate-600 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.distance}
                    <span className="mx-2">&bull;</span>
                    <Clock className="h-4 w-4 mr-1" />
                    {trip.duration}
                  </div>

                  <div className="text-xs text-teal-700 font-medium mb-3">
                    Best: {trip.bestTime}
                  </div>

                  <div className="space-y-2 mb-4">
                    {trip.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-start text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">{trip.price}</span>
                    <a
                      href={trip.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200"
                    >
                      <Navigation className="h-4 w-4" />
                      View Route
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Transport Info</h3>
            <p className="text-sm text-slate-600">
              AC Innova/Xylo: ₹12-18/km (400-500 km tours) + Driver bata + Toll + Entries + Lunch.
              Contact resort desk for booking assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Cultural Experiences */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Cultural Experiences</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Immerse yourself in the unique Franco-Tamil culture of Pondicherry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-2 md:flex-col md:items-center md:gap-0">
                <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center md:mx-auto md:mb-4">
                  <Utensils className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 md:mb-2 md:text-center">Auroville Cafes</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4 md:text-center">
                Wood-fired pizzas, vegan bowls, and artisan coffee in Auroville&apos;s cozy cafes
              </p>
              <div className="md:text-center">
                <button onClick={() => setSelectedCategory('dining')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Explore Cafes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-2 md:flex-col md:items-center md:gap-0">
                <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-teal-500 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center md:mx-auto md:mb-4">
                  <Camera className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 md:mb-2 md:text-center">Beach Hopping</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4 md:text-center">
                From Paradise Beach boat rides to Serenity Beach sunsets
              </p>
              <div className="md:text-center">
                <button onClick={() => setSelectedCategory('beach')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  View Beaches
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-2 md:flex-col md:items-center md:gap-0">
                <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center md:mx-auto md:mb-4">
                  <Building className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 md:mb-2 md:text-center">Temple Trail</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4 md:text-center">
                From nearby Sai Baba Temple to the iconic Manakula Vinayagar
              </p>
              <div className="md:text-center">
                <button onClick={() => setSelectedCategory('temple')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  View Temples
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-2 md:flex-col md:items-center md:gap-0">
                <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center md:mx-auto md:mb-4">
                  <TreePine className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 md:mb-2 md:text-center">Nature Escapes</h3>
              </div>
              <p className="text-slate-600 text-sm mb-4 md:text-center">
                Birdwatching at Ousteri Lake and strolls through Botanical Gardens
              </p>
              <div className="md:text-center">
                <button onClick={() => setSelectedCategory('nature')} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Explore Nature
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;
