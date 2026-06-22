'use client';

import React from 'react';
import Image from 'next/image';
import { BedDouble, Calendar, Save, AlertCircle, X, RefreshCw, Plus, Pencil, Trash2, Upload, Lock, Unlock, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RoomCategory {
  id: number;
  code: string;
  name: string;
  capacity: number;
  max_occupancy_per_room: number;
  max_extra_beds_per_room: number;
  base_price: number | null;
  slug: string | null;
  category_group: string | null;
  size_label: string | null;
  bed_type: string | null;
  short_description: string | null;
  long_description: string | null;
  features: string[] | null;
  amenities: string[] | null;
  highlights: string[] | null;
  images: string[] | null;
  sort_order: number | null;
  active: boolean | null;
}

interface CategoryForm {
  name: string;
  code: string;
  capacity: string;
  maxOccupancy: string;
  maxExtraBeds: string;
  basePrice: string;
  baseAvailable: string;
  extraBedPrice: string;
  slug: string;
  categoryGroup: string;
  sizeLabel: string;
  bedType: string;
  shortDescription: string;
  longDescription: string;
  features: string;
  amenities: string;
  highlights: string;
  images: string[];
  sortOrder: string;
  active: boolean;
}

const emptyCategoryForm: CategoryForm = {
  name: '',
  code: '',
  capacity: '',
  maxOccupancy: '2',
  maxExtraBeds: '1',
  basePrice: '',
  baseAvailable: '10',
  extraBedPrice: '1500',
  slug: '',
  categoryGroup: 'deluxe',
  sizeLabel: '',
  bedType: '',
  shortDescription: '',
  longDescription: '',
  features: '',
  amenities: '',
  highlights: '',
  images: [],
  sortOrder: '100',
  active: true,
};

interface InventoryRow {
  id: number;
  date: string;
  base_available: number;
  blocked: number;
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

  // Block / hold form
  const [blockForm, setBlockForm] = React.useState({
    categoryId: '' as number | '',
    startDate: today,
    endDate: defaultEnd,
    blocked: '',
  });
  const [blocking, setBlocking] = React.useState(false);

  // Category create/edit modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [catForm, setCatForm] = React.useState<CategoryForm>(emptyCategoryForm);
  const [savingCat, setSavingCat] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [seeding, setSeeding] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms', { cache: 'no-store', headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCategories(json.data);
      if (json.data.length > 0 && selectedCategory === '') {
        setSelectedCategory(json.data[0].id);
        setBulkForm(f => ({ ...f, categoryId: json.data[0].id }));
        setBlockForm(f => ({ ...f, categoryId: json.data[0].id }));
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
        cache: 'no-store',
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

  const handleBlock = async (mode: 'block' | 'unblock') => {
    setError('');
    setSuccess('');
    setBlocking(true);
    try {
      const res = await fetch('/api/admin/rooms/inventory', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          categoryId: blockForm.categoryId,
          startDate: blockForm.startDate,
          endDate: blockForm.endDate,
          blocked: mode === 'block' ? parseInt(blockForm.blocked) : 0,
          mode,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.data.message);
      await fetchInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Block update failed');
    } finally {
      setBlocking(false);
    }
  };

  const handleLoadDefaults = async () => {
    if (!window.confirm(
      'Load the 5 default room types (Deluxe, Super Deluxe & Heritage, Executive Suite, Family, Club) ' +
      'and reset the next 90 days of inventory to the default weekday/weekend tariff?\n\n' +
      'This overwrites current pricing & availability for those dates.'
    )) return;
    setError('');
    setSuccess('');
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed-inventory', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.message || 'Default room types and inventory loaded');
      await fetchCategories();
      await fetchInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load defaults');
    } finally {
      setSeeding(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setCatForm(emptyCategoryForm);
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const openEditModal = (cat: RoomCategory) => {
    setEditingId(cat.id);
    setCatForm({
      name: cat.name,
      code: cat.code,
      capacity: cat.capacity != null ? String(cat.capacity) : '',
      maxOccupancy: String(cat.max_occupancy_per_room ?? 2),
      maxExtraBeds: String(cat.max_extra_beds_per_room ?? 1),
      basePrice: cat.base_price != null ? String(cat.base_price) : '',
      baseAvailable: '10',
      extraBedPrice: '1500',
      slug: cat.slug ?? '',
      categoryGroup: cat.category_group ?? 'deluxe',
      sizeLabel: cat.size_label ?? '',
      bedType: cat.bed_type ?? '',
      shortDescription: cat.short_description ?? '',
      longDescription: cat.long_description ?? '',
      features: (cat.features ?? []).join('\n'),
      amenities: (cat.amenities ?? []).join('\n'),
      highlights: (cat.highlights ?? []).join('\n'),
      images: cat.images ?? [],
      sortOrder: cat.sort_order != null ? String(cat.sort_order) : '100',
      active: cat.active !== false,
    });
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        if (editingId) fd.append('categoryId', String(editingId));
        const res = await fetch('/api/admin/rooms/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setCatForm(f => ({ ...f, images: [...f.images, json.data.url] }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setCatForm(f => ({ ...f, images: f.images.filter(u => u !== url) }));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setCatForm(f => {
      const imgs = [...f.images];
      const j = index + dir;
      if (j < 0 || j >= imgs.length) return f;
      [imgs[index], imgs[j]] = [imgs[j], imgs[index]];
      return { ...f, images: imgs };
    });
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingCat(true);
    try {
      const payload = {
        name: catForm.name,
        code: catForm.code,
        capacity: catForm.capacity,
        maxOccupancy: catForm.maxOccupancy,
        maxExtraBeds: catForm.maxExtraBeds,
        basePrice: catForm.basePrice,
        baseAvailable: catForm.baseAvailable,
        extraBedPrice: catForm.extraBedPrice,
        slug: catForm.slug,
        categoryGroup: catForm.categoryGroup,
        sizeLabel: catForm.sizeLabel,
        bedType: catForm.bedType,
        shortDescription: catForm.shortDescription,
        longDescription: catForm.longDescription,
        features: catForm.features,
        amenities: catForm.amenities,
        highlights: catForm.highlights,
        images: catForm.images,
        sortOrder: catForm.sortOrder,
        active: catForm.active,
      };
      const res = await fetch(
        editingId ? `/api/admin/rooms/${editingId}` : '/api/admin/rooms',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.data.message);
      setModalOpen(false);
      await fetchCategories();
      await fetchInventory();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save room type');
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: RoomCategory) => {
    if (!window.confirm(`Delete "${cat.name}"? This removes its inventory and cannot be undone.`)) return;
    setError('');
    setSuccess('');
    setDeletingId(cat.id);
    try {
      const res = await fetch(`/api/admin/rooms/${cat.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.data.message);
      if (selectedCategory === cat.id) setSelectedCategory('');
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room type');
    } finally {
      setDeletingId(null);
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Room Inventory Management</h1>
          <p className="text-slate-600 mt-1">Manage room categories, content, pricing and per-date inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDefaults}
            disabled={seeding}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Loading...' : 'Load Defaults'}
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Add Room Type
          </button>
        </div>
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
            setBlockForm(f => ({ ...f, categoryId: cat.id }));
          }}>
            <div className="flex items-start gap-3 mb-2">
              {cat.images && cat.images.length > 0 ? (
                <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0 bg-slate-100">
                  <Image src={cat.images[0]} alt={cat.name} fill className="object-cover" sizes="40px" unoptimized />
                </div>
              ) : (
                <BedDouble className="h-6 w-6 text-blue-600 flex-shrink-0" />
              )}
              <h3 className="font-bold text-slate-900 flex-1">
                {cat.name}
                {cat.active === false && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    <EyeOff className="h-3 w-3" /> Hidden
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}
                  title="Edit room type"
                  className="p-1.5 rounded-md text-slate-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                  disabled={deletingId === cat.id}
                  title="Delete room type"
                  className="p-1.5 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>Code: <span className="font-mono text-slate-800">{cat.code}</span></p>
              <p>Price: <span className="font-semibold text-slate-800">{cat.base_price != null ? `₹${cat.base_price.toLocaleString()}/night` : '—'}</span></p>
              <p>Capacity: {cat.capacity} guests</p>
              <p>Max occupancy/room: {cat.max_occupancy_per_room}</p>
              <p>Extra beds: {cat.max_extra_beds_per_room}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
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
                setBlockForm(f => ({ ...f, categoryId: val }));
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
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Price (₹)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Extra Bed (₹)</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Booked</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Blocked</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Net Available</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => {
                  const net = row.base_available - (row.blocked || 0) - row.booked;
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
                        <span className={row.blocked > 0 ? 'text-purple-600 font-semibold' : ''}>
                          {row.blocked || 0}
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
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Bulk Update Inventory (price &amp; availability)</h3>
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

      {/* Block / Hold Rooms */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Internal Holds (block rooms)
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Hold rooms for offline/bulk bookings without touching the true capacity. Net available = total − booked − blocked.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={blockForm.categoryId}
              onChange={(e) => setBlockForm({ ...blockForm, categoryId: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input
              type="date"
              value={blockForm.startDate}
              onChange={(e) => setBlockForm({ ...blockForm, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              value={blockForm.endDate}
              onChange={(e) => setBlockForm({ ...blockForm, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rooms to block</label>
            <input
              type="number"
              min="0"
              value={blockForm.blocked}
              onChange={(e) => setBlockForm({ ...blockForm, blocked: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleBlock('block')}
            disabled={blocking || !blockForm.categoryId || blockForm.blocked === ''}
            className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {blocking ? 'Working...' : 'Block Rooms'}
          </button>
          <button
            onClick={() => handleBlock('unblock')}
            disabled={blocking || !blockForm.categoryId}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <Unlock className="h-4 w-4" />
            Release Holds
          </button>
        </div>
      </div>

      {/* Create / Edit Room Type Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !savingCat && setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Room Type' : 'Add Room Type'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="p-5 space-y-5">
              {/* Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    placeholder="e.g. Super Triplex Room"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={catForm.code}
                    onChange={(e) => setCatForm({ ...catForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUPER_TRIPLEX"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-1">Uppercase identifier; spaces become _</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL slug</label>
                  <input
                    type="text"
                    value={catForm.slug}
                    onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                    placeholder="auto from name (e.g. super-triplex)"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-1">Detail page URL: /rooms/&lt;slug&gt;</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (₹/night) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={catForm.basePrice}
                    onChange={(e) => setCatForm({ ...catForm, basePrice: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Group (showcase filter)</label>
                  <input
                    type="text"
                    value={catForm.categoryGroup}
                    onChange={(e) => setCatForm({ ...catForm, categoryGroup: e.target.value })}
                    placeholder="e.g. deluxe / suite / family"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity (guests)</label>
                  <input
                    type="number"
                    min="0"
                    value={catForm.capacity}
                    onChange={(e) => setCatForm({ ...catForm, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max occupancy/room</label>
                  <input
                    type="number"
                    min="1"
                    value={catForm.maxOccupancy}
                    onChange={(e) => setCatForm({ ...catForm, maxOccupancy: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max extra beds/room</label>
                  <input
                    type="number"
                    min="0"
                    value={catForm.maxExtraBeds}
                    onChange={(e) => setCatForm({ ...catForm, maxExtraBeds: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Size label</label>
                  <input
                    type="text"
                    value={catForm.sizeLabel}
                    onChange={(e) => setCatForm({ ...catForm, sizeLabel: e.target.value })}
                    placeholder="e.g. 450 sq ft"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bed type</label>
                  <input
                    type="text"
                    value={catForm.bedType}
                    onChange={(e) => setCatForm({ ...catForm, bedType: e.target.value })}
                    placeholder="e.g. King Size Bed"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sort order</label>
                  <input
                    type="number"
                    value={catForm.sortOrder}
                    onChange={(e) => setCatForm({ ...catForm, sortOrder: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">Lower shows first</p>
                </div>
                {!editingId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rooms available/night</label>
                      <input
                        type="number"
                        min="0"
                        value={catForm.baseAvailable}
                        onChange={(e) => setCatForm({ ...catForm, baseAvailable: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-400 mt-1">Seeds inventory for the next year</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Extra bed price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        value={catForm.extraBedPrice}
                        onChange={(e) => setCatForm({ ...catForm, extraBedPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short description (card)</label>
                <textarea
                  value={catForm.shortDescription}
                  onChange={(e) => setCatForm({ ...catForm, shortDescription: e.target.value })}
                  rows={2}
                  placeholder="One-line summary shown on the rooms grid"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Long description (detail page)</label>
                <textarea
                  value={catForm.longDescription}
                  onChange={(e) => setCatForm({ ...catForm, longDescription: e.target.value })}
                  rows={4}
                  placeholder="Full description shown on the room detail page"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lists */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Features</label>
                  <textarea
                    value={catForm.features}
                    onChange={(e) => setCatForm({ ...catForm, features: e.target.value })}
                    rows={5}
                    placeholder="One per line"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
                  <textarea
                    value={catForm.amenities}
                    onChange={(e) => setCatForm({ ...catForm, amenities: e.target.value })}
                    rows={5}
                    placeholder="One per line"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Highlights</label>
                  <textarea
                    value={catForm.highlights}
                    onChange={(e) => setCatForm({ ...catForm, highlights: e.target.value })}
                    rows={5}
                    placeholder="One per line"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photos</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {catForm.images.map((url, idx) => (
                    <div key={url} className="relative group h-24 w-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        title="Remove"
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="absolute bottom-1 left-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => moveImage(idx, -1)} className="bg-black/60 text-white rounded px-1.5 text-xs">←</button>
                        <button type="button" onClick={() => moveImage(idx, 1)} className="bg-black/60 text-white rounded px-1.5 text-xs">→</button>
                      </div>
                    </div>
                  ))}
                  <label className={`h-24 w-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs">{uploading ? 'Uploading...' : 'Add photos'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => { handleImageUpload(e.target.files); e.target.value = ''; }}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400">First photo is used as the main image. Max 4 MB each (JPEG/PNG/WebP).</p>
              </div>

              {/* Visibility */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={catForm.active}
                  onChange={(e) => setCatForm({ ...catForm, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Visible &amp; bookable on the public site</span>
              </label>

              {editingId && (
                <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">
                  Saving updates the room everywhere on the site — booking page price for all upcoming dates,
                  the rooms showcase and the detail page.
                </p>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCat || uploading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingCat ? 'Saving...' : editingId ? 'Save Changes' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
