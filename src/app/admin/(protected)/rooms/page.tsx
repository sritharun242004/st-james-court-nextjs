'use client';

import React from 'react';
import { BedDouble, Calendar, Save, AlertCircle, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RoomCategory {
  id: number;
  code: string;
  name: string;
  capacity: number;
  max_occupancy_per_room: number;
  max_extra_beds_per_room: number;
}

interface InventoryRow {
  id: number;
  date: string;
  base_available: number;
  base_price: string;
  extra_bed_price: string;
  booked: number;
}

const RoomManagement = () => {
  const { getToken } = useAuth();
  const [categories, setCategories] = React.useState<RoomCategory[]>([]);
  const [inventory, setInventory] = React.useState<InventoryRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [inventoryLoading, setInventoryLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Filters
  const [selectedCategory, setSelectedCategory] = React.useState<number | ''>('');
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(defaultEnd);

  // Bulk update form
  const [bulkForm, setBulkForm] = React.useState({
    categoryId: '' as number | '',
    startDate: today,
    endDate: defaultEnd,
    baseAvailable: '',
    basePrice: '',
    extraBedPrice: '',
  });
  const [updating, setUpdating] = React.useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms', { headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCategories(json.data);
      if (json.data.length > 0 && selectedCategory === '') {
        setSelectedCategory(json.data[0].id);
        setBulkForm(f => ({ ...f, categoryId: json.data[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [getToken, selectedCategory]);

  const fetchInventory = React.useCallback(async () => {
    if (!selectedCategory) return;
    setInventoryLoading(true);
    try {
      const params = new URLSearchParams({
        categoryId: String(selectedCategory),
        startDate,
        endDate,
      });
      const res = await fetch(`/api/admin/rooms/inventory?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setInventory(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setInventoryLoading(false);
    }
  }, [getToken, selectedCategory, startDate, endDate]);

  React.useEffect(() => { fetchCategories(); }, [fetchCategories]);
  React.useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const handleBulkUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/rooms/inventory', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          categoryId: bulkForm.categoryId,
          startDate: bulkForm.startDate,
          endDate: bulkForm.endDate,
          baseAvailable: parseInt(bulkForm.baseAvailable),
          basePrice: parseFloat(bulkForm.basePrice),
          extraBedPrice: bulkForm.extraBedPrice ? parseFloat(bulkForm.extraBedPrice) : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.data.message);
      await fetchInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Room Inventory Management</h1>
        <p className="text-slate-600 mt-1">Manage room categories and per-date inventory</p>
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

      {/* Category Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className={`rounded-lg p-4 border cursor-pointer transition-colors ${
            selectedCategory === cat.id
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`} onClick={() => {
            setSelectedCategory(cat.id);
            setBulkForm(f => ({ ...f, categoryId: cat.id }));
          }}>
            <div className="flex items-center gap-3 mb-2">
              <BedDouble className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-slate-900">{cat.name}</h3>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Code: <span className="font-mono text-slate-800">{cat.code}</span></p>
              <p>Capacity: {cat.capacity} guests</p>
              <p>Max occupancy/room: {cat.max_occupancy_per_room}</p>
              <p>Extra beds: {cat.max_extra_beds_per_room}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Inventory View
        </h3>
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setSelectedCategory(val);
                setBulkForm(f => ({ ...f, categoryId: val }));
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchInventory}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {inventoryLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : inventory.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">No inventory data for this date range. Use the bulk update form below to set up inventory.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Available</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Price (₹)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Extra Bed (₹)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Booked</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Net Available</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => {
                  const net = row.base_available - row.booked;
                  return (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{row.date}</td>
                      <td className="py-3 px-4">{row.base_available}</td>
                      <td className="py-3 px-4">₹{parseFloat(row.base_price).toLocaleString()}</td>
                      <td className="py-3 px-4">₹{parseFloat(row.extra_bed_price).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={row.booked > 0 ? 'text-orange-600 font-semibold' : ''}>
                          {row.booked}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${net <= 0 ? 'text-red-600' : net <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                          {net}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk Update Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bulk Update Inventory</h3>
        <form onSubmit={handleBulkUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                required
                value={bulkForm.categoryId}
                onChange={(e) => setBulkForm({ ...bulkForm, categoryId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={bulkForm.startDate}
                onChange={(e) => setBulkForm({ ...bulkForm, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={bulkForm.endDate}
                onChange={(e) => setBulkForm({ ...bulkForm, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rooms Available *</label>
              <input
                type="number"
                required
                min="0"
                value={bulkForm.baseAvailable}
                onChange={(e) => setBulkForm({ ...bulkForm, baseAvailable: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={bulkForm.basePrice}
                onChange={(e) => setBulkForm({ ...bulkForm, basePrice: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Extra Bed Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={bulkForm.extraBedPrice}
                onChange={(e) => setBulkForm({ ...bulkForm, extraBedPrice: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updating}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {updating ? 'Updating...' : 'Update Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomManagement;
