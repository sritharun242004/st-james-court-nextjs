'use client';

import React from 'react';
import { Plus, Edit2, Trash2, X, Save, Tag, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DiscountRule {
  id: number;
  date: string;
  room_discount: number;
  food_discount: number;
  bar_discount: number;
  active: boolean;
}

const DiscountManagement = () => {
  const { getToken } = useAuth();
  const [discounts, setDiscounts] = React.useState<DiscountRule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [editingDiscount, setEditingDiscount] = React.useState<DiscountRule | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

  const [createForm, setCreateForm] = React.useState({
    startDate: today,
    endDate: defaultEnd,
    roomDiscount: '',
    foodDiscount: '',
    barDiscount: '',
    active: true,
  });

  const [editForm, setEditForm] = React.useState({
    roomDiscount: '',
    foodDiscount: '',
    barDiscount: '',
    active: true,
  });

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchDiscounts = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/discounts', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDiscounts(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  React.useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          startDate: createForm.startDate,
          endDate: createForm.endDate,
          roomDiscount: parseFloat(createForm.roomDiscount) || 0,
          foodDiscount: parseFloat(createForm.foodDiscount) || 0,
          barDiscount: parseFloat(createForm.barDiscount) || 0,
          active: createForm.active,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(json.data.message);
      setShowCreateModal(false);
      await fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  };

  const handleEdit = (d: DiscountRule) => {
    setEditingDiscount(d);
    setEditForm({
      roomDiscount: String(d.room_discount),
      foodDiscount: String(d.food_discount),
      barDiscount: String(d.bar_discount),
      active: d.active,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiscount) return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`/api/admin/discounts/${editingDiscount.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          roomDiscount: parseFloat(editForm.roomDiscount) || 0,
          foodDiscount: parseFloat(editForm.foodDiscount) || 0,
          barDiscount: parseFloat(editForm.barDiscount) || 0,
          active: editForm.active,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditingDiscount(null);
      await fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this discount rule?')) return;
    setError('');
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchDiscounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  // Summary stats
  const activeRules = discounts.filter(d => d.active);
  const withRoom = activeRules.filter(d => d.room_discount > 0).length;
  const withFood = activeRules.filter(d => d.food_discount > 0).length;
  const withBar = activeRules.filter(d => d.bar_discount > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discount Management</h1>
          <p className="text-slate-600 mt-1">Manage per-date discount rules for privilege members</p>
        </div>
        <button
          onClick={() => {
            setCreateForm({ startDate: today, endDate: defaultEnd, roomDiscount: '', foodDiscount: '', barDiscount: '', active: true });
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Discount Rules
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">{withRoom}</div>
              <div className="text-sm text-blue-700">Room Discount Dates</div>
            </div>
            <Tag className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{withFood}</div>
              <div className="text-sm text-green-700">Food Discount Dates</div>
            </div>
            <Tag className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-900">{withBar}</div>
              <div className="text-sm text-orange-700">Bar Discount Dates</div>
            </div>
            <Tag className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Discount Rules Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Room %</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Food %</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Bar %</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No discount rules found. Create some using the button above.
                  </td>
                </tr>
              ) : (
                discounts.map((d) => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-sm">{d.date}</td>
                    <td className="py-3 px-4">
                      <span className={d.room_discount > 0 ? 'text-blue-600 font-semibold' : 'text-slate-400'}>
                        {d.room_discount}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={d.food_discount > 0 ? 'text-green-600 font-semibold' : 'text-slate-400'}>
                        {d.food_discount}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={d.bar_discount > 0 ? 'text-orange-600 font-semibold' : 'text-slate-400'}>
                        {d.bar_discount}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {d.active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Create Discount Rules</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Room %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={createForm.roomDiscount}
                    onChange={(e) => setCreateForm({ ...createForm, roomDiscount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Food %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={createForm.foodDiscount}
                    onChange={(e) => setCreateForm({ ...createForm, foodDiscount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bar %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={createForm.barDiscount}
                    onChange={(e) => setCreateForm({ ...createForm, barDiscount: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="create_active"
                  checked={createForm.active}
                  onChange={(e) => setCreateForm({ ...createForm, active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="create_active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Save className="h-5 w-5" />
                  Create Rules
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDiscount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Edit Rule — {editingDiscount.date}
              </h3>
              <button onClick={() => setEditingDiscount(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Room %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editForm.roomDiscount}
                    onChange={(e) => setEditForm({ ...editForm, roomDiscount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Food %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editForm.foodDiscount}
                    onChange={(e) => setEditForm({ ...editForm, foodDiscount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bar %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editForm.barDiscount}
                    onChange={(e) => setEditForm({ ...editForm, barDiscount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit_active"
                  checked={editForm.active}
                  onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="edit_active" className="text-sm font-medium text-slate-700">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Save className="h-5 w-5" />
                  Update Rule
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDiscount(null)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManagement;
