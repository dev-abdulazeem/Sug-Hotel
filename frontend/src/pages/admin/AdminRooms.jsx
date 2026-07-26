import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Star,
  Search,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const roomTypes = ['STANDARD', 'DELUXE', 'PREMIUM', 'EXECUTIVE', 'SUITE', 'PENTHOUSE'];
const amenityOptions = ['WiFi', 'AC', 'Mini Bar', 'Smart TV', 'City View', 'Panoramic View', 'Bathtub', 'Jacuzzi', 'Living Room', 'Kitchenette', 'Parking', 'Room Service'];

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'DELUXE',
    pricePerNight: '',
    capacity: '2',
    size: '',
    bedType: 'King Size',
    amenities: [],
    featured: false,
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await api.get('/rooms');
      setRooms(data.rooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'DELUXE',
      pricePerNight: '',
      capacity: '2',
      size: '',
      bedType: 'King Size',
      amenities: [],
      featured: false,
      images: [],
    });
    setImageFiles([]);
    setEditingRoom(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity.toString(),
      size: room.size?.toString() || '',
      bedType: room.bedType,
      amenities: room.amenities,
      featured: room.featured,
      images: room.images,
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('pricePerNight', formData.pricePerNight);
    data.append('capacity', formData.capacity);
    data.append('bedType', formData.bedType);
    data.append('featured', formData.featured);
    if (formData.size) data.append('size', formData.size);
    data.append('amenities', formData.amenities.join(','));

    imageFiles.forEach((file) => {
      data.append('images', file);
    });

    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room updated successfully');
      } else {
        await api.post('/rooms', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success('Room deleted');
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal mb-1">Rooms</h1>
          <p className="text-sm text-gray-500">Manage your hotel rooms</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-light text-white px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add Room</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search rooms..."
          className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden group"
          >
            <div className="relative h-48">
              <img
                src={room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {room.featured && (
                <div className="absolute top-3 left-3">
                  <Star size={14} className="text-gold fill-gold" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(room)}
                  className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Pencil size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-charcoal">{room.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {room.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{room.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gold font-medium">${room.pricePerNight}<span className="text-gray-400 text-xs">/night</span></span>
                <span className="text-xs text-gray-400">{room.capacity} guests</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-charcoal">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Room Name *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Room Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  >
                    {roomTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold resize-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Price/Night *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Size (sq ft)</label>
                  <input
                    type="number"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Bed Type *</label>
                  <input
                    required
                    value={formData.bedType}
                    onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-gold text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                />
                <label htmlFor="featured" className="text-sm text-gray-600">Featured room (shown on homepage)</label>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Room Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag & drop images or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="hidden"
                    id="room-images"
                  />
                  <label
                    htmlFor="room-images"
                    className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                  {imageFiles.length > 0 && (
                    <p className="text-xs text-gold mt-2">{imageFiles.length} file(s) selected</p>
                  )}
                </div>
                {editingRoom && formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gold hover:bg-gold-light disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  <span>{editingRoom ? 'Update Room' : 'Create Room'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}