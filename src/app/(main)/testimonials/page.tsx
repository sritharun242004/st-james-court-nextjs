'use client';

import React, { useState } from 'react';
import { Star, Quote, ThumbsUp, Camera, Heart, Users, Calendar, MapPin } from 'lucide-react';

const Testimonials = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', name: 'All Reviews' },
    { id: 'recent', name: 'Recent' },
    { id: 'families', name: 'Families' },
    { id: 'couples', name: 'Couples' },
    { id: 'business', name: 'Business' },
    { id: 'events', name: 'Events' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah & Michael Thompson',
      location: 'London, UK',
      category: 'couples',
      rating: 5,
      date: '2024-01-15',
      stay_duration: '7 nights',
      room_type: 'French Colonial Suite',
      occasion: 'Honeymoon',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Our honeymoon at St James Court was absolutely magical! The beachfront location is breathtaking, and the French colonial architecture creates such a romantic atmosphere. The staff went above and beyond to make our stay special - from the rose petals on our bed to the private beach dinner. The spa treatments were incredible, and we loved exploring the French Quarter. We can\'t wait to return for our anniversary!',
      highlights: ['Romantic atmosphere', 'Exceptional service', 'Beautiful architecture', 'Private beach dinner'],
      verified: true,
      helpful_votes: 42
    },
    {
      id: 2,
      name: 'The Sharma Family',
      location: 'Mumbai, India',
      category: 'families',
      rating: 5,
      date: '2024-01-08',
      stay_duration: '5 nights',
      room_type: 'Family Suite Beachfront',
      occasion: 'Family Vacation',
      image: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Perfect family getaway! The kids absolutely loved the beach access and the kids\' club activities. Our family suite was spacious and comfortable with stunning ocean views. The French-Indian fusion cuisine was delicious - something for everyone in the family. The staff was incredibly patient and helpful with our children. The location is perfect for exploring Pondicherry\'s cultural sites. Highly recommend for families!',
      highlights: ['Kid-friendly facilities', 'Spacious family rooms', 'Great food variety', 'Cultural activities'],
      verified: true,
      helpful_votes: 38
    },
    {
      id: 3,
      name: 'Marie Dubois',
      location: 'Paris, France',
      category: 'couples',
      rating: 5,
      date: '2024-01-02',
      stay_duration: '4 nights',
      room_type: 'Ocean View Deluxe',
      occasion: 'Cultural Tourism',
      image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'As a French traveler, I was delighted to find such an authentic blend of French and Indian cultures. The colonial architecture reminded me of home while the Indian hospitality was incredibly warm. Le Jardin restaurant serves exceptional French cuisine with local twists. The location in the French Quarter is perfect for walking tours. The sunset views from my balcony were unforgettable. Merci beaucoup for a wonderful stay!',
      highlights: ['Authentic French-Indian fusion', 'Prime location', 'Excellent cuisine', 'Cultural authenticity'],
      verified: true,
      helpful_votes: 29
    },
    {
      id: 4,
      name: 'David & Jennifer Kim',
      location: 'Seoul, South Korea',
      category: 'couples',
      rating: 4,
      date: '2023-12-28',
      stay_duration: '6 nights',
      room_type: 'Couples\' Retreat',
      occasion: 'Anniversary',
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Beautiful resort with amazing ocean views! We celebrated our 5th anniversary here and it was perfect. The couples\' massage at the spa was incredibly relaxing. The private jacuzzi in our room was a nice touch. The beach is pristine and perfect for romantic walks. Only minor issue was the WiFi speed, but honestly, it was nice to disconnect and enjoy each other\'s company. Would definitely recommend for couples.',
      highlights: ['Romantic setting', 'Excellent spa', 'Beautiful beach', 'Privacy'],
      verified: true,
      helpful_votes: 31
    },
    {
      id: 5,
      name: 'TechCorp India Team',
      location: 'Bangalore, India',
      category: 'business',
      rating: 5,
      date: '2023-12-20',
      stay_duration: '3 nights',
      room_type: 'Various rooms',
      occasion: 'Corporate Retreat',
      image: 'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Outstanding venue for our annual corporate retreat! The conference facilities are modern and well-equipped. The team building activities on the beach were a huge hit with everyone. The variety of dining options kept our diverse team happy. The location allowed for great cultural experiences during free time. Event coordination was flawless - everything ran smoothly. Our team is already asking when we can return!',
      highlights: ['Modern facilities', 'Team building options', 'Diverse dining', 'Excellent coordination'],
      verified: true,
      helpful_votes: 25
    },
    {
      id: 6,
      name: 'Priya & Arjun Wedding',
      location: 'Chennai, India',
      category: 'events',
      rating: 5,
      date: '2023-12-15',
      stay_duration: '3 nights',
      room_type: 'Presidential Villa',
      occasion: 'Beach Wedding',
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Our dream beach wedding came true at St James Court! The beach pavilion was decorated beautifully, and the sunset ceremony was absolutely magical. The wedding coordination team handled every detail perfectly. Our guests loved the accommodation options and the food was exceptional. The photography locations around the resort are stunning. Thank you for making our special day unforgettable. Every couple should consider this venue!',
      highlights: ['Perfect wedding venue', 'Excellent coordination', 'Beautiful decorations', 'Great photography spots'],
      verified: true,
      helpful_votes: 47
    },
    {
      id: 7,
      name: 'Roberto & Isabella Martinez',
      location: 'Barcelona, Spain',
      category: 'couples',
      rating: 4,
      date: '2023-12-10',
      stay_duration: '8 nights',
      room_type: 'Ocean View Deluxe',
      occasion: 'Extended Vacation',
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Lovely resort with a unique character! The French colonial influence is charming and the Indian hospitality is genuine. We enjoyed the daily yoga sessions and the water sports activities. The location is perfect for exploring both the beach and the cultural attractions. The food variety was excellent, though we wished for more European breakfast options. Overall, a wonderful experience that we would recommend to other European travelers.',
      highlights: ['Unique cultural blend', 'Good activities', 'Great location', 'Genuine hospitality'],
      verified: true,
      helpful_votes: 22
    },
    {
      id: 8,
      name: 'The Wilson Family',
      location: 'Melbourne, Australia',
      category: 'families',
      rating: 5,
      date: '2023-12-05',
      stay_duration: '10 nights',
      room_type: 'Two Family Suites',
      occasion: 'Extended Family Vacation',
      image: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150',
      review: 'Incredible experience for our extended family vacation! Three generations stayed together and everyone had a fantastic time. The kids loved the beach activities and kids\' club, teenagers enjoyed the water sports, and grandparents loved the peaceful spa and cultural tours. The family suites were perfect for our needs. The staff was so accommodating with special dietary requirements. India\'s culture came alive through the resort\'s programs. Unforgettable memories!',
      highlights: ['Multi-generational appeal', 'Accommodating staff', 'Cultural programs', 'Perfect family facilities'],
      verified: true,
      helpful_votes: 35
    }
  ];

  const filteredTestimonials = selectedFilter === 'all'
    ? testimonials
    : testimonials.filter(testimonial => testimonial.category === selectedFilter ||
      (selectedFilter === 'recent' && new Date(testimonial.date) > new Date('2024-01-01')));

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating =>
    testimonials.filter(t => t.rating === rating).length
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-52 pb-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-8">Guest Reviews & Testimonials</h1>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed">
            Discover what our guests say about their unforgettable experiences at
            St James Court Beach Resort
          </p>
        </div>
      </section>

      {/* Rating Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="text-6xl font-bold text-blue-600 mr-4">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <div className="text-slate-600">Based on {totalReviews} reviews</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm text-slate-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 mx-3">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(ratingDistribution[index] / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-8">{ratingDistribution[index]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-slate-600">Would Recommend</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.8/5</div>
                <div className="text-sm text-slate-600">Service Rating</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">4.9/5</div>
                <div className="text-sm text-slate-600">Location Rating</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4.7/5</div>
                <div className="text-sm text-slate-600">Value Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-slate-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{testimonial.name}</h3>
                        <div className="flex items-center text-slate-600 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {testimonial.location}
                          {testimonial.verified && (
                            <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              Verified Stay
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center mt-2 sm:mt-0">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-2 text-slate-600 text-sm">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-1 text-blue-600" />
                        {testimonial.stay_duration}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Users className="h-4 w-4 mr-1 text-blue-600" />
                        {testimonial.room_type}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Heart className="h-4 w-4 mr-1 text-blue-600" />
                        {testimonial.occasion}
                      </div>
                      <div className="flex items-center text-slate-600">
                        <ThumbsUp className="h-4 w-4 mr-1 text-blue-600" />
                        {testimonial.helpful_votes} helpful
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
                      <p className="text-slate-700 leading-relaxed indent-6">
                        {testimonial.review}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {testimonial.highlights.map((highlight, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful ({testimonial.helpful_votes})
                      </button>
                      <div className="text-slate-400 text-sm">
                        Stayed in {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-slate-600">
              Our commitment to excellence has been recognized by leading travel organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">TripAdvisor</h3>
              <div className="text-sm text-slate-600">Travelers' Choice 2024</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Booking.com</h3>
              <div className="text-sm text-slate-600">Guest Review Award 2024</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Condé Nast</h3>
              <div className="text-sm text-slate-600">Top Beach Resort India</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Travel + Leisure</h3>
              <div className="text-sm text-slate-600">Best Resort Staff 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Share Your Experience</h2>
          <p className="text-xl mb-8">
            Help future guests by sharing your experience at St James Court Beach Resort
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 inline-flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Write a Review
          </button>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;