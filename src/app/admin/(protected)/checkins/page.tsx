'use client';

import React from 'react';
import { AlertCircle, X, DoorOpen, LogOut, UserPlus, BedDouble, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CheckinRow {
  id: number;
  guest_name: string;
  phone: string;
  guest_email: string | null;
  category_name: string;
  category_code: string;
  bed_type: string | null;
  check_in: string;
  check_out: string;
  rooms: number;
  adults: number;
  children: number;
  extra_beds: number;
  final_amount: string;
  payment_status: string;
  room_numbers: string | null;
  checked_in_at: string | null;
  checked_out_at: string | null;
  is_walk_in: boolean;
  special_requests: string | null;
  departing_today?: boolean;
}

interface Category { id: number; code: string; name: string }

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const addDays = (dateStr: string, n: number) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const emptyWalkIn = () => ({
  fullName: '', phone: '', email: '', categoryCode: '',
  checkIn: todayStr(), checkOut: addDays(todayStr(), 1),
  rooms: 1, adults: 1, children: 0, extraBeds: 0,
  roomNumbers: '', finalAmount: '', paymentStatus: 'PAID', specialRequests: '',
});

const AdminCheckins = () => {
  const { getToken } = useAuth();
  const [date, setDate] = React.useState(todayStr());
  const [arrivals, setArrivals] = React.useState<CheckinRow[]>([]);
  const [inHouse, setInHouse] = React.useState<CheckinRow[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [busyId, setBusyId] = React.useState<number | null>(null);
  const [roomInputs, setRoomInputs] = React.useState<Record<number, string>>({});
  const [showWalkIn, setShowWalkIn] = React.useState(false);
  const [walkIn, setWalkIn] = React.useState(emptyWalkIn());
  const [savingWalkIn, setSavingWalkIn] = React.useState(false);

  const authHeaders = React.useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }), [getToken]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/checkins?date=${date}`, { cache: 'no-store', headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setArrivals(json.data.arrivals);
      setInHouse(json.data.inHouse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  }, [date, authHeaders]);

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms', { cache: 'no-store', headers: authHeaders() });
      const json = await res.json();
      if (res.ok) setCategories(json.data.map((c: Category) => ({ id: c.id, code: c.code, name: c.name })));
    } catch { /* ignore */ }
  }, [authHeaders]);

  React.useEffect(() => { fetchData(); }, [fetchData]);
  React.useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const action = async (bookingId: number, act: string, roomNumbers?: string) => {
    setBusyId(bookingId);
    setError('');
    try {
      const res = await fetch('/api/admin/checkins', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ bookingId, action: act, roomNumbers }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(
        act === 'check_in' ? `Guest checked in (booking #${bookingId})`
        : act === 'check_out' ? `Guest checked out (booking #${bookingId})`
        : 'Updated');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const submitWalkIn = async () => {
    if (!walkIn.fullName.trim() || !walkIn.phone.trim() || !walkIn.categoryCode) {
      setError('Name, phone and room type are required for a walk-in');
      return;
    }
    setSavingWalkIn(true);
    setError('');
    try {
      const res = await fetch('/api/admin/walk-in', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...walkIn,
          rooms: Number(walkIn.rooms), adults: Number(walkIn.adults),
          children: Number(walkIn.children), extraBeds: Number(walkIn.extraBeds),
          finalAmount: Number(walkIn.finalAmount || 0),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(`Walk-in checked in (booking #${json.data.id})`);
      setShowWalkIn(false);
      setWalkIn(emptyWalkIn());
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create walk-in');
    } finally {
      setSavingWalkIn(false);
    }
  };

  const isToday = date === todayStr();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Check-in Desk</h1>
          <p className="text-slate-600 mt-1">Check guests in/out, assign room numbers, and register walk-ins</p>
        </div>
        <button
          onClick={() => { setWalkIn(emptyWalkIn()); setShowWalkIn(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Add Walk-in
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4 text-red-500" /></button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
          <span className="text-green-700 text-sm">{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="h-4 w-4 text-green-500" /></button>
        </div>
      )}

      {/* Date selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-end gap-4 border border-slate-200">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Arrivals for date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        {!isToday && (
          <button onClick={() => setDate(todayStr())} className="px-3 py-2 text-sm text-blue-600 hover:underline">
            Jump to today
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {/* Arrivals */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-blue-600" />
              Arrivals — {date} <span className="text-slate-400 font-normal">({arrivals.length})</span>
            </h2>
            {arrivals.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No pending arrivals for this date.</p>
            ) : (
              <div className="space-y-3">
                {arrivals.map((b) => (
                  <div key={b.id} className="border border-slate-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">{b.guest_name}</span>
                        <span className="text-xs text-slate-500">#{b.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.payment_status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{b.payment_status}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {b.category_name} · {b.rooms} room{b.rooms > 1 ? 's' : ''} · {b.check_in} → {b.check_out}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.phone} · {b.adults} adult{b.adults > 1 ? 's' : ''}{b.children > 0 ? `, ${b.children} child` : ''}{b.extra_beds > 0 ? ` · ${b.extra_beds} extra bed` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Room no(s)"
                        value={roomInputs[b.id] ?? b.room_numbers ?? ''}
                        onChange={(e) => setRoomInputs((r) => ({ ...r, [b.id]: e.target.value }))}
                        className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => action(b.id, 'check_in', roomInputs[b.id] ?? b.room_numbers ?? '')}
                        disabled={busyId === b.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        <DoorOpen className="h-4 w-4" /> Check In
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* In-House */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-emerald-600" />
              In-House Guests <span className="text-slate-400 font-normal">({inHouse.length})</span>
            </h2>
            {inHouse.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No guests currently checked in.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-sm text-slate-600">
                      <th className="py-2 px-3 font-semibold">Guest</th>
                      <th className="py-2 px-3 font-semibold">Room Type</th>
                      <th className="py-2 px-3 font-semibold">Room No.</th>
                      <th className="py-2 px-3 font-semibold">Stay</th>
                      <th className="py-2 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inHouse.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100">
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-900 flex items-center gap-2">
                            {b.guest_name}
                            {b.is_walk_in && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">WALK-IN</span>}
                          </div>
                          <div className="text-xs text-slate-500">{b.phone} · #{b.id}</div>
                        </td>
                        <td className="py-3 px-3 text-sm text-slate-700">{b.category_name}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={roomInputs[b.id] ?? b.room_numbers ?? ''}
                              placeholder="—"
                              onChange={(e) => setRoomInputs((r) => ({ ...r, [b.id]: e.target.value }))}
                              className="w-24 px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            {(roomInputs[b.id] !== undefined && roomInputs[b.id] !== (b.room_numbers ?? '')) && (
                              <button onClick={() => action(b.id, 'assign_rooms', roomInputs[b.id])} disabled={busyId === b.id}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Save room number">
                                <Save className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-sm">
                          {b.departing_today
                            ? <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Departing today</span>
                            : <span className="text-slate-500 text-xs">until {b.check_out}</span>}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => action(b.id, 'check_out')}
                            disabled={busyId === b.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                          >
                            <LogOut className="h-4 w-4" /> Check Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Walk-in modal */}
      {showWalkIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-slate-900">Add Walk-in Guest</h3>
              <button onClick={() => setShowWalkIn(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name *</label>
                  <input type="text" value={walkIn.fullName} onChange={(e) => setWalkIn({ ...walkIn, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone *</label>
                  <input type="text" value={walkIn.phone} onChange={(e) => setWalkIn({ ...walkIn, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                <input type="email" value={walkIn.email} onChange={(e) => setWalkIn({ ...walkIn, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Room Type *</label>
                <select value={walkIn.categoryCode} onChange={(e) => setWalkIn({ ...walkIn, categoryCode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Select…</option>
                  {categories.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Check-in</label>
                <input type="date" value={walkIn.checkIn} onChange={(e) => setWalkIn({ ...walkIn, checkIn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Check-out</label>
                <input type="date" value={walkIn.checkOut} onChange={(e) => setWalkIn({ ...walkIn, checkOut: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Room No(s)</label>
                <input type="text" placeholder="e.g. 101, 102" value={walkIn.roomNumbers} onChange={(e) => setWalkIn({ ...walkIn, roomNumbers: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:col-span-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Rooms</label>
                  <input type="number" min={1} value={walkIn.rooms} onChange={(e) => setWalkIn({ ...walkIn, rooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Adults</label>
                  <input type="number" min={1} value={walkIn.adults} onChange={(e) => setWalkIn({ ...walkIn, adults: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Children</label>
                  <input type="number" min={0} value={walkIn.children} onChange={(e) => setWalkIn({ ...walkIn, children: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Extra Beds</label>
                  <input type="number" min={0} value={walkIn.extraBeds} onChange={(e) => setWalkIn({ ...walkIn, extraBeds: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Amount (₹)</label>
                <input type="number" min={0} value={walkIn.finalAmount} onChange={(e) => setWalkIn({ ...walkIn, finalAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Payment Status</label>
                <select value={walkIn.paymentStatus} onChange={(e) => setWalkIn({ ...walkIn, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  {['PAID', 'PENDING', 'CONFIRMED'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Special Requests</label>
                <textarea rows={2} value={walkIn.specialRequests} onChange={(e) => setWalkIn({ ...walkIn, specialRequests: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button onClick={submitWalkIn} disabled={savingWalkIn}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
                  <DoorOpen className="h-4 w-4" /> {savingWalkIn ? 'Saving…' : 'Create & Check In'}
                </button>
                <button onClick={() => setShowWalkIn(false)}
                  className="px-6 py-3 rounded-lg font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCheckins;
