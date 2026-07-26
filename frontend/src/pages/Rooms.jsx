import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Filter, BedDouble, Wifi } from 'lucide-react';
import { useRoomStore } from '../store/roomStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Rooms() {
  const [urlParams] = useSearchParams();
  const { rooms, isLoading, fetchRooms } = useRoomStore();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatDate = (date) => date.toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    checkIn: urlParams.get('checkIn') || formatDate(today),
    checkOut: urlParams.get('checkOut') || formatDate(tomorrow),
    guests: urlParams.get('guests') || '2',
    minPrice: '',
    maxPrice: '',
    type: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRooms({
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
    });
  }, [filters.checkIn, filters.checkOut]);

  const filteredRooms = rooms.filter((room) => {
    if (filters.minPrice && room.pricePerNight < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && room.pricePerNight > parseFloat(filters.maxPrice)) return false;
    if (filters.type && room.type !== filters.type) return false;
    if (parseInt(filters.guests) > room.capacity) return false;
    return true;
  });

  const roomTypes = ['STANDARD', 'DELUXE', 'PREMIUM', 'EXECUTIVE', 'SUITE', 'PENTHOUSE'];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Header ─── */}
      <div className="pt-28 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Accommodations
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-2">
            Our Rooms
          </h1>
          <p className="text-gray-400 text-sm">
            Discover the perfect room for your stay
          </p>
        </div>
      </div>

      {/* ─── Search & Filters Bar ─── */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Date & Guest Inputs */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Check-in</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <Calendar size={14} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={filters.checkIn}
                    onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Check-out</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <Calendar size={14} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={filters.checkOut}
                    onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent text-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Guests</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <Users size={14} className="text-gold shrink-0" />
                  <select
                    value={filters.guests}
                    onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
                    className="w-full text-sm outline-none bg-transparent text-gray-700"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm transition-all duration-200
                ${showFilters
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
                }
              `}
            >
              <Filter size={14} />
              <span>Filters</span>
            </button>
          </div>

          {/* Expandable Filters */}
          <div
            className={`
              grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden transition-all duration-300 ease-out
              ${showFilters ? 'max-h-40 opacity-100 mt-4 pt-4 border-t border-gray-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Room Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-gray-50/50 hover:border-gray-300 transition-colors"
              >
                <option value="">All Types</option>
                {roomTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Min Price ($)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-gray-50/50 hover:border-gray-300 transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Max Price ($)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="1000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-gray-50/50 hover:border-gray-300 transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Rooms Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <BedDouble size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No rooms match your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or dates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Link
                key={room.id}
                to={`/rooms/${room.id}?checkIn=${filters.checkIn}&checkOut=${filters.checkOut}&guests=${filters.guests}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {!room.isAvailableForDates && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                        Not Available
                      </span>
                    </div>
                  )}

                  {room.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gold text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors duration-300">
                      {room.name}
                    </h3>
                    <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {room.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Info Row */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {room.capacity} Guests
                    </span>
                    <span className="flex items-center gap-1">
                      <BedDouble size={12} />
                      {room.bedType}
                    </span>
                    {room.hasWifi !== false && (
                      <span className="flex items-center gap-1">
                        <Wifi size={12} />
                        WiFi
                      </span>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      From{' '}
                      <span className="text-gold font-semibold text-base">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-gray-400"> / night</span>
                    </p>
                    <span className="text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-medium">
                      Details <ArrowRight size={12} />
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="text-[11px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities?.length > 3 && (
                      <span className="text-[11px] text-gray-400">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}