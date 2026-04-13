'use client';

import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Plus, Minus, CreditCard, Shield, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
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
  extraBeds: number;
  extraBedTotal: number;
  nights: { date: string; basePrice: number; finalPrice: number; discountPercent: number | null }[];
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;
  privilegeApplied: boolean;
}

const Booking = () => {
  const { user, getToken } = useAuth();
  const formTopRef = useRef<HTMLDivElement>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(new Date());
  const [checkOut, setCheckOut] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);
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

  const defaultRoomTypes = [
    { id: 'DELUXE',       name: 'Deluxe Room',                   price: 4500  },
    { id: 'SUPER_DELUXE', name: 'Super Deluxe & Heritage Room',  price: 5500  },
    { id: 'SUITE',        name: 'Executive Suite',               price: 6500  },
    { id: 'FAMILY',       name: 'Family Room',                   price: 9000  },
    { id: 'CLUB',         name: 'Club Room',                     price: 1500  },
  ];

  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState<Record<string, { available: number; avgPrice: number; avgMemberPrice: number | null; extraBedPrice: number; maxExtraBeds: number }>>({});

  const addOns = [
    { id: 'spa', name: 'Spa Package', price: 3500, description: 'Couples massage and wellness treatments' },
    { id: 'dining', name: 'Dining Package', price: 2500, description: 'All meals included with wine pairing' },
    { id: 'activities', name: 'Activity Package', price: 4000, description: 'Water sports and cultural tours' },
    { id: 'airport', name: 'Airport Transfer', price: 1500, description: 'Luxury car pickup and drop-off' }
  ];

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [userHasPrivilege, setUserHasPrivilege] = useState(false);

  React.useEffect(() => {
    const token = getToken();
    if (!token || !user) return;

    const nameParts = (user.full_name || '').split(' ');
    setGuestDetails(prev => ({
      ...prev,
      firstName: prev.firstName || nameParts[0] || '',
      lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }));

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.privilegeCard?.active) {
          setUserHasPrivilege(true);
          setGuestDetails(prev => ({
            ...prev,
            privilegeCardNumber: prev.privilegeCardNumber || data.privilegeCard.cardNumber,
          }));
        }
      })
      .catch(() => {});
  }, [user, getToken]);

  React.useEffect(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;

    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      try {
        const categories = ['DELUXE', 'SUPER_DELUXE', 'SUITE', 'FAMILY', 'CLUB'];
        const results: Record<string, { available: number; avgPrice: number; avgMemberPrice: number | null; extraBedPrice: number; maxExtraBeds: number }> = {};

        const privilegeParam = userHasPrivilege ? '&hasPrivilege=true' : '';
        await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(
              `/api/availability?category=${cat}&start=${formatDate(checkIn)}&end=${formatDate(checkOut)}${privilegeParam}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.days && data.days.length > 0) {
                const minAvailable = Math.min(...data.days.map((d: { available: number }) => d.available));
                const avgPrice = data.days.reduce((sum: number, d: { basePrice: number }) => sum + d.basePrice, 0) / data.days.length;
                const memberPrices = data.days.filter((d: { memberPrice: number | null }) => d.memberPrice !== null);
                const avgMemberPrice = memberPrices.length > 0
                  ? Math.round(memberPrices.reduce((sum: number, d: { memberPrice: number }) => sum + d.memberPrice, 0) / memberPrices.length)
                  : null;
                const extraBedPrice = data.days[0].extraBedPrice || 1500;
                const maxExtraBeds = data.days[0].maxExtraBeds || 1;
                results[cat] = { available: minAvailable, avgPrice: Math.round(avgPrice), avgMemberPrice, extraBedPrice, maxExtraBeds };
              }
            }
          })
        );

        setAvailabilityData(results);

        setRoomTypes(prev =>
          prev.map(room => ({
            ...room,
            price: results[room.id]?.avgPrice || room.price,
          }))
        );
      } catch {
        // Keep default prices on error
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [checkIn, checkOut, userHasPrivilege]);

  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const displayDate = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
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
    const extraBedPrice = selectedRoom ? (availabilityData[selectedRoom]?.extraBedPrice || 1500) : 1500;
    const extraBedTotal = extraBeds * extraBedPrice * nights;
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return roomTotal + extraBedTotal + addOnTotal;
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
      setTimeout(() => {
        formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
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
          extraBeds,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        <section className="pt-32 pb-12 sm:pt-52 sm:pb-20 relative text-white">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-6xl md:text-7xl font-playfair font-bold mb-4 sm:mb-8">Reservation Confirmed</h1>
          </div>
        </section>
        <WaveDivider fill="#FFFBF5" />
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-12 bg-resort-cream">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl shadow-resort p-4 sm:p-6 md:p-8 text-center"
          >
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">Thank You!</h2>
            <p className="text-slate-600 mb-8">Your reservation has been confirmed. Payment will be collected at check-in.</p>

            <div className="bg-resort-pearl rounded-2xl p-4 sm:p-6 text-left space-y-3">
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
              {bookingResult.extraBeds > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Extra Beds:</span>
                  <span className="font-medium">{bookingResult.extraBeds} (+₹{bookingResult.extraBedTotal.toLocaleString()})</span>
                </div>
              )}
              {bookingResult.privilegeApplied && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Privilege Discount:</span>
                  <span className="font-medium text-green-600">-₹{bookingResult.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-sand-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{bookingResult.finalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Status:</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">{bookingResult.paymentStatus}</span>
              </div>
            </div>

            <motion.a
              href="/"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all cursor-pointer"
            >
              Back to Home
            </motion.a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-32 pb-12 sm:pt-52 sm:pb-20 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-900/50 to-resort-cream"></div>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        >
          <motion.h1 variants={fadeInUp} custom={0} className="text-4xl sm:text-5xl md:text-7xl font-playfair font-bold mb-4 sm:mb-8">Book Your Stay</motion.h1>
          <motion.p variants={fadeInUp} custom={1} className="text-base sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed px-4">
            Reserve your perfect beachfront escape at St James Court Beach Resort
          </motion.p>
        </motion.div>
      </section>

      <WaveDivider fill="#FFFBF5" />

      {/* Booking Steps */}
      <section ref={formTopRef} className="py-6 bg-resort-cream border-b border-sand-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start justify-center gap-0">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center w-20 sm:w-28">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 ${
                    step >= stepNumber
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`mt-1.5 text-center font-medium leading-tight text-xs sm:text-sm ${
                    step >= stepNumber ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {stepNumber === 1 && <><span className="sm:hidden">Dates &amp;<br/>Room</span><span className="hidden sm:inline">Select Dates &amp; Room</span></>}
                    {stepNumber === 2 && <><span className="sm:hidden">Add<br/>Services</span><span className="hidden sm:inline">Add Services</span></>}
                    {stepNumber === 3 && <><span className="sm:hidden">Confirm</span><span className="hidden sm:inline">Confirm Reservation</span></>}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className={`h-px w-8 sm:w-12 mt-4 flex-shrink-0 ${step > stepNumber ? 'bg-resort-gold' : 'bg-slate-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-12 bg-resort-cream">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 text-sm">{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl shadow-resort p-5 sm:p-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-8">Select Your Dates &amp; Room</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Check-in Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        className="w-full p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80"
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
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
                        className="w-full p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80"
                        minDate={checkIn || new Date()}
                        dateFormat="dd/MM/yyyy"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
                    </div>
                    {validationErrors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.checkOut}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Adults</label>
                    <div className="flex items-center border border-sand-200 rounded-xl bg-white/80">
                      <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-l-xl">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{adults}</span>
                      <button type="button" onClick={() => setAdults(adults + 1)} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-r-xl">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {validationErrors.adults && <p className="text-red-500 text-sm mt-1">{validationErrors.adults}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Children</label>
                    <div className="flex items-center border border-sand-200 rounded-xl bg-white/80">
                      <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-l-xl">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{children}</span>
                      <button type="button" onClick={() => setChildren(children + 1)} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-r-xl">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Rooms</label>
                    <div className="flex items-center border border-sand-200 rounded-xl bg-white/80">
                      <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-l-xl">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex-1 text-center py-3">{rooms}</span>
                      <button type="button" onClick={() => setRooms(rooms + 1)} className="p-3 hover:bg-blue-50/50 cursor-pointer rounded-r-xl">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {validationErrors.rooms && <p className="text-red-500 text-sm mt-1">{validationErrors.rooms}</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Select Room Type
                    {availabilityLoading && <span className="ml-2 text-blue-500 text-xs font-normal">Checking availability...</span>}
                  </label>
                  <div className="space-y-4">
                    {roomTypes.map((room) => {
                      const avail = availabilityData[room.id];
                      const soldOut = avail && avail.available < rooms;
                      return (
                        <div
                          key={room.id}
                          onClick={() => !soldOut && setSelectedRoom(room.id)}
                          className={`border-2 rounded-2xl p-4 transition-all duration-200 ${
                            soldOut
                              ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                              : selectedRoom === room.id
                                ? 'border-blue-500 bg-blue-50/50 cursor-pointer shadow-glass'
                                : 'border-sand-200 hover:border-blue-300 cursor-pointer bg-white/80'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-blue-900">{room.name}</h3>
                              {avail && !soldOut && (
                                <p className="text-sm text-green-600 mt-1">{avail.available} room{avail.available !== 1 ? 's' : ''} available</p>
                              )}
                              {soldOut && (
                                <p className="text-sm text-red-500 mt-1">Not enough rooms available</p>
                              )}
                            </div>
                            <div className="text-right">
                              {avail?.avgMemberPrice ? (
                                <>
                                  <div className="text-sm text-slate-400 line-through">₹{room.price.toLocaleString()}/night</div>
                                  <div className="text-xl font-bold text-green-600">₹{avail.avgMemberPrice.toLocaleString()}/night</div>
                                  <div className="text-xs text-green-500">Member price</div>
                                </>
                              ) : (
                                <div className="text-xl font-bold text-blue-600">₹{room.price.toLocaleString()}/night</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {validationErrors.room && <p className="text-red-500 text-sm mt-2">{validationErrors.room}</p>}
                </div>

                {selectedRoom && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Extra Bed</label>
                    <button
                      type="button"
                      onClick={() => setExtraBeds(extraBeds === 1 ? 0 : 1)}
                      className={`flex items-center justify-between w-full border-2 rounded-2xl px-5 py-4 transition-all duration-200 cursor-pointer ${
                        extraBeds === 1
                          ? 'border-blue-500 bg-blue-50/50 shadow-glass'
                          : 'border-sand-200 hover:border-blue-300 bg-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          extraBeds === 1 ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                        }`}>
                          {extraBeds === 1 && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="font-semibold text-blue-900">Add Extra Bed</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        +₹{(availabilityData[selectedRoom]?.extraBedPrice || 1500).toLocaleString()}/night
                      </span>
                    </button>
                  </div>
                )}

                <motion.button
                  onClick={() => handleStepChange(2)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Continue to Services
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl shadow-resort p-5 sm:p-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-8">Add Services &amp; Packages</h2>

                <div className="space-y-4 mb-8">
                  {addOns.map((addOn) => (
                    <div
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-blue-500 bg-blue-50/50 shadow-glass'
                          : 'border-sand-200 hover:border-blue-300 bg-white/80'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-900 mb-1">{addOn.name}</h3>
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
                  <motion.button
                    onClick={() => handleStepChange(1)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={() => handleStepChange(3)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 cursor-pointer"
                  >
                    Continue to Reservation
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card rounded-2xl shadow-resort p-5 sm:p-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 sm:mb-8">Guest Details &amp; Reservation</h2>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { field: 'firstName' as const, placeholder: 'First Name *', type: 'text' },
                      { field: 'lastName' as const, placeholder: 'Last Name *', type: 'text' },
                      { field: 'email' as const, placeholder: 'Email Address', type: 'email' },
                      { field: 'phone' as const, placeholder: 'Phone Number *', type: 'tel' },
                    ].map((input) => (
                      <div key={input.field}>
                        <input
                          type={input.type}
                          value={guestDetails[input.field]}
                          onChange={(e) => handleGuestDetailsChange(input.field, e.target.value)}
                          placeholder={input.placeholder}
                          className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80 ${
                            validationErrors[input.field] ? 'border-red-500' : 'border-sand-200'
                          }`}
                        />
                        {validationErrors[input.field] && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors[input.field]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Privilege Card (Optional)</h3>
                  <input
                    type="text"
                    value={guestDetails.privilegeCardNumber}
                    onChange={(e) => handleGuestDetailsChange('privilegeCardNumber', e.target.value)}
                    placeholder="Enter privilege card number for discounts"
                    className="w-full p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80"
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Special Requests</h3>
                  <textarea
                    value={guestDetails.specialRequests}
                    onChange={(e) => handleGuestDetailsChange('specialRequests', e.target.value)}
                    placeholder="Any special requests? (e.g., early check-in, extra pillows)"
                    rows={3}
                    className="w-full p-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent bg-white/80"
                  />
                </div>

                <div className="flex items-center mb-8">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-slate-600">
                    Your reservation will be confirmed and payment collected at check-in
                  </span>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    onClick={() => handleStepChange(2)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handleBookingSubmit}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-ocean transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading ? 'Reserving...' : 'Confirm Reservation'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl shadow-resort p-5 sm:p-8 lg:sticky lg:top-32">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-5 sm:mb-6">Booking Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between"><span className="text-slate-600">Check-in:</span><span className="font-medium">{checkIn ? displayDate(checkIn) : ''}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Check-out:</span><span className="font-medium">{checkOut ? displayDate(checkOut) : ''}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Nights:</span><span className="font-medium">{calculateBookingNights()}</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Guests:</span><span className="font-medium">{adults} adults, {children} children</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Rooms:</span><span className="font-medium">{rooms}</span></div>
              </div>

              {selectedRoom && (
                <div className="border-t border-sand-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-600">Room:</span>
                    <span className="font-medium text-right text-sm">{roomTypes.find(r => r.id === selectedRoom)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Room Total:</span>
                    <span className="font-medium">₹{((roomTypes.find(r => r.id === selectedRoom)?.price || 0) * calculateBookingNights() * rooms).toLocaleString()}</span>
                  </div>
                  {extraBeds > 0 && (
                    <div className="flex justify-between mt-2">
                      <span className="text-slate-600">Extra Beds ({extraBeds}):</span>
                      <span className="font-medium">₹{(extraBeds * (availabilityData[selectedRoom]?.extraBedPrice || 1500) * calculateBookingNights()).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedAddOns.length > 0 && (
                <div className="border-t border-sand-200 pt-4 mb-4">
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

              <div className="border-t border-sand-200 pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 glass-card bg-blue-50/40 rounded-2xl">
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-resort-gold mr-2" />
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
