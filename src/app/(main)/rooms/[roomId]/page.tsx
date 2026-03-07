'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Users, Wifi, Coffee, Bath, Car, Utensils, Star, Calendar, Check, MapPin, Clock } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

const RoomDetail = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const roomsData = {
    'deluxe-room': {
      id: 'deluxe-room',
      name: 'Deluxe Room',
      price: 4500,
      weekendPrice: 5500,
      originalPrice: 6500,
      size: '350 sq ft',
      occupancy: 2,
      bedType: 'Twin Beds',
      images: [
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Our Deluxe Room offers a perfect blend of comfort and elegance with twin beds and a stunning Fenesta French window. Designed with colonial charm and modern amenities, this room provides a peaceful retreat after a day of exploring Pondicherry.',
      detailedDescription: 'Step into our beautifully appointed Deluxe Room, where French colonial architecture meets contemporary comfort. The room features twin beds with premium linens, ensuring a restful night\'s sleep. The highlight of the room is the elegant Fenesta French window that opens to reveal breathtaking views and fills the space with natural light. The room is thoughtfully designed with warm wood furnishings, local artwork, and modern amenities to create a welcoming atmosphere that reflects the unique character of Pondicherry.',
      features: [
        'Twin Beds with Premium Linens',
        'Fenesta French Window',
        'Air Conditioning',
        '24hrs Hot & Cold Water',
        'Complimentary WiFi',
        'Mini Refrigerator',
        'Tea/Coffee Making Facilities',
        'Daily Housekeeping'
      ],
      amenities: [
        { icon: <Wifi className="h-5 w-5" />, name: 'Free WiFi' },
        { icon: <Coffee className="h-5 w-5" />, name: 'Tea/Coffee Maker' },
        { icon: <Bath className="h-5 w-5" />, name: 'Private Bathroom' },
        { icon: <Car className="h-5 w-5" />, name: 'Parking' },
        { icon: <Utensils className="h-5 w-5" />, name: 'Room Service' }
      ],
      highlights: [
        'Perfect for couples or friends',
        'French colonial architecture',
        'Natural light throughout the day',
        'Quiet and peaceful environment',
        'Easy access to beach and French Quarter'
      ]
    },
    'super-deluxe': {
      id: 'super-deluxe',
      name: 'Super Deluxe',
      price: 5500,
      weekendPrice: 7000,
      originalPrice: 8000,
      size: '450 sq ft',
      occupancy: 2,
      bedType: 'King Size Bed',
      images: [
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Experience enhanced luxury in our Super Deluxe room featuring a king size bed and elegant cushion chair. The double glazing UPVC window ensures tranquility while the sophisticated decor creates an atmosphere of refined comfort.',
      detailedDescription: 'Our Super Deluxe room represents the perfect upgrade for discerning travelers seeking additional space and luxury. The centerpiece is a plush king size bed adorned with high-quality linens and multiple pillows for ultimate comfort. The room features an elegant cushion chair positioned perfectly for reading or enjoying the view through the double glazing UPVC window. The sophisticated interior design incorporates rich fabrics, tasteful artwork, and premium furnishings that reflect the French colonial heritage of Pondicherry while providing all modern conveniences.',
      features: [
        'King Size Bed with Luxury Linens',
        'Elegant Cushion Chair',
        'Curtains with Scallops',
        'Double Glazing UPVC Window',
        'Enhanced Air Conditioning',
        'Premium Bathroom Amenities',
        'Spacious Work Desk',
        'Complimentary Breakfast'
      ],
      amenities: [
        { icon: <Wifi className="h-5 w-5" />, name: 'High-Speed WiFi' },
        { icon: <Coffee className="h-5 w-5" />, name: 'Premium Coffee/Tea' },
        { icon: <Bath className="h-5 w-5" />, name: 'Luxury Bathroom' },
        { icon: <Car className="h-5 w-5" />, name: 'Valet Parking' },
        { icon: <Utensils className="h-5 w-5" />, name: '24/7 Room Service' }
      ],
      highlights: [
        'Spacious and luxurious',
        'Perfect for romantic getaways',
        'Enhanced privacy with double glazing',
        'Premium furnishings and decor',
        'Complimentary breakfast included'
      ]
    },
    'executive-suite': {
      id: 'executive-suite',
      name: 'Executive Suite Room',
      price: 6500,
      weekendPrice: 7450,
      originalPrice: 8450,
      size: '600 sq ft',
      occupancy: 2,
      bedType: 'King Size Bed',
      images: [
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=600'
      ],
      description: 'Indulge in ultimate luxury with our Executive Suite featuring a king size bed, luxurious cushion sofa, and private balcony. The suite includes both shower and bath tub facilities for a truly premium experience.',
      detailedDescription: 'Our Executive Suite Room represents the pinnacle of luxury accommodation at St James Court Beach Resort. This expansive suite features a separate living area with a luxurious cushion sofa, perfect for relaxation or entertaining. The bedroom area boasts a king size bed with the finest linens and multiple seating options. The crown jewel is the private balcony offering stunning views of the ocean or gardens, providing an intimate space to enjoy morning coffee or evening cocktails. The bathroom is a sanctuary of luxury featuring both a modern shower and a deep soaking bath tub, allowing guests to choose their preferred way to unwind.',
      features: [
        'King Size Bed with Premium Linens',
        'Separate Living Area',
        'Luxurious Cushion Sofa',
        'Private Balcony with Views',
        'Shower and Bath Tub',
        'Mini Bar',
        'Executive Work Station',
        'Complimentary Breakfast & Evening Snacks'
      ],
      amenities: [
        { icon: <Wifi className="h-5 w-5" />, name: 'Premium WiFi' },
        { icon: <Coffee className="h-5 w-5" />, name: 'Mini Bar & Coffee' },
        { icon: <Bath className="h-5 w-5" />, name: 'Luxury Bath & Shower' },
        { icon: <Car className="h-5 w-5" />, name: 'Priority Parking' },
        { icon: <Utensils className="h-5 w-5" />, name: 'Priority Room Service' }
      ],
      highlights: [
        'Most spacious accommodation',
        'Private balcony with stunning views',
        'Separate living and sleeping areas',
        'Luxury bathroom with tub',
        'Perfect for special occasions'
      ]
    }
  };

  const room = roomsData[roomId as keyof typeof roomsData];

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Room Not Found</h1>
          <Link href="/rooms" className="text-blue-600 hover:text-blue-700">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-40 pb-8 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/rooms"
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to All Rooms
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">{room.name}</h1>
              <p className="text-xl mb-6 opacity-90">{room.description}</p>
              <div className="flex items-center space-x-6 text-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Up to {room.occupancy} guests
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {room.size}
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold mb-2">₹{room.price.toLocaleString()}</div>
                <div className="text-white/80">per night (Mon-Thu)</div>
              </div>
              <div className="text-center mb-6">
                <div className="text-xl font-semibold text-green-200">₹{room.weekendPrice.toLocaleString()}</div>
                <div className="text-white/80 text-sm">per night (Fri-Sun)</div>
              </div>
              <Link
                href="/booking"
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book This Room
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <img
                  src={room.images[selectedImage]}
                  alt={`${room.name} - Image ${selectedImage + 1}`}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="space-y-4">
                {room.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index + 1}
                    src={image}
                    alt={`${room.name} - Thumbnail ${index + 2}`}
                    onClick={() => setSelectedImage(index + 1)}
                    className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedImage === index + 1
                        ? 'ring-4 ring-blue-500 shadow-lg'
                        : 'hover:shadow-md opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Room Details */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Room Description</h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  {room.detailedDescription}
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mb-6">Room Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose This Room</h3>
                <div className="space-y-3">
                  {room.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <Star className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-32">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Room Amenities</h3>
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

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-slate-900 mb-4">Pricing</h4>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Monday - Thursday:</span>
                        <span className="font-semibold">₹{room.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Friday - Sunday:</span>
                        <span className="font-semibold text-green-600">₹{room.weekendPrice.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-500">*Prices exclude 12% GST</div>
                    </div>

                    <Link
                      href="/booking"
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Now
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Check-in/Check-out</h3>
                <p className="text-slate-600 text-sm">Check-in: 3:00 PM<br />Check-out: 11:00 AM</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <Car className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Free Parking</h3>
                <p className="text-slate-600 text-sm">Complimentary parking available for all guests</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                <Utensils className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dining</h3>
                <p className="text-slate-600 text-sm">24/7 room service and multiple dining options</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;
