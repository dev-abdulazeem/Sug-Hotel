import { useEffect, useState } from 'react';
import { Plus, X, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [albumForm, setAlbumForm] = useState({ name: '', slug: '', description: '', order: '0' });
  const [albumCover, setAlbumCover] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    try {
      const { data } = await api.get('/gallery');
      setAlbums(data.albums);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const createAlbum = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData();
    Object.keys(albumForm).forEach(k => data.append(k, albumForm[k]));
    if (albumCover) data.append('image', albumCover);

    try {
      await api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Album created'); setShowAlbumModal(false);
      setAlbumForm({ name: '', slug: '', description: '', order: '0' });
      setAlbumCover(null); fetchAlbums();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const addPhoto = async (e) => {
    e.preventDefault(); setSubmitting(true);
    const data = new FormData();
    data.append('caption', photoCaption);
    if (photoFile) data.append('image', photoFile);

    try {
      await api.post(`/gallery/${activeAlbum.id}/photos`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo added'); setShowPhotoModal(false);
      setPhotoFile(null); setPhotoCaption(''); fetchAlbums();
    } catch (err) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  const deleteAlbum = async (id) => { if(!window.confirm('Delete album and all photos?')) return; await api.delete(`/gallery/${id}`); toast.success('Deleted'); fetchAlbums(); };
  const deletePhoto = async (id) => { if(!window.confirm('Delete photo?')) return; await api.delete(`/gallery/photos/${id}`); toast.success('Deleted'); fetchAlbums(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={32}/></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div><h1 className="font-serif text-2xl text-charcoal">Gallery</h1><p className="text-sm text-gray-500">Manage photo albums</p></div>
        <button onClick={() => setShowAlbumModal(true)} className="bg-gold text-white px-4 py-2 rounded-lg text-sm flex items-center"><Plus size={16} className="mr-2"/>New Album</button>
      </div>

      <div className="space-y-8">
        {albums.map(album => (
          <div key={album.id} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <img src={album.coverImage} alt={album.name} className="w-16 h-16 object-cover rounded-lg"/>
                <div>
                  <h3 className="font-serif text-lg">{album.name}</h3>
                  <p className="text-sm text-gray-500">{album.photos.length} photos</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setActiveAlbum(album); setShowPhotoModal(true); }} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded">Add Photo</button>
                <button onClick={() => deleteAlbum(album.id)} className="text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded"><Trash2 size={14}/></button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {album.photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square">
                  <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover rounded-lg"/>
                  <button onClick={() => deletePhoto(photo.id)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={10}/></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Album Modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-serif text-xl">New Album</h2>
              <button onClick={() => setShowAlbumModal(false)}><X size={18}/></button>
            </div>
            <form onSubmit={createAlbum} className="space-y-4">
              <input required placeholder="Album Name" value={albumForm.name} onChange={e => setAlbumForm({...albumForm, name: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <input required placeholder="URL Slug (e.g. hotel-exterior)" value={albumForm.slug} onChange={e => setAlbumForm({...albumForm, slug: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <textarea placeholder="Description" rows={2} value={albumForm.description} onChange={e => setAlbumForm({...albumForm, description: e.target.value})} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <input type="file" accept="image/*" onChange={e => setAlbumCover(e.target.files[0])} className="text-sm"/>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAlbumModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-gold text-white rounded-lg text-sm">{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && activeAlbum && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h2 className="font-serif text-xl">Add Photo to {activeAlbum.name}</h2>
              <button onClick={() => setShowPhotoModal(false)}><X size={18}/></button>
            </div>
            <form onSubmit={addPhoto} className="space-y-4">
              <input type="file" accept="image/*" required onChange={e => setPhotoFile(e.target.files[0])} className="text-sm"/>
              <input placeholder="Caption (optional)" value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} className="w-full border rounded-lg px-4 py-2 text-sm"/>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowPhotoModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
                <button type="submit" disabled={submitting} className="px-6 py-2 bg-gold text-white rounded-lg text-sm">{submitting ? 'Adding...' : 'Add Photo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}