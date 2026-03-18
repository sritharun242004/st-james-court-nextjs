'use client';

import React from 'react';
import { User, Phone, Calendar, MapPin, Mail, Edit2, Save, BedDouble, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

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

    // Fetch bookings
    fetch('/api/user/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => { if (data.bookings) setBookings(data.bookings); })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));

    // Fetch profile (for privilege card)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-playfair font-bold">{user?.full_name}</h1>
                <p className="text-blue-100 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
                Profile updated successfully!
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-slate-900">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={!isEditing}
                      min="18"
                      max="120"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nationality
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Privilege Membership */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-playfair font-bold text-slate-900">Privilege Membership</h2>
          </div>

          {privilegeCard ? (
            <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Card Number</p>
                  <p className="text-2xl font-mono font-bold tracking-wider">{privilegeCard.cardNumber}</p>
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
            <div className="text-center py-8 bg-slate-50 rounded-xl">
              <CreditCard className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No privilege membership</p>
              <p className="text-slate-400 text-sm mt-1">Contact us to get a privilege card for exclusive discounts</p>
            </div>
          )}
        </div>

        {/* Booking History */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <BedDouble className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-playfair font-bold text-slate-900">My Bookings</h2>
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
              <a
                href="/booking"
                className="inline-block mt-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Book Now
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg">{booking.categoryName}</h3>
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
                      <div className="text-2xl font-bold text-blue-600">
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
                </div>
              ))}
            </div>
          )}
        </div>
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
