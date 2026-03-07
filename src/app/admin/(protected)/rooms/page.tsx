'use client';

import React from 'react';
import { Search, Plus, Edit2, Trash2, X, Save, Ban, Calendar } from 'lucide-react';

interface Room {
  id: string;
  room_number: string;
  category: 'Deluxe' | 'Super Deluxe' | 'Executive Suite';
  base_price: number;
  max_occupancy: number;
  description: string;
  is_active: boolean;
}

interface Blockage {
  id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

const RoomManagement = () => {
  const [rooms, setRooms] = React.useState<Room[]>([
    {
      id: '1',
      room_number: '101',
      category: 'Deluxe',
      base_price: 4500,
      max_occupancy: 2,
      description: 'Cozy room with garden view',
      is_active: true
    },
    {
      id: '2',
      room_number: '201',
      category: 'Super Deluxe',
      base_price: 5500,
      max_occupancy: 3,
      description: 'Spacious room with sea view',
      is_active: true
    },
    {
      id: '3',
      room_number: '301',
      category: 'Executive Suite',
      base_price: 6500,
      max_occupancy: 4,
      description: 'Luxury suite with private balcony',
      is_active: true
    }
  ]);

  const [blockages, setBlockages] = React.useState<Blockage[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showRoomModal, setShowRoomModal] = React.useState(false);
  const [showBlockModal, setShowBlockModal] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);
  const [selectedRoomForBlock, setSelectedRoomForBlock] = React.useState<Room | null>(null);

  const [roomFormData, setRoomFormData] = React.useState({
    room_number: '',
    category: 'Deluxe' as Room['category'],
    base_price: '',
    max_occupancy: '',
    description: '',
    is_active: true
  });

  const [blockFormData, setBlockFormData] = React.useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  const filteredRooms = rooms.filter(room =>
    room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      room_number: '',
      category: 'Deluxe',
      base_price: '',
      max_occupancy: '',
      description: '',
      is_active: true
    });
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomFormData({
      room_number: room.room_number,
      category: room.category,
      base_price: room.base_price.toString(),
      max_occupancy: room.max_occupancy.toString(),
      description: room.description,
      is_active: room.is_active
    });
    setShowRoomModal(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== roomId));
      setBlockages(blockages.filter(b => b.room_id !== roomId));
    }
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? {
        ...r,
        ...roomFormData,
        base_price: parseFloat(roomFormData.base_price),
        max_occupancy: parseInt(roomFormData.max_occupancy)
      } : r));
    } else {
      const newRoom: Room = {
        id: Math.random().toString(36).substring(7),
        ...roomFormData,
        base_price: parseFloat(roomFormData.base_price),
        max_occupancy: parseInt(roomFormData.max_occupancy)
      };
      setRooms([...rooms, newRoom]);
    }
    setShowRoomModal(false);
  };

  const handleBlockRoom = (room: Room) => {
    setSelectedRoomForBlock(room);
    setBlockFormData({ start_date: '', end_date: '', reason: '' });
    setShowBlockModal(true);
  };

  const handleBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoomForBlock) {
      const newBlockage: Blockage = {
        id: Math.random().toString(36).substring(7),
        room_id: selectedRoomForBlock.id,
        ...blockFormData
      };
      setBlockages([...blockages, newBlockage]);
      setShowBlockModal(false);
    }
  };

  const handleRemoveBlock = (blockId: string) => {
    setBlockages(blockages.filter(b => b.id !== blockId));
  };

  const getRoomBlockages = (roomId: string) => {
    return blockages.filter(b => b.room_id === roomId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Room Management</h1>
          <p className="text-slate-600 mt-1">Manage room inventory and availability</p>
        </div>
        <button
          onClick={handleAddRoom}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-900">{rooms.filter(r => r.category === 'Deluxe').length}</div>
          <div className="text-sm text-blue-700">Deluxe Rooms</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-900">{rooms.filter(r => r.category === 'Super Deluxe').length}</div>
          <div className="text-sm text-green-700">Super Deluxe</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-900">{rooms.filter(r => r.category === 'Executive Suite').length}</div>
          <div className="text-sm text-orange-700">Executive Suites</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search rooms by number or category..."
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
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Room No.</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Occupancy</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Blockages</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room) => {
                const roomBlockages = getRoomBlockages(room.id);
                return (
                  <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">{room.room_number}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {room.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">₹{room.base_price.toLocaleString()}</td>
                    <td className="py-4 px-4 text-slate-700">{room.max_occupancy} guests</td>
                    <td className="py-4 px-4">
                      {room.is_active ? (
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
                      {roomBlockages.length > 0 ? (
                        <div className="space-y-1">
                          {roomBlockages.map((block) => (
                            <div key={block.id} className="text-xs bg-red-50 px-2 py-1 rounded flex items-center justify-between">
                              <span className="text-red-700">
                                {new Date(block.start_date).toLocaleDateString()} - {new Date(block.end_date).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => handleRemoveBlock(block.id)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleBlockRoom(room)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Block Room"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button onClick={() => setShowRoomModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={roomFormData.room_number}
                    onChange={(e) => setRoomFormData({ ...roomFormData, room_number: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
                  <select
                    required
                    value={roomFormData.category}
                    onChange={(e) => setRoomFormData({ ...roomFormData, category: e.target.value as Room['category'] })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Super Deluxe">Super Deluxe</option>
                    <option value="Executive Suite">Executive Suite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={roomFormData.base_price}
                    onChange={(e) => setRoomFormData({ ...roomFormData, base_price: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Occupancy *</label>
                  <input
                    type="number"
                    required
                    value={roomFormData.max_occupancy}
                    onChange={(e) => setRoomFormData({ ...roomFormData, max_occupancy: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={roomFormData.description}
                  onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={roomFormData.is_active}
                  onChange={(e) => setRoomFormData({ ...roomFormData, is_active: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Room is Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  <Save className="h-5 w-5" />
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBlockModal && selectedRoomForBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Block Room {selectedRoomForBlock.room_number}</h3>
              <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBlockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={blockFormData.start_date}
                  onChange={(e) => setBlockFormData({ ...blockFormData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">End Date *</label>
                <input
                  type="date"
                  required
                  value={blockFormData.end_date}
                  onChange={(e) => setBlockFormData({ ...blockFormData, end_date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                <textarea
                  value={blockFormData.reason}
                  onChange={(e) => setBlockFormData({ ...blockFormData, reason: e.target.value })}
                  rows={3}
                  placeholder="e.g., Maintenance, Renovation, etc."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
                >
                  <Calendar className="h-5 w-5" />
                  Block Room
                </button>
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
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

export default RoomManagement;
