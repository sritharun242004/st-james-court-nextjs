'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Calendar, Waves, Utensils, Sparkles, MapPin, Phone, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';

const Home = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Handle form submission
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const features = [
    {
      icon: <Waves className="h-5 w-5 sm:h-8 sm:w-8" />,
      title: "Beachfront Access",
      description: "Direct access to pristine sandy beaches"
    },
    {
      icon: <Utensils className="h-5 w-5 sm:h-8 sm:w-8" />,
      title: "Fine Dining",
      description: "French-Indian fusion cuisine & local delicacies"
    },
    {
      icon: <Sparkles className="h-5 w-5 sm:h-8 sm:w-8" />,
      title: "Lawn",
      description: "Refreshing natural open lawn for events"
    },
    {
      icon: <Users className="h-5 w-5 sm:h-8 sm:w-8" />,
      title: "Event Spaces",
      description: "Perfect venues for weddings & celebrations"
    }
  ];

  const testimonials = [
    {
      name: "Ananya & Vikram Nair",
      location: "Kochi, Kerala",
      rating: 5,
      text: "An absolutely magical experience! The beachfront location and French colonial charm made our honeymoon unforgettable."
    },
    {
      name: "Rajesh Venkataraman",
      location: "Mumbai, India",
      rating: 5,
      text: "Perfect blend of luxury and local culture. The staff went above and beyond to make our family vacation special."
    },
    {
      name: "Deepika & Suresh Iyer",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      text: "Felt like home away from home with the beautiful French architecture and warm Indian hospitality."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden px-4"
        initial={mounted ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <motion.div
          className="relative z-10 text-center text-white max-w-4xl mx-auto"
          initial={mounted ? { y: 50, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-4 sm:mb-6 lg:mb-8 mt-4 sm:mt-6 lg:mt-16"
            initial={mounted ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
            St James Court
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mt-2">Beach Resort</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-2xl mb-8 opacity-90">
            Where Tranquility Meets the Sea
          </p>
          <p className="text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto opacity-80">
            Experience luxury beachfront hospitality on Pondicherry's East Coast Road,
            the only resort right on the beach.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={mounted ? { y: 30, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link
              href="/booking"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              Book Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/rooms"
              className="border-2 border-white text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center"
            >
              View Rooms
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Experience Luxury by the Sea
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the perfect blend of French colonial elegance and Indian warmth
              at our premier beachfront resort in Pondicherry.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-8">
            {features.map((feature, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.1}
                className="p-3 sm:p-5 lg:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-teal-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-2 md:flex-col md:items-center md:gap-0">
                  <div className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full md:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm sm:text-lg md:text-xl font-playfair font-semibold text-slate-900 md:mb-2 md:text-center">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base md:text-center">
                  {feature.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Room Booking Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Book Your Perfect Stay
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose your dates and find the perfect room for your beachfront getaway
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-6">Quick Booking</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Adults</label>
                      <select className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>1 Adult</option>
                        <option>2 Adults</option>
                        <option>3 Adults</option>
                        <option>4+ Adults</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Children</label>
                      <select className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>0 Children</option>
                        <option>1 Child</option>
                        <option>2 Children</option>
                        <option>3+ Children</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Room Type</label>
                    <select className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Any Room Type</option>
                      <option>Deluxe Room</option>
                      <option>Super Deluxe</option>
                      <option>Executive Suite Room</option>
                    </select>
                  </div>

                  <Link
                    href="/booking"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Check Availability
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Star className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Best Rate Guarantee</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Book directly with us for the best rates and exclusive perks
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Free Cancellation</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Cancel up to 48 hours before arrival with no penalty
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-slate-900">Exclusive Amenities</h4>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Complimentary breakfast, WiFi, and airport transfers included
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Resort Gallery */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="flex justify-center mb-6">
              <div className="rounded-xl shadow-lg">
                <img
                  src="/logo.jpeg"
                  alt="St James Court Beach Resort Logo"
                  className="h-28 w-28 rounded-xl object-contain"
                />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">Resort Gallery</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the beauty and elegance of St James Court Beach Resort through our curated collection of images
            </p>
          </AnimatedSection>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-3 md:gap-4 md:h-[700px]">
            {/* Main large image - spans 2x2 */}
            <AnimatedSection className="col-span-2 h-44 sm:h-56 md:h-auto md:row-span-2 relative group overflow-hidden rounded-2xl shadow-xl">
              <img
                src="/images/gallery/gallery-1.jpg"
                alt="St James Court Beach Resort Grounds"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-3xl font-playfair font-bold mb-3">Beachfront Paradise</h3>
                  <p className="text-lg opacity-90">Where pristine beaches meet luxury hospitality</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Sea View Rooms */}
            <AnimatedSection delay={0.1} className="col-span-1 h-32 sm:h-40 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/rooms/super-deluxe/super-deluxe-balcony-sea-view.jpg"
                alt="Sea View Balcony Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Sea View Rooms</h4>
                  <p className="text-xs opacity-90">Luxury accommodations</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Beachside Dining */}
            <AnimatedSection delay={0.2} className="col-span-1 h-32 sm:h-40 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/dining/dining-4.jpg"
                alt="Beachside Dining"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Sea Queen Restaurant</h4>
                  <p className="text-xs opacity-90">Multi-cuisine dining</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Pool */}
            <AnimatedSection delay={0.3} className="col-span-1 h-32 sm:h-40 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/gallery/gallery-20.jpg"
                alt="Resort Swimming Pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Swimming Pool</h4>
                  <p className="text-xs opacity-90">Refreshing retreat</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Pool & Guests */}
            <AnimatedSection delay={0.4} className="col-span-1 h-32 sm:h-40 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/gallery/gallery-26.jpeg"
                alt="Guests at the Pool"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Pool & Recreation</h4>
                  <p className="text-xs opacity-90">Fun in the sun</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Beach Celebrations */}
            <AnimatedSection delay={0.5} className="col-span-1 h-36 sm:h-44 md:col-span-2 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/events/beach-engagement-2.jpeg"
                alt="Beach Celebrations"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Beach Celebrations</h4>
                  <p className="text-xs opacity-90">Dream events by the sea</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Resort Exterior */}
            <AnimatedSection delay={0.6} className="col-span-1 h-36 sm:h-44 md:col-span-2 md:h-auto md:row-span-1 relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="/images/gallery/resort-exterior-1.jpg"
                alt="Resort Exterior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold text-sm">Resort Grounds</h4>
                  <p className="text-xs opacity-90">Scenic beachfront property</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="flex items-center mb-6">
                <div className=" rounded-xl shadow-lg mr-4">
                  <img
                    src="/logo.jpeg"
                    alt="St James Court Beach Resort Logo"
                    className="h-16 w-16 rounded-xl object-contain"
                  />
                </div>
                <div className="h-px bg-gradient-to-r from-blue-600 to-teal-500 flex-1"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-6">
                A Heritage of Hospitality
              </h2>
              <p className="text-sm sm:text-lg text-slate-600 mb-6">
                Situated on Pondicherry's East Coast Road in Chinna Kalapet, St James Court Beach Resort
                is the only resort in Pondicherry right on the beach. A unit of the NTS Group — established
                in 1998 with over 25 years of excellence in hospitality — we offer world-class amenities
                and warm Indian hospitality.
              </p>
              <p className="text-sm sm:text-lg text-slate-600 mb-8">
                From our pristine beachfront overlooking the Bay of Bengal to our 40 elegantly
                designed rooms and suites, 3 restaurants, and 2 event venues, every detail has
                been crafted to ensure an unforgettable stay.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </AnimatedSection>
            <AnimatedSection direction="right" className="relative">
              <img
                src="https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Resort Architecture"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-3 sm:p-6 rounded-lg shadow-lg">
                <div className="text-xl sm:text-3xl font-bold text-blue-600">25+</div>
                <div className="text-slate-600">Years of Excellence</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Discover why travelers from around the world choose St James Court
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.2}
                className="bg-gradient-to-br from-blue-50 to-teal-50 p-3 sm:p-5 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-4 italic text-sm sm:text-base">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-slate-600 text-xs sm:text-sm">{testimonial.location}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.6}>
            <a
              href="https://www.google.com/maps/place/St.+James+Court+Beach+Resort+in+Pondicherry/@12.014554,79.86009,16z/data=!4m11!3m10!1s0x3a53644f0648516b:0xd827eb825b2dce23!5m2!4m1!1i2!8m2!3d12.0145542!4d79.8600897!9m1!1b1!16s%2Fg%2F1tf5zqh9?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Read More Reviews
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Get answers to common questions about your stay at St James Court Beach Resort
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        What are your check-in and check-out times?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        Do you provide airport transportation?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            Yes, we offer complimentary airport pickup and drop-off service from Puducherry Airport. Please inform us 24 hours in advance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        What dining options are available?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            We have 3 dining venues — Sea Queen (family restaurant), Sea Breeze (beachfront open air), and The Ocean (bar & restaurant) — plus 24/7 room service.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        Is WiFi available throughout the resort?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            Yes, complimentary high-speed WiFi is available throughout the resort, including all rooms and common areas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        Are pets allowed at the resort?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            Currently, we do not allow pets at the resort, with the exception of certified service animals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="p-3 sm:p-5 lg:p-6 cursor-pointer">
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        What activities are available for children?
                      </h3>
                      <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500 ease-in-out">
                        <div className="pt-4 border-t border-slate-100 mt-4">
                          <p className="text-slate-600 text-sm">
                            We offer a kids' club with supervised activities, children's pool, playground, and special children's menu at our restaurants.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection className="text-center mt-12" delay={0.4}>
              <Link
                href="/faq"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View All FAQs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-12 sm:py-16 lg:py-20 relative"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
          initial={mounted ? { y: 50, opacity: 0 } : false}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl sm:text-3xl md:text-5xl font-playfair font-bold text-white mb-6">
            Ready for Your Perfect Getaway?
          </h2>
          <p className="text-sm sm:text-lg lg:text-xl text-white/90 mb-8">
            Book your stay at St James Court Beach Resort and create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Stay
            </Link>
            <a
              href="#contact"
              className="border-2 border-white text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center"
            >
              Get in Touch
            </a>
          </div>
        </motion.div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">
              Luxurious Accommodations
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our collection of elegantly appointed rooms and suites,
              each designed to provide comfort and stunning views
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/rooms/deluxe/deluxe-room-1.jpg"
                alt="Deluxe Room"
                className="w-full h-40 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-base sm:text-xl font-playfair font-bold mb-2">Deluxe Room</h3>
                  <p className="text-sm mb-3">Twin beds with Fenesta French window and modern amenities</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">₹4,500/night</span>
                    <Link
                      href="/rooms/deluxe-room"
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/rooms/super-deluxe/super-deluxe-balcony-sea-view.jpg"
                alt="Super Deluxe"
                className="w-full h-40 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-base sm:text-xl font-playfair font-bold mb-2">Super Deluxe</h3>
                  <p className="text-sm mb-3">King size bed with cushion chair and premium amenities</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">₹5,500/night</span>
                    <Link
                      href="/rooms/super-deluxe"
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <img
                src="/images/rooms/suite/suite-room-1.jpg"
                alt="Executive Suite Room"
                className="w-full h-40 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-base sm:text-xl font-playfair font-bold mb-2">Executive Suite Room</h3>
                  <p className="text-sm mb-3">Premium suite with private balcony and luxurious amenities</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">₹6,500/night</span>
                    <Link
                      href="/rooms/executive-suite"
                      className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="text-center mt-12" delay={0.6}>
            <Link
              href="/rooms"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Rooms
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Dining Experience Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-6">
                Culinary Excellence
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Savour an array of multi-cuisine delicacies across our three distinctive restaurants.
                From fresh seafood caught daily to traditional South Indian favourites, every meal
                is a celebration of flavours.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-slate-700">Sea Queen — Family Restaurant (Multi-Cuisine)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-slate-700">Sea Breeze — Beachfront Open Air Dining</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-slate-700">The Ocean — Bar & Restaurant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-slate-700">24/7 Room Service — Dining at Your Convenience</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Fine Dining Experience"
                className="rounded-lg shadow-xl"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Ready to plan your perfect beachfront getaway? Contact us today and let us help you create unforgettable memories.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form */}
            <AnimatedSection direction="left">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
                <h3 className="text-xl sm:text-2xl font-playfair font-bold text-slate-900 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-2.5 sm:p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.name ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-2.5 sm:p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 sm:p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject *"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-2.5 sm:p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        validationErrors.subject ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </div>

                  <textarea
                    name="message"
                    placeholder="Your Message *"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      validationErrors.message ? 'border-red-500' : 'border-slate-300'
                    }`}
                  ></textarea>

                  {Object.keys(validationErrors).length > 0 && (
                    <div className="text-red-500 text-sm">
                      Please correct the errors above.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-5 py-2.5 sm:px-8 sm:py-4 text-sm sm:text-lg rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </AnimatedSection>

            {/* Contact Information */}
            <AnimatedSection direction="right">
              <div className="space-y-4 sm:space-y-8">
                {/* Call Us */}
                <div className="bg-white rounded-xl shadow-lg px-4 py-3 sm:px-8 sm:py-5">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-2 sm:p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900">Call Us</h3>
                      <p className="text-slate-600 text-sm sm:text-base">+91 94432 52776</p>
                      <p className="text-slate-600 text-sm sm:text-base">+91 94432 52777 (Reservations)</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919443252776"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </a>
                </div>

                {/* Email Us */}
                <div className="bg-white rounded-xl shadow-lg px-4 py-3 sm:px-8 sm:py-5">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-2 sm:p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900">Email Us</h3>
                      <p className="text-slate-600 text-sm sm:text-base">Reservation@stjamescourtbeachresort.com</p>
                    </div>
                  </div>
                  <a
                    href="mailto:Reservation@stjamescourtbeachresort.com"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                </div>

                {/* Visit Us */}
                <div className="bg-white rounded-xl shadow-lg px-4 py-3 sm:px-8 sm:py-5">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-2 sm:p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-slate-900">Visit Us</h3>
                      <p className="text-slate-600 text-sm sm:text-base">State Highway 49, opp. Pondicherry Engg. College,</p>
                      <p className="text-slate-600 text-sm sm:text-base">Chinna Kalapet, Puducherry 605014, India</p>
                    </div>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/nBSzW6Xhiu3XetNK6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;