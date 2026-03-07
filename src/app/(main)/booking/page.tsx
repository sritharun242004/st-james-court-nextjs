'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Plus, Minus, CreditCard, Shield, Gift, CheckCircle, AlertCircle } from 'lucide-react';

interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  privilegeCardNumber: string;
}

interface BookingResult {
  bookingId: number;
  categoryCode: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  nights: { date: string; basePrice: number; finalPrice: number; discountPercent: number | null }[];
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;
  privilegeApplied: boolean;
}

const Booking = () => {
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [apiError, setApiError] = useState('');
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
    privilegeCardNumber: '',
  });

  const roomTypes = [
    { id: 'DELUXE', name: 'Deluxe Room', price: 4500 },
    { id: 'SUPER_DELUXE', name: 'Super Deluxe', price: 5500 },
    { id: 'SUITE', name: 'Executive Suite Room', price: 6500 }
  ];

  const addOns = [
    { id: 'spa', name: 'Spa Package', price: 3500, description: 'Couples massage and wellness treatments' },
    { id: 'dining', name: 'Dining Package', price: 2500, description: 'All meals included with wine pairing' },
    { id: 'activities', name: 'Activity Package', price: 4000, description: 'Water sports and cultural tours' },
    { id: 'airport', name: 'Airport Transfer', price: 1500, description: 'Luxury car pickup and drop-off' }
  ];

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const calculateBookingNights = () => {
    if (checkIn && checkOut) {
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    return 1;
  };

  const calculateTotal = () => {
    const roomPrice = roomTypes.find(room => room.id === selectedRoom)?.price || 0;
    const nights = calculateBookingNights();
    const roomTotal = roomPrice * nights * rooms;
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return roomTotal + addOnTotal;
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!checkIn) errors.checkIn = 'Check-in date is required';
      if (!checkOut) errors.checkOut = 'Check-out date is required';
      if (checkIn && checkOut && checkOut <= checkIn) {
        errors.checkOut = 'Check-out must be after check-in date';
      }
      if (adults < 1) errors.adults = 'At least 1 adult is required';
      if (rooms < 1) errors.rooms = 'At least 1 room is required';
      if (!selectedRoom) errors.room = 'Please select a room type';
    }

    if (stepNumber === 3) {
      if (!guestDetails.firstName.trim()) errors.firstName = 'First name is required';
      if (!guestDetails.lastName.trim()) errors.lastName = 'Last name is required';
      if (!guestDetails.phone.trim()) errors.phone = 'Phone number is required';
      if (guestDetails.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestDetails.email)) {
          errors.email = 'Please enter a valid email address';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStepChange = async (nextStep: number) => {
    if (validateStep(step)) {
      setStep(nextStep);
    }
  };

  const handleBookingSubmit = async () => {
    if (!validateStep(3)) return;
    if (!checkIn || !checkOut) return;

    setIsLoading(true);
    setApiError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryCode: selectedRoom,
          checkIn: formatDate(checkIn),
          checkOut: formatDate(checkOut),
          rooms,
          adults,
          children,
          fullName: `${guestDetails.firstName} ${guestDetails.lastName}`.trim(),
          phone: guestDetails.phone,
          email: guestDetails.email || undefined,
          privilegeCardNumber: guestDetails.privilegeCardNumber || undefined,
          specialRequests: guestDetails.specialRequests || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || 'Booking failed');
        return;
      }

      setBookingResult(data);
      setStep(4);
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestDetailsChange = (field: keyof GuestDetails, value: string) => {
    setGuestDetails(prev => ({ ...prev, [field]: value }));
  };

  // Step 4: Success
  if (step === 4 && bookingResult) {
    return (
      <div>
        <section className="pt-52 pb-20 relative text-white">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-8">Booking Confirmed</h1>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-8">Your booking has been confirmed.</p>

            <div className="bg-slate-50 rounded-lg p-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Booking ID:</span>
                <span className="font-bold text-blue-600">#{bookingResult.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Room:</span>
                <span className="font-medium">{roomTypes.find(r => r.id === bookingResult.categoryCode)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-in:</span>
                <span className="font-medium">{bookingResult.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Check-out:</span>
                <span className="font-medium">{bookingResult.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Rooms:</span>
                <span className="font-medium">{bookingResult.rooms}</span>
              </div>
              {bookingResult.privilegeApplied && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Privilege Discount:</span>
                  <span className="font-medium text-green-600">-₹{bookingResult.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{bookingResult.finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">{bookingResult.paymentStatus}</span>
              </div>
            </div>

            <a
              href="/"
              className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-52 pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-playfair font-bold mb-8">Book Your Stay</h1>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed">
            Reserve your perfect beachfront escape at St James Court Beach Resort
          </p>
        </div>
      </section>

      {/* Booking Steps */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNumber
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {stepNumber}
                </div>
                <span className={`ml-2 font-medium ${
                  step >= stepNumber ? 'text-blue-600' : 'text-slate-600'
                }`}>
                  {stepNumber === 1 && 'Select Dates & Room'}
                  {stepNumber === 2 && 'Add Services'}
                  {stepNumber === 3 && 'Payment & Confirmation'}
                </span>
                {stepNumber < 3 && <div className="w-8 h-px bg-slate-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Select Your Dates & Room</h2>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                    {validationErrors.checkIn && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.checkIn}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Check-out Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        minDate={checkIn || new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                    {validationErrors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.checkOut}</p>
                    )}
                  </div>
                </div>

                {/* Guest Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adults</label>
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {validationErrors.adults && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.adults}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Children</label>
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rooms</label>
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setRooms(Math.max(1, rooms - 1))}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{rooms}</span>
                      <button
                        type="button"
                        onClick={() => setRooms(rooms + 1)}
                        className="p-3 hover:bg-slate-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {validationErrors.rooms && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.rooms}</p>
                    )}
                  </div>
                </div>

                {/* Room Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-4">Select Room Type</label>
                  <div className="space-y-4">
                    {roomTypes.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedRoom === room.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-slate-900">{room.name}</h3>
                          </div>
                          <div className="text-xl font-bold text-blue-600">
                            ₹{room.price.toLocaleString()}/night
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {validationErrors.room && (
                    <p className="text-red-500 text-sm mt-2">{validationErrors.room}</p>
                  )}
                </div>

                <button
                  onClick={() => handleStepChange(2)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Continue to Services
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Add Services & Packages</h2>

                <div className="space-y-4 mb-8">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{addOn.name}</h3>
                          <p className="text-slate-600 text-sm">{addOn.description}</p>
                        </div>
                        <div className="text-lg font-bold text-blue-600 ml-4">
                          +₹{addOn.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleStepChange(1)}
                    className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStepChange(3)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Guest Details & Confirmation</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <input
                        type="text"
                        value={guestDetails.firstName}
                        onChange={(e) => handleGuestDetailsChange('firstName', e.target.value)}
                        placeholder="First Name *"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.firstName ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={guestDetails.lastName}
                        onChange={(e) => handleGuestDetailsChange('lastName', e.target.value)}
                        placeholder="Last Name *"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.lastName ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        value={guestDetails.email}
                        onChange={(e) => handleGuestDetailsChange('email', e.target.value)}
                        placeholder="Email Address"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={guestDetails.phone}
                        onChange={(e) => handleGuestDetailsChange('phone', e.target.value)}
                        placeholder="Phone Number *"
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.phone ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Privilege Card (Optional)</h3>
                  <input
                    type="text"
                    value={guestDetails.privilegeCardNumber}
                    onChange={(e) => handleGuestDetailsChange('privilegeCardNumber', e.target.value)}
                    placeholder="Enter privilege card number for discounts"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Special Requests</h3>
                  <textarea
                    value={guestDetails.specialRequests}
                    onChange={(e) => handleGuestDetailsChange('specialRequests', e.target.value)}
                    placeholder="Any special requests? (e.g., early check-in, extra pillows)"
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center mb-8">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-slate-600">
                    Your booking will be confirmed with payment at check-in
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleStepChange(2)}
                    className="flex-1 border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookingSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Confirming Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-32">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Check-in:</span>
                  <span className="font-medium">{checkIn?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Check-out:</span>
                  <span className="font-medium">{checkOut?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Nights:</span>
                  <span className="font-medium">{calculateBookingNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Guests:</span>
                  <span className="font-medium">{adults} adults, {children} children</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rooms:</span>
                  <span className="font-medium">{rooms}</span>
                </div>
              </div>

              {selectedRoom && (
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Room:</span>
                    <span className="font-medium text-right text-sm">
                      {roomTypes.find(r => r.id === selectedRoom)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Room Total:</span>
                    <span className="font-medium">
                      ₹{((roomTypes.find(r => r.id === selectedRoom)?.price || 0) * calculateBookingNights() * rooms).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {selectedAddOns.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  {selectedAddOns.map(addOnId => {
                    const addOn = addOns.find(a => a.id === addOnId);
                    return addOn ? (
                      <div key={addOnId} className="flex justify-between mb-2">
                        <span className="text-slate-600 text-sm">{addOn.name}:</span>
                        <span className="font-medium">₹{addOn.price.toLocaleString()}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-900">Special Offer</span>
                </div>
                <p className="text-sm text-blue-800">
                  Book 3+ nights and get complimentary airport transfer!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
