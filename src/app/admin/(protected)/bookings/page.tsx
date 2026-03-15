'use client';

import React from 'react';
import { Search, X, AlertCircle, Pencil, CalendarCheck, IndianRupee, Clock, Users, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  id: number;
  guest_name: string;
  phone: string;
  guest_email?: string;
  category_name: string;
  category_code: string;
  check_in: string;
  check_out: string;
  rooms: number;
  adults: number;
  children: number;
  extra_beds: number;
  base_amount: string;
  discount_amount: string;
  final_amount: string;
  payment_status: string;
  payment_ref: string | null;
  special_requests: string | null;
  privilege_card: string | null;
  created_at: string;
  nights?: Array<{ date: string; rooms: number; base_price: string }>;
}

interface EditFormData {
  check_in: string;
  check_out: string;
  rooms: number;
  adults: number;
  children: number;
  extra_beds: number;
  special_requests: string;
  payment_ref: string;
  base_amount: number;
  discount_amount: number;
  final_amount: number;
}

const statusColors: Record<string, string> = {
  PAID: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
};

const AdminBookings = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = React.useState<BookingData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');
  const [viewBooking, setViewBooking] = React.useState<BookingData | null>(null);
  const [editForm, setEditForm] = React.useState<EditFormData | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [updatingId, setUpdatingId] = React.useState<number | null>(null);

  // Store original rooms count for proportional pricing
  const originalRoomsRef = React.useRef<number>(1);
  const originalBaseRef = React.useRef<number>(0);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchBookings = React.useCallback(async (search?: string, status?: string, from?: string, to?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (from) params.set('from', from);
      if (to) params.set('to', to);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setBookings(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Initial fetch
  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Debounced search + filter refetch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(searchTerm, statusFilter, fromDate, toDate);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, fromDate, toDate, fetchBookings]);

  const handleEditBooking = (bookingId: number) => {
    // Open modal instantly with list data
    const b = bookings.find(bk => bk.id === bookingId);
    if (!b) return;

    const base = Number(b.base_amount);
    const discount = Number(b.discount_amount);
    originalRoomsRef.current = b.rooms;
    originalBaseRef.current = base;

    setViewBooking(b);
    setEditForm({
      check_in: b.check_in,
      check_out: b.check_out,
      rooms: b.rooms,
      adults: b.adults,
      children: b.children,
      extra_beds: b.extra_beds || 0,
      special_requests: b.special_requests || '',
      payment_ref: b.payment_ref || '',
      base_amount: base,
      discount_amount: discount,
      final_amount: base - discount,
    });

    // Fetch full details (email, privilege card, nights) in background
    fetch(`/api/admin/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setViewBooking(prev => prev?.id === bookingId ? { ...prev, ...json.data } : prev);
        }
      })
      .catch(() => {});
  };

  const updateEditForm = (changes: Partial<EditFormData>) => {
    setEditForm(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...changes };

      // If rooms changed, auto-scale base_amount proportionally
      if ('rooms' in changes && changes.rooms !== undefined) {
        const perRoom = originalBaseRef.current / originalRoomsRef.current;
        updated.base_amount = Math.round(perRoom * changes.rooms);
        updated.final_amount = updated.base_amount - updated.discount_amount;
      }

      // If base or discount changed, auto-calc final
      if ('base_amount' in changes || 'discount_amount' in changes) {
        updated.final_amount = updated.base_amount - updated.discount_amount;
      }

      return updated;
    });
  };

  const handleSaveEdit = async () => {
    if (!viewBooking || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${viewBooking.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      // Update local bookings list
      setBookings(prev => prev.map(b => b.id === viewBooking.id ? {
        ...b,
        check_in: editForm.check_in,
        check_out: editForm.check_out,
        rooms: editForm.rooms,
        adults: editForm.adults,
        children: editForm.children,
        extra_beds: editForm.extra_beds,
        special_requests: editForm.special_requests,
        payment_ref: editForm.payment_ref || null,
        base_amount: String(editForm.base_amount),
        discount_amount: String(editForm.discount_amount),
        final_amount: String(editForm.final_amount),
      } : b));

      setViewBooking(null);
      setEditForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, payment_status: newStatus } : b));
    if (viewBooking?.id === bookingId) {
      setViewBooking(prev => prev ? { ...prev, payment_status: newStatus } : null);
    }

    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ payment_status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        fetchBookings(searchTerm, statusFilter, fromDate, toDate);
        throw new Error(json.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // Handle timestamps like "2026-03-09 14:30:00+05:30" — take date part only
    const datePart = dateStr.split(' ')[0];
    const [y, m, d] = datePart.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(d).padStart(2, '0')} ${months[m - 1]} ${y}`;
  };

  // Summary stats
  const totalBookings = bookings.length;
  const pendingPayments = bookings.filter(b => b.payment_status === 'PENDING').length;
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todayCheckins = bookings.filter(b => b.check_in === today).length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === 'PAID')
    .reduce((sum, b) => sum + Number(b.final_amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bookings Management</h1>
        <p className="text-slate-600 mt-1">View and manage all guest bookings</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4 text-red-500" /></button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-900">{totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">{pendingPayments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Today&apos;s Check-ins</p>
              <p className="text-2xl font-bold text-slate-900">{todayCheckins}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Revenue (Paid)</p>
              <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent md:w-40 shrink-0"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <div className="flex gap-2 shrink-0">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-36 px-2 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-36 px-2 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3 font-semibold text-slate-700 text-sm w-[60px]">ID</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-700 text-sm w-[18%]">Guest</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-700 text-sm w-[14%]">Room Type</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-700 text-sm w-[12%]">Check-in</th>
                <th className="text-left py-3 px-3 font-semibold text-slate-700 text-sm w-[12%]">Check-out</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-700 text-sm w-[60px]">Rooms</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-700 text-sm w-[10%]">Amount</th>
                <th className="text-center py-3 px-3 font-semibold text-slate-700 text-sm w-[90px]">Status</th>
                <th className="text-right py-3 px-3 font-semibold text-slate-700 text-sm w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    {searchTerm || statusFilter ? 'No bookings match your filters.' : 'No bookings yet.'}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <span className="font-mono text-sm font-medium text-slate-900">#{booking.id}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-900 truncate">{booking.guest_name}</div>
                      <div className="text-sm text-slate-500 truncate">{booking.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 text-sm truncate">{booking.category_name}</td>
                    <td className="py-3 px-3 text-slate-700 text-sm whitespace-nowrap">{formatDate(booking.check_in)}</td>
                    <td className="py-3 px-3 text-slate-700 text-sm whitespace-nowrap">{formatDate(booking.check_out)}</td>
                    <td className="py-3 px-3 text-center text-slate-700 text-sm">
                      {booking.rooms}{booking.extra_beds > 0 && <span className="text-xs text-slate-400"> +{booking.extra_beds} bed{booking.extra_beds > 1 ? 's' : ''}</span>}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 text-sm whitespace-nowrap">
                      ₹{Number(booking.final_amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColors[booking.payment_status] || 'bg-slate-100 text-slate-800'}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleEditBooking(booking.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit booking"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <select
                          value={booking.payment_status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          disabled={updatingId === booking.id}
                          className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Modal */}
      {viewBooking && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-slate-900">Edit Booking #{viewBooking.id}</h3>
              <button onClick={() => { setViewBooking(null); setEditForm(null); }} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge + Booked Date */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[viewBooking.payment_status]}`}>
                  {viewBooking.payment_status}
                </span>
                <span className="text-sm text-slate-500">
                  Booked on {formatDate(viewBooking.created_at)}
                </span>
              </div>

              {/* Guest Info (read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500">Guest Name</label>
                  <p className="text-slate-900 font-medium">{viewBooking.guest_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500">Phone</label>
                  <p className="text-slate-900">{viewBooking.phone}</p>
                </div>
                {viewBooking.guest_email && (
                  <div>
                    <label className="block text-sm font-medium text-slate-500">Email</label>
                    <p className="text-slate-900">{viewBooking.guest_email}</p>
                  </div>
                )}
                {viewBooking.privilege_card && (
                  <div>
                    <label className="block text-sm font-medium text-slate-500">Privilege Card</label>
                    <p className="text-slate-900 font-mono">{viewBooking.privilege_card}</p>
                  </div>
                )}
              </div>

              {/* Editable Stay Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Stay Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Room Type</label>
                    <p className="font-medium text-slate-900">{viewBooking.category_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={editForm.rooms}
                      onChange={(e) => updateEditForm({ rooms: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={editForm.check_in}
                      onChange={(e) => updateEditForm({ check_in: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={editForm.check_out}
                      onChange={(e) => updateEditForm({ check_out: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Adults</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={editForm.adults}
                      onChange={(e) => updateEditForm({ adults: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Children</label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={editForm.children}
                      onChange={(e) => updateEditForm({ children: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Extra Beds</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editForm.extra_beds}
                      onChange={(e) => updateEditForm({ extra_beds: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Editable Pricing */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">Pricing</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm text-slate-600 shrink-0">Base Amount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.base_amount}
                      onChange={(e) => updateEditForm({ base_amount: parseFloat(e.target.value) || 0 })}
                      className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-right font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-sm text-green-700 shrink-0">Discount (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.discount_amount}
                      onChange={(e) => updateEditForm({ discount_amount: parseFloat(e.target.value) || 0 })}
                      className="w-40 px-3 py-2 border border-slate-300 rounded-lg text-right font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-blue-200 pt-3">
                    <span className="font-bold text-lg text-slate-900">Final Amount</span>
                    <span className="font-bold text-lg text-blue-700">₹{editForm.final_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">Special Requests</label>
                <textarea
                  value={editForm.special_requests}
                  onChange={(e) => updateEditForm({ special_requests: e.target.value })}
                  rows={3}
                  placeholder="Any special requests from the guest..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Payment Reference */}
              <div>
                <label className="block font-semibold text-slate-900 mb-2">Payment Reference</label>
                <input
                  type="text"
                  value={editForm.payment_ref}
                  onChange={(e) => updateEditForm({ payment_ref: e.target.value })}
                  placeholder="Transaction ID or reference number..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Payment Status */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Payment Status</h4>
                <div className="flex gap-2 flex-wrap">
                  {['PENDING', 'PAID', 'CANCELLED', 'REFUNDED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(viewBooking.id, s)}
                      disabled={viewBooking.payment_status === s || updatingId === viewBooking.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        viewBooking.payment_status === s
                          ? 'bg-slate-200 text-slate-500'
                          : s === 'PAID' ? 'bg-green-600 text-white hover:bg-green-700'
                          : s === 'CANCELLED' ? 'bg-red-600 text-white hover:bg-red-700'
                          : s === 'REFUNDED' ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save / Cancel */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => { setViewBooking(null); setEditForm(null); }}
                  className="px-6 py-3 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
