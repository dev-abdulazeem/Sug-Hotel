import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
    alt: 'Hotel Interior',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
    alt: 'Swimming Pool',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600',
    alt: 'Luxury Lounge',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    alt: 'Hotel Exterior',
  },
];

export default function GallerySection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Gallery
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Moments at SUG Hotel
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        {/* View Full Gallery */}
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center space-x-2 text-sm text-gold hover:text-gold-dark transition-colors border border-gold/30 hover:border-gold px-6 py-3 rounded"
          >
            <span>View Full Gallery</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}