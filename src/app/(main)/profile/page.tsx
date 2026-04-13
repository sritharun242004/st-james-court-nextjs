'use client';

import React from 'react';
import { User, Phone, Calendar, MapPin, Mail, Edit2, Save, BedDouble, AlertCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
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

interface BookingItem {
  id: number;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  baseAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: string;
  categoryCode: string;
  categoryName: string;
  createdAt: string;
}

const ProfileContent = () => {
  const { user, updateProfile, getToken } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    age: user?.age?.toString() || '',
    nationality: user?.nationality || ''
  });
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [bookingsLoading, setBookingsLoading] = React.useState(true);
  const [privilegeCard, setPrivilegeCard] = React.useState<{
    cardNumber: string;
    active: boolean;
    expiryDate: string | null;
  } | null>(null);

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      setBookingsLoading(false);
      return;
    }

    fetch('/api/user/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.bookings) setBookings(data.bookings); })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.privilegeCard) setPrivilegeCard(data.privilegeCard); })
      .catch(() => {});
  }, [getToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        nationality: formData.nationality
      });
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-resort-cream py-6 px-3 sm:py-12 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-2xl shadow-resort overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 sm:px-8 sm:py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-8 w-8 sm:h-12 sm:w-12" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-playfair font-bold">{user?.full_name}</h1>
                <p className="text-blue-100 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600">
                Profile updated successfully!
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900">Profile Information</h2>
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-ocean transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </motion.button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-sand-200 text-slate-700 rounded-full hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', icon: <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />, name: 'full_name', type: 'text' },
                  { label: 'Email Address', icon: <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />, name: 'email', type: 'email', disabled: true, value: user?.email || '' },
                  { label: 'Phone Number', icon: <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />, name: 'phone', type: 'tel' },
                  { label: 'Age', icon: <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />, name: 'age', type: 'number', min: '18', max: '120' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                    <div className="relative">
                      {field.icon}
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.disabled ? (field.value || '') : (formData[field.name as keyof typeof formData] || '')}
                        onChange={field.disabled ? undefined : handleChange}
                        disabled={field.disabled || !isEditing}
                        min={field.min}
                        max={field.max}
                        className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent disabled:bg-resort-pearl disabled:text-slate-600 bg-white/80"
                      />
                    </div>
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nationality</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-sand-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent disabled:bg-resort-pearl disabled:text-slate-600 bg-white/80"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all duration-300 cursor-pointer"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </motion.button>
              )}
            </form>
          </div>
        </motion.div>

        {/* Privilege Membership */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 glass-card rounded-2xl shadow-resort p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-resort-gold" />
            <h2 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900">Privilege Membership</h2>
          </div>

          {privilegeCard ? (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Card Number</p>
                  <p className="text-lg sm:text-2xl font-mono font-bold tracking-wider">{privilegeCard.cardNumber}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    privilegeCard.active ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'
                  }`}>
                    {privilegeCard.active ? 'Active' : 'Inactive'}
                  </span>
                  {privilegeCard.expiryDate && (
                    <p className="text-blue-100 text-sm mt-2">
                      Expires: {privilegeCard.expiryDate.split('T')[0]}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                Use your card number during booking to get exclusive member discounts on room rates.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-resort-pearl rounded-2xl">
              <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No privilege membership</p>
              <p className="text-slate-400 text-sm mt-1">Contact us to get a privilege card for exclusive discounts</p>
            </div>
          )}
        </motion.div>

        {/* Booking History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 glass-card rounded-2xl shadow-resort p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <BedDouble className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-playfair font-bold text-blue-900">My Bookings</h2>
          </div>

          {bookingsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <BedDouble className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No bookings yet</p>
              <p className="text-slate-400 text-sm mt-1">Your reservations will appear here</p>
              <motion.a
                href="/booking"
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-ocean transition-all cursor-pointer"
              >
                Book Now
              </motion.a>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ y: -4 }}
                  className="border border-sand-200 rounded-2xl p-4 sm:p-6 hover:shadow-glass transition-shadow bg-white/80"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-blue-900 text-lg">{booking.categoryName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>Booking #{booking.id} | {booking.rooms} room{booking.rooms > 1 ? 's' : ''} | {booking.adults} adult{booking.adults > 1 ? 's' : ''}{booking.children > 0 ? `, ${booking.children} child${booking.children > 1 ? 'ren' : ''}` : ''}</p>
                        <p>{booking.checkIn} to {booking.checkOut}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">
                        ₹{booking.finalAmount.toLocaleString()}
                      </div>
                      {booking.discountAmount > 0 && (
                        <div className="text-sm text-green-600">
                          Saved ₹{booking.discountAmount.toLocaleString()}
                        </div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">
                        Booked {booking.createdAt.split('T')[0]}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const Profile = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default Profile;
