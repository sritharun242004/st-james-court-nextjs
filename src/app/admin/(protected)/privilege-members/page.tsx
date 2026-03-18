'use client';

import React from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MemberData {
  id: number;
  cardNumber: string;
  active: boolean;
  issuedAt: string;
  expiryDate: string | null;
  issueChannel: string;
  notes: string | null;
  userId: number | null;
  userName: string | null;
  userPhone: string | null;
  userEmail: string | null;
}

interface UserOption {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
}

const PrivilegeMembers = () => {
  const { getToken } = useAuth();
  const [members, setMembers] = React.useState<MemberData[]>([]);
  const [users, setUsers] = React.useState<UserOption[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<MemberData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [formError, setFormError] = React.useState('');
  const [formData, setFormData] = React.useState({
    cardNumber: '',
    userId: '',
    expiryDate: '',
    notes: '',
    issueChannel: 'ONLINE',
  });

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchMembers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/privilege-members', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMembers(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load privilege members');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (res.ok) setUsers(json.data);
    } catch {
      // silent
    }
  }, [getToken]);

  React.useEffect(() => {
    fetchMembers();
    fetchUsers();
  }, [fetchMembers, fetchUsers]);

  const filteredMembers = members.filter(m =>
    m.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.userPhone || '').includes(searchTerm)
  );

  const generateCardNumber = () => {
    const prefix = 'SJC';
    const num = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${num}`;
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      cardNumber: generateCardNumber(),
      userId: '',
      expiryDate: '',
      notes: '',
      issueChannel: 'ONLINE',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleEdit = (member: MemberData) => {
    setEditingMember(member);
    setFormData({
      cardNumber: member.cardNumber,
      userId: member.userId ? String(member.userId) : '',
      expiryDate: member.expiryDate ? member.expiryDate.split('T')[0] : '',
      notes: member.notes || '',
      issueChannel: member.issueChannel || 'ONLINE',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDeactivate = async (memberId: number) => {
    if (!confirm('Are you sure you want to deactivate this privilege card?')) return;
    try {
      const res = await fetch(`/api/admin/privilege-members/${memberId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchMembers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate card');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingMember) {
        const res = await fetch(`/api/admin/privilege-members/${editingMember.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            active: true,
            userId: formData.userId ? parseInt(formData.userId) : null,
            expiryDate: formData.expiryDate || null,
            notes: formData.notes || null,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
      } else {
        const res = await fetch('/api/admin/privilege-members', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            cardNumber: formData.cardNumber,
            userId: formData.userId ? parseInt(formData.userId) : null,
            expiryDate: formData.expiryDate || null,
            notes: formData.notes || null,
            issueChannel: formData.issueChannel,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
      }
      setShowModal(false);
      await fetchMembers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Operation failed');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Privilege Members</h1>
          <p className="text-slate-600 mt-1">Manage privilege cards and member discounts</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Issue Card
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="h-4 w-4 text-red-500" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by card number, name, or phone..."
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
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Card Number</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Linked User</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Channel</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Expiry</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    {searchTerm ? 'No cards match your search.' : 'No privilege cards issued yet.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span className="font-mono font-medium text-slate-900">{member.cardNumber}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {member.userName ? (
                        <div>
                          <div className="font-medium text-slate-900">{member.userName}</div>
                          <div className="text-sm text-slate-500">{member.userPhone}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">Not linked</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {member.active ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-700 text-sm">{member.issueChannel}</td>
                    <td className="py-4 px-4 text-slate-700 text-sm">
                      {member.expiryDate ? member.expiryDate.split('T')[0] : '—'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {member.active && (
                          <button
                            onClick={() => handleDeactivate(member.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingMember ? 'Edit Privilege Card' : 'Issue New Privilege Card'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Card Number *</label>
                <input
                  type="text"
                  required
                  disabled={!!editingMember}
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Link to User (Optional)</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">— No user linked —</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {!editingMember && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Issue Channel</label>
                    <select
                      value={formData.issueChannel}
                      onChange={(e) => setFormData({ ...formData, issueChannel: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-5 w-5" />
                  {editingMember ? 'Update Card' : 'Issue Card'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
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

export default PrivilegeMembers;
