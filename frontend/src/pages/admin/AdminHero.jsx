import { useEffect, useState } from 'react';
import {
  Plus,
  X,
  Upload,
  Trash2,
  GripVertical,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminHero() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageFile: null,
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await api.get('/hero');
      setImages(data.images);
    } catch (error) {
      toast.error('Failed to load hero images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageFile) {
      toast.error('Please select an image');
      return;
    }

    setSubmitting(true);
    const data = new FormData();
    data.append('image', formData.imageFile);
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);

    try {
      await api.post('/hero', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Hero image added');
      setShowModal(false);
      setFormData({ title: '', subtitle: '', imageFile: null });
      fetchImages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hero image?')) return;
    try {
      await api.delete(`/hero/${id}`);
      toast.success('Image deleted');
      fetchImages();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const toggleActive = async (image) => {
    try {
      await api.put(`/hero/${image.id}`, {
        isActive: !image.isActive,
        title: image.title,
        subtitle: image.subtitle,
        order: image.order,
      });
      fetchImages();
    } catch (error) {
      toast.error('Update failed');
    }
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal mb-1">Hero Images</h1>
          <p className="text-sm text-gray-500">Manage homepage carousel images</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-light text-white px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={16} />
          <span>Add Image</span>
        </button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`bg-white rounded-xl border overflow-hidden ${
              image.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="relative h-48">
              <img
                src={image.imageUrl}
                alt={image.title || 'Hero image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </span>
              </div>
              {!image.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-gray-800/80 text-white text-xs px-3 py-1 rounded">
                    Inactive
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-charcoal mb-1 truncate">
                {image.title || 'Untitled'}
              </h3>
              <p className="text-sm text-gray-500 mb-4 truncate">
                {image.subtitle || 'No subtitle'}
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleActive(image)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                    image.isActive
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {image.isActive ? 'Active' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <ImageIcon size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-charcoal mb-2">No hero images</h3>
          <p className="text-gray-500 text-sm mb-6">Add images to display on the homepage carousel.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Add First Image
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-serif text-xl text-charcoal">Add Hero Image</h2>
              <button
                onClick={() => { setShowModal(false); setFormData({ title: '', subtitle: '', imageFile: null }); }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Title</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Welcome to SUG Hotel"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Subtitle</label>
                <input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Experience comfort and elegance"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">Image *</label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gold/50 transition-colors">
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Recommended: 1920 x 1080px</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                    className="hidden"
                    id="hero-image"
                  />
                  <label
                    htmlFor="hero-image"
                    className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg cursor-pointer transition-colors"
                  >
                    {formData.imageFile ? 'Change Image' : 'Choose Image'}
                  </label>
                  {formData.imageFile && (
                    <p className="text-xs text-gold mt-2">{formData.imageFile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setFormData({ title: '', subtitle: '', imageFile: null }); }}
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
                  <span>Add Image</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}