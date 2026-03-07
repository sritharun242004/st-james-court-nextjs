'use client';

import React from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Tag, Percent } from 'lucide-react';

interface Discount {
  id: string;
  category: 'room' | 'food' | 'drinks';
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  applicable_to: string;
  description: string;
  is_active: boolean;
}

const DiscountManagement = () => {
  const [discounts, setDiscounts] = React.useState<Discount[]>([
    {
      id: '1',
      category: 'room',
      discount_type: 'percentage',
      discount_value: 20,
      start_date: '2024-12-01',
      end_date: '2024-12-31',
      applicable_to: 'All Categories',
      description: 'Holiday Season Special',
      is_active: true
    },
    {
      id: '2',
      category: 'food',
      discount_type: 'fixed',
      discount_value: 500,
      start_date: '2024-11-15',
      end_date: '2024-11-30',
      applicable_to: 'Le Jardin Restaurant',
      description: 'Fine Dining Discount',
      is_active: true
    }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editingDiscount, setEditingDiscount] = React.useState<Discount | null>(null);
  const [formData, setFormData] = React.useState({
    category: 'room' as Discount['category'],
    discount_type: 'percentage' as Discount['discount_type'],
    discount_value: '',
    start_date: '',
    end_date: '',
    applicable_to: '',
    description: '',
    is_active: true
  });

  const filteredDiscounts = discounts.filter(discount =>
    discount.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingDiscount(null);
    setFormData({
      category: 'room',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      applicable_to: '',
      description: '',
      is_active: true
    });
    setShowModal(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      category: discount.category,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      start_date: discount.start_date,
      end_date: discount.end_date,
      applicable_to: discount.applicable_to,
      description: discount.description,
      is_active: discount.is_active
    });
    setShowModal(true);
  };

  const handleDelete = (discountId: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      setDiscounts(discounts.filter(d => d.id !== discountId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDiscount) {
      setDiscounts(discounts.map(d => d.id === editingDiscount.id ? {
        ...d,
        ...formData,
        discount_value: parseFloat(formData.discount_value)
      } : d));
    } else {
      const newDiscount: Discount = {
        id: Math.random().toString(36).substring(7),
        ...formData,
        discount_value: parseFloat(formData.discount_value)
      };
      setDiscounts([...discounts, newDiscount]);
    }
    setShowModal(false);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'room': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'drinks': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDiscount = (discount: Discount) => {
    if (discount.discount_type === 'percentage') {
      return `${discount.discount_value}% OFF`;
    } else {
      return `₹${discount.discount_value} OFF`;
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Discount Management</h1>
          <p className="text-slate-600 mt-1">Create and manage promotional offers</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Discount
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-900">
                {discounts.filter(d => d.category === 'room' && d.is_active).length}
              </div>
              <div className="text-sm text-blue-700">Room Discounts</div>
            </div>
            <Tag className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">
                {discounts.filter(d => d.category === 'food' && d.is_active).length}
              </div>
              <div className="text-sm text-green-700">Food Discounts</div>
            </div>
            <Tag className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-900">
                {discounts.filter(d => d.category === 'drinks' && d.is_active).length}
              </div>
              <div className="text-sm text-orange-700">Drink Discounts</div>
            </div>
            <Tag className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Discount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Applicable To</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Validity</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(discount.category)}`}>
                      {discount.category.charAt(0).toUpperCase() + discount.category.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">{discount.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 font-semibold text-green-600">
                      {discount.discount_type === 'percentage' ? (
                        <Percent className="h-4 w-4" />
                      ) : (
                        <span>₹</span>
                      )}
                      {formatDiscount(discount)}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700">{discount.applicable_to || 'All'}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="text-slate-700">
                        {new Date(discount.start_date).toLocaleDateString()}
                      </div>
                      <div className="text-slate-500">to</div>
                      <div className="text-slate-700">
                        {new Date(discount.end_date).toLocaleDateString()}
                      </div>
                      {isExpiringSoon(discount.end_date) && (
                        <span className="text-xs text-orange-600 font-semibold mt-1 block">
                          Expiring Soon
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {discount.is_active ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Discount['category'] })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="room">Room</option>
                    <option value="food">Food</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type *</label>
                  <select
                    required
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as Discount['discount_type'] })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Applicable To</label>
                <input
                  type="text"
                  value={formData.applicable_to}
                  onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value })}
                  placeholder="e.g., Deluxe Rooms, Le Jardin Restaurant, or leave blank for all"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="e.g., Holiday Season Special Offer"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Discount is Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Save className="h-5 w-5" />
                  {editingDiscount ? 'Update Discount' : 'Create Discount'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
