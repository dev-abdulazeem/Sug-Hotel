import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Users, Wifi } from 'lucide-react';
import { useRoomStore } from '../store/roomStore';

export default function RoomsSection() {
  const { rooms, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const displayedRooms = rooms.slice(0, 3);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ─── Header ─── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
              Our Rooms
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
              Find Your Perfect Stay
            </h2>
          </div>

          <Link
            to="/rooms"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-gold hover:text-gold-dark transition-colors border border-gold/30 hover:border-gold px-5 py-2.5 rounded-md"
          >
            <span>View All Rooms</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ─── Room Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRooms.map((room) => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-lg text-charcoal mb-2 group-hover:text-gold transition-colors duration-300">
                  {room.name}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Quick Info Row */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                  {room.bedType && (
                    <span className="flex items-center gap-1">
                      <BedDouble size={13} />
                      {room.bedType}
                    </span>
                  )}
                  {room.maxGuests && (
                    <span className="flex items-center gap-1">
                      <Users size={13} />
                      {room.maxGuests} Guests
                    </span>
                  )}
                  {room.hasWifi !== false && (
                    <span className="flex items-center gap-1">
                      <Wifi size={13} />
                      WiFi
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">
                    From{' '}
                    <span className="text-gold font-semibold text-base">
                      ${room.pricePerNight}
                    </span>{' '}
                    / night
                  </p>
                  <span className="text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── Mobile View All ─── */}
        <div className="sm:hidden mt-10 text-center">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm text-gold border border-gold/30 hover:border-gold px-6 py-3 rounded-md transition-colors"
          >
            <span>View All Rooms</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}