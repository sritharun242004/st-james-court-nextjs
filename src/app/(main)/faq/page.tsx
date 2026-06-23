'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'booking', name: 'Booking & Reservations' },
    { id: 'checkin', name: 'Check-in & Check-out' },
    { id: 'amenities', name: 'Amenities & Services' },
    { id: 'dining', name: 'Dining' },
    { id: 'activities', name: 'Activities' },
    { id: 'policies', name: 'Policies' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'booking',
      question: 'How can I make a reservation at St James Court Beach Resort?',
      answer: 'You can make a reservation through our website using our online booking system, by calling our reservations team at +91 9443252776, or by emailing Reservation@stjamescourtbeachresort.com. We recommend booking in advance, especially during peak season (December-February).'
    },
    {
      id: 2,
      category: 'booking',
      question: 'What is your cancellation policy?',
      answer: 'Our cancellation policy requires a minimum of 96 hours (4 days) notice before your scheduled check-in date. Cancellations made within 96 hours of check-in will incur a full one-night charge with no refund. Cancellations made more than 96 hours in advance will receive a 50% refund of the total booking amount. Special event packages may have separate terms — please confirm at the time of booking.'
    },
    {
      id: 3,
      category: 'checkin',
      question: 'What are your check-in and check-out times?',
      answer: 'Check-in time is 1:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability. We offer complimentary luggage storage if you arrive before check-in time or need to leave after check-out.'
    },
    {
      id: 4,
      category: 'amenities',
      question: 'What are the room rates?',
      answer: 'Weekday rates (Mon–Thu): Deluxe Room ₹4,500+tax, Super Deluxe ₹5,500+tax, Executive Suite ₹6,500+tax, Extra Person ₹1,000+tax. Weekend rates (Fri–Sun & Holidays): Deluxe Room ₹5,500+tax, Super Deluxe ₹6,500+tax, Executive Suite ₹7,500+tax, Extra Person ₹1,500+tax. Note: Deluxe Room does not include a refrigerator.'
    },
    {
      id: 5,
      category: 'dining',
      question: 'Are there vegetarian and vegan dining options available?',
      answer: 'Absolutely! All our restaurants offer extensive vegetarian options, and we can accommodate vegan dietary requirements with advance notice. Our chefs are experienced in preparing delicious plant-based versions of both French and Indian dishes. Please inform us of any dietary restrictions when making your reservation.'
    },
    {
      id: 6,
      category: 'amenities',
      question: 'Is WiFi available throughout the resort?',
      answer: 'Yes, complimentary high-speed WiFi is available throughout the resort, including all rooms, restaurants, common areas, and outdoor spaces. We also have a business center with computers and printing facilities for our guests.'
    },
    {
      id: 7,
      category: 'activities',
      question: 'What outdoor and recreational activities are available?',
      answer: 'We offer a wide range of activities including beach access until 7:30 PM, swimming pool usage until 7:30 PM, outdoor games (Cricket, Volleyball & Football), indoor games (Carrom & Chess), lawn area access, and children\'s play area. Our front office team is available 24/7 to assist with activity bookings and any special arrangements.'
    },
    {
      id: 8,
      category: 'policies',
      question: 'What is your policy regarding children?',
      answer: 'Children are very welcome at our resort! Kids under 5 stay free when sharing a room with parents. We have a dedicated children\'s play area available to all guests. Baby cots and high chairs are available upon request. Our front office team is happy to assist with any special arrangements for families.'
    },
    {
      id: 9,
      category: 'booking',
      question: 'Do you host events, parties, and corporate meetings?',
      answer: 'Absolutely! We specialise in all types of events — weddings, birthday parties, anniversary celebrations, corporate meetings, team outings, product launches, and more. Our dedicated event spaces (House of Lords Conference Hall and Royal Castle Board Room) can be configured for any occasion. Our event planning team will work with you to create a fully customised experience. Contact us for detailed packages and pricing.'
    },
    {
      id: 10,
      category: 'amenities',
      question: 'Is there a spa at the resort?',
      answer: 'Yes, our Ayurvedic spa offers a range of traditional and modern treatments including massages, facials, body treatments, and wellness therapies. The spa is open from 9:00 AM to 8:00 PM, and we recommend booking treatments in advance. Couples\' massage rooms are also available.'
    },
    {
      id: 11,
      category: 'checkin',
      question: 'What documents do I need for check-in?',
      answer: 'All guests must provide a valid government-issued photo ID (passport for international guests, driver\'s license or Aadhaar card for Indian nationals) at check-in. For international guests, we also require visa documentation. If booking for others, the person checking in must have authorization and ID for all guests.'
    },
    {
      id: 12,
      category: 'activities',
      question: 'Are there cultural tours and experiences available?',
      answer: 'Yes, we offer guided tours of Pondicherry\'s French Quarter, visits to local markets, cooking classes featuring French-Indian fusion cuisine, and day trips to nearby attractions like Auroville and Mahabalipuram. Our concierge can help arrange these experiences based on your interests.'
    },
    {
      id: 13,
      category: 'policies',
      question: 'Is smoking allowed at the resort?',
      answer: 'St James Court Beach Resort is a smoke-free property. Smoking is not permitted in any indoor areas including rooms, restaurants, and common spaces. Designated smoking areas are available in outdoor locations. We appreciate your cooperation in maintaining a healthy environment for all guests.'
    },
    {
      id: 14,
      category: 'amenities',
      question: 'Do you have facilities for differently-abled guests?',
      answer: 'Yes, we are committed to accessibility. We have wheelchair-accessible rooms, ramps throughout the property, accessible bathrooms, and elevator access to all floors. Our staff is trained to assist guests with special needs. Please inform us of any specific requirements when booking.'
    },
    {
      id: 15,
      category: 'policies',
      question: 'What is your pet policy?',
      answer: 'Pets are welcome at St James Court Beach Resort with prior notice! A pet surcharge applies per stay to cover additional cleaning and care provisions. Please inform us at the time of booking so we can make suitable arrangements. Pets must be kept on a leash in common areas and are not permitted in the restaurant or pool zones. Certified service animals are always welcome at no additional charge.'
    },
    {
      id: 16,
      category: 'dining',
      question: 'Is liquor available at the resort?',
      answer: 'Yes, liquor is available at The Ocean Bar & Restaurant at MRP (Maximum Retail Price). Please note that outside food and liquor brought from outside the resort are strictly not allowed on the premises.'
    },
    {
      id: 17,
      category: 'amenities',
      question: 'What front office and security services are available?',
      answer: 'Our front office and security team operates 24 hours a day, 7 days a week. Services include guest assistance, luggage handling, concierge support, power backup, and round-the-clock security with CCTV surveillance throughout the property.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-28 pb-8 sm:pt-44 sm:pb-16 lg:pt-52 lg:pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-bold mb-4 sm:mb-6 lg:mb-8">Frequently Asked Questions</motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about your stay at St James Court Beach Resort.
            Can&apos;t find what you&apos;re looking for? Our team is here to help!
          </motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Search & Filter */}
      <section className="py-8 bg-resort-cream border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'glass-card text-slate-700 hover:bg-white/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={fadeInUp}
                custom={index}
                className="glass-card rounded-2xl shadow-resort overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-3 py-3 sm:px-6 sm:py-5 lg:py-6 text-left flex items-center justify-between hover:bg-blue-50/30 transition-colors duration-200 cursor-pointer"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-blue-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItem === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {openItem === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 sm:px-6 sm:pb-6">
                        <div className="border-t border-sand-200 pt-4">
                          <p className="text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <HelpCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No FAQs found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Quick Help Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Need More Help?</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-lg lg:text-xl text-slate-600 mt-4">
              Our friendly team is available 24/7 to assist you with any questions
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <motion.div variants={fadeInUp} custom={0} whileHover={{ y: -6 }} className="text-center p-5 sm:p-6 lg:p-8 glass-card bg-blue-50/40 rounded-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3">Call Us</h3>
              <p className="text-slate-600 mb-4">
                Speak directly with our guest services team
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div>General: +91 413 123 4567</div>
                <div>Reservations: +91 413 123 4568</div>
              </div>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 cursor-pointer">
                Call Now
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1} whileHover={{ y: -6 }} className="text-center p-5 sm:p-6 lg:p-8 glass-card bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3">Email Us</h3>
              <p className="text-slate-600 mb-4">
                Send us your questions and we&apos;ll respond promptly
              </p>
              <div className="text-sm text-slate-700 mb-4">
                Reservation@stjamescourtbeachresort.com
              </div>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 cursor-pointer">
                Send Email
              </motion.button>
            </motion.div>

            <motion.div variants={fadeInUp} custom={2} whileHover={{ y: -6 }} className="text-center p-5 sm:p-6 lg:p-8 glass-card bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3">Live Chat</h3>
              <p className="text-slate-600 mb-4">
                Get instant answers through our live chat support
              </p>
              <div className="text-sm text-slate-700 mb-4">
                Available 24/7
              </div>
              <motion.button whileHover={{ scale: 1.05, y: -2 }} className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 cursor-pointer">
                Start Chat
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WaveDivider fill="#f8f6f3" />

      {/* Common Topics */}
      <section className="py-12 sm:py-16 lg:py-20 bg-resort-pearl">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <motion.h2 variants={fadeInUp} custom={0} className="text-xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-4">Popular Topics</motion.h2>
            <GoldSeparator />
            <motion.p variants={fadeInUp} custom={1} className="text-sm sm:text-lg lg:text-xl text-slate-600 mt-4">
              Quick access to our most frequently asked questions
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {[
              { title: 'Booking & Reservations', desc: 'Questions about making reservations, cancellations, and booking policies', count: '5 articles' },
              { title: 'Resort Amenities', desc: 'Information about spa, pools, dining, and other resort facilities', count: '8 articles' },
              { title: 'Activities & Tours', desc: 'Details about water sports, cultural tours, and local experiences', count: '6 articles' },
              { title: 'Resort Policies', desc: 'Information about check-in/out, smoking, pets, and other policies', count: '4 articles' },
            ].map((topic, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ y: -6 }}
                className="glass-card p-4 sm:p-6 rounded-2xl shadow-resort hover:shadow-glass-lg transition-shadow duration-300 cursor-pointer"
              >
                <h3 className="font-bold text-blue-900 mb-2">{topic.title}</h3>
                <p className="text-slate-600 text-sm mb-3">{topic.desc}</p>
                <span className="text-blue-600 font-semibold text-sm">{topic.count}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
