'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, Mail } from 'lucide-react';

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
      answer: 'You can make a reservation through our website using our online booking system, by calling our reservations team at +91 9443252776, or by emailing reservations@stjamescourtbeachresort.com. We recommend booking in advance, especially during peak season (December-February).'
    },
    {
      id: 2,
      category: 'booking',
      question: 'What is your cancellation policy?',
      answer: 'Our standard cancellation policy allows free cancellation up to 48 hours before your arrival date. For bookings during peak season or special events, a 72-hour cancellation policy applies. Cancellations made within the specified timeframe will incur a one-night charge. Special packages may have different cancellation terms. For events, it\'s better to cancel within 24 hours'
    },
    {
      id: 3,
      category: 'checkin',
      question: 'What are your check-in and check-out times?',
      answer: 'Check-in time is 3:00 PM and check-out time is 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability. We offer complimentary luggage storage if you arrive before check-in time or need to leave after check-out.'
    },
    {
      id: 4,
      category: 'amenities',
      question: 'Do you provide airport transportation?',
      answer: 'Yes, we offer complimentary airport pickup and drop-off service from Puducherry Airport. For Chennai Airport, we provide transportation at a nominal charge. Please inform us of your flight details at least 24 hours in advance to arrange the service.'
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
      question: 'What water sports activities are available?',
      answer: 'We offer a variety of water sports including kayaking, jet skiing, parasailing, banana boat rides, and fishing trips. Our water sports center is open from 9:00 AM to 5:00 PM, and all activities include safety equipment and basic instruction. Some activities may be weather-dependent.'
    },
    {
      id: 8,
      category: 'policies',
      question: 'What is your policy regarding children?',
      answer: 'Children are welcome at our resort! Kids under 5 stay free when sharing a room with parents. We offer a kids\' club with supervised activities for ages 4-12, a children\'s pool, playground, and special children\'s menu at our restaurants. Baby cots and high chairs are available upon request.'
    },
    {
      id: 9,
      category: 'booking',
      question: 'Do you offer special packages for weddings and events?',
      answer: 'Yes, we specialize in destination weddings and special events. Our wedding packages include ceremony setup, floral decorations, photography, catering, and accommodation for the couple. We have dedicated event planners who will work with you to create your perfect celebration. Please contact our events team for detailed information.'
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
      answer: 'We understand that pets are part of the family, but currently, we do not allow pets at the resort, with the exception of certified service animals. We apologize for any inconvenience and can help you find nearby pet boarding facilities if needed.'
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
      <section className="pt-52 pb-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-8">Frequently Asked Questions</h1>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about your stay at St James Court Beach Resort.
            Can't find what you're looking for? Our team is here to help!
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b">
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
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItem === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {openItem === faq.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

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

      {/* Quick Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Need More Help?</h2>
            <p className="text-xl text-slate-600">
              Our friendly team is available 24/7 to assist you with any questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl">
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Call Us</h3>
              <p className="text-slate-600 mb-4">
                Speak directly with our guest services team
              </p>
              <div className="space-y-2 text-sm text-slate-700">
                <div>General: +91 413 123 4567</div>
                <div>Reservations: +91 413 123 4568</div>
              </div>
              <button className="mt-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Call Now
              </button>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Email Us</h3>
              <p className="text-slate-600 mb-4">
                Send us your questions and we'll respond promptly
              </p>
              <div className="text-sm text-slate-700 mb-4">
                info@stjamescourtresort.com
              </div>
              <button className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Send Email
              </button>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Live Chat</h3>
              <p className="text-slate-600 mb-4">
                Get instant answers through our live chat support
              </p>
              <div className="text-sm text-slate-700 mb-4">
                Available 24/7
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Common Topics */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Topics</h2>
            <p className="text-xl text-slate-600">
              Quick access to our most frequently asked questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h3 className="font-bold text-slate-900 mb-2">Booking & Reservations</h3>
              <p className="text-slate-600 text-sm mb-3">Questions about making reservations, cancellations, and booking policies</p>
              <span className="text-blue-600 font-semibold text-sm">5 articles</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h3 className="font-bold text-slate-900 mb-2">Resort Amenities</h3>
              <p className="text-slate-600 text-sm mb-3">Information about spa, pools, dining, and other resort facilities</p>
              <span className="text-blue-600 font-semibold text-sm">8 articles</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h3 className="font-bold text-slate-900 mb-2">Activities & Tours</h3>
              <p className="text-slate-600 text-sm mb-3">Details about water sports, cultural tours, and local experiences</p>
              <span className="text-blue-600 font-semibold text-sm">6 articles</span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h3 className="font-bold text-slate-900 mb-2">Resort Policies</h3>
              <p className="text-slate-600 text-sm mb-3">Information about check-in/out, smoking, pets, and other policies</p>
              <span className="text-blue-600 font-semibold text-sm">4 articles</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;