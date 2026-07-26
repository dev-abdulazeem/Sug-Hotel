import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Star, Loader2, Search, Pencil } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', type: '', description: '', hours: '', location: '', phone: '',
    rating: '4.5', specialties: '', order: '0', isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { fetchRestaurants(); }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data.restaurants);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setFormData({ name: '', type: '', description: '', hours: '', location: '', phone: '', rating: '4.5', specialties: '', order: '0', isActive: true });
    setImageFile(null); setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(k => data.append(k, formData[k]));
    data.append('specialties', formData.specialties.split(',').map(s => s.trim()).join(','));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editing) {
        await api.put(`/restaurants/${editing.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Updated');
      } else {
        await api.post('/restaurants', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Created');
      }
      setShowModal(false); reset(); fetchRestaurants();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    await api.delete(`/restaurants/${id}`);
    toast.success('Deleted'); fetchRestaurants();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div><h1 className="font-serif text-2xl text-charcoal">Restaurants</h1><p className="text-sm text-gray-500">Manage dining venues</p></div>
        <button onClick={() => { reset(); setShowModal(true); }} className="bg-gold text-white px-4 py-2 rounded-lg text-sm flex items-center"><Plus size={16} className="mr-2"/>Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="relative h-48">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover"/>
              <div className="absolute top-3 right-3 flex space-x-1">
                <button onClick={() => { setEditing(r); setFormData({...r, specialties: r.specialties.join(', '), isActive: r.isActive}); setShowModal(true); }} className="w-8 h-8 bg-white/90 rounded flex items-center justify-center"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(r.id)} className="w-8 h-8 bg-white/90 rounded flex items-center justify-center"><Trash2 size={14} className="text-red-500"/></button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-serif text-lg">{r.name}</h3>
                <span className="flex items-center text-sm"><Star size={14} className="text-gold fill-gold mr-1"/>{r.rating}</span>
              </div>
              <p className="text-xs text-gold mb-2">{r.type}</p>
              <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex justify-between p-6 border-b">
              <h2 className="font-serif text-xl">{editing ? 'Edit' : 'Add'} Restaurant</h2>
              <button onClick={() => { setShowModal(false); reset(); }}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <input required placeholder="Type (e.g. Fine Dining)" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <textarea required placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Hours" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
                <input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
                <input placeholder="Rating" type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              </div>
              <input placeholder="Specialties (comma separated)" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="text-sm"/>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); reset(); }} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-gold text-white rounded-lg text-sm">{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}