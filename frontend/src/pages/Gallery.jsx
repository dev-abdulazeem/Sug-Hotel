import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { X, ZoomIn, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/gallery');
      setAlbums(data.albums);
      if (data.albums.length > 0) {
        setActiveAlbum(data.albums[0]);
      }
    } catch (err) {
      setError('Failed to load gallery');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allPhotos = albums.flatMap((album) =>
    album.photos.map((photo) => ({
      ...photo,
      albumName: album.name,
      albumSlug: album.slug,
    }))
  );

  const displayedPhotos = activeAlbum
    ? activeAlbum.photos.map((photo) => ({
        ...photo,
        albumName: activeAlbum.name,
        albumSlug: activeAlbum.slug,
      }))
    : allPhotos;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm w-full shadow-sm">
          <ImageIcon size={48} className="text-gray-300 mx-auto mb-5" />
          <p className="text-gray-500 text-lg font-medium mb-2">Something went wrong</p>
          <p className="text-gray-400 text-sm mb-8">{error}</p>
          <button
            onClick={fetchAlbums}
            className="w-full bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Header ─── */}
      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Visual Journey
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">
            Gallery
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Explore the beauty and elegance of SUG Hotel through our curated collection.
          </p>
        </div>
      </div>

      {/* ─── Album Filter ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveAlbum(null)}
            className={`
              px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeAlbum === null
                ? 'bg-gold text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gold hover:text-gold'
              }
            `}
          >
            All
          </button>
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => setActiveAlbum(album)}
              className={`
                px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeAlbum?.id === album.id
                  ? 'bg-gold text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gold hover:text-gold'
                }
              `}
            >
              {album.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Photo Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="text-gray-300 mx-auto mb-5" />
            <p className="text-gray-500 font-medium mb-1">No photos yet</p>
            <p className="text-gray-400 text-sm">Check back soon for new additions.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {displayedPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedImage(photo)}
                className="relative group break-inside-avoid cursor-pointer overflow-hidden rounded-xl"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Gallery photo'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                {(photo.caption || photo.albumName) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {photo.caption && (
                      <p className="text-white font-medium text-sm">{photo.caption}</p>
                    )}
                    <p className="text-white/60 text-xs mt-0.5">{photo.albumName}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Lightbox ─── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
          >
            <X size={28} />
          </button>

          <div
            className="max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || 'Gallery photo'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-5">
              {selectedImage.caption && (
                <p className="text-white font-medium">{selectedImage.caption}</p>
              )}
              <p className="text-white/40 text-sm mt-1">{selectedImage.albumName}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}