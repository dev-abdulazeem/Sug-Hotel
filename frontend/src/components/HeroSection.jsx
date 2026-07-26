import { useEffect, useCallback } from 'react';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRoomStore } from '../store/roomStore';
import { Link } from 'react-router-dom';

export default function HeroSection({ searchParams, setSearchParams }) {
  const { heroImages, fetchHeroImages } = useRoomStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    fetchHeroImages();
  }, [fetchHeroImages]);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
      {/* ─── Carousel ─── */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.length > 0 ? (
            heroImages.map((img) => (
              <div key={img.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                <img
                  src={img.imageUrl}
                  alt={img.title || 'SUG Hotel'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            ))
          ) : (
            <div className="flex-[0_0_100%] min-w-0 relative h-full bg-charcoal">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
            </div>
          )}
        </div>
      </div>

      {/* ─── Hero Content ─── */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20">
        <p className="text-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          Welcome to
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white font-normal mb-6 leading-tight">
          SUG Hotel
        </h1>
        <p className="text-white/60 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
          Experience comfort, elegance and unforgettable moments.
        </p>
        <Link
          to="/rooms"
          onClick={scrollNext}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-6 py-3 text-sm tracking-wide transition-all duration-300 group rounded-lg"
        >
          <span>Explore Rooms</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* ─── Glassmorphism Booking Bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Check-in */}
              <div>
                <label className="block text-[11px] text-white/50 uppercase tracking-wide mb-1.5 font-medium">
                  Check-in
                </label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 hover:bg-white/15 hover:border-white/30 transition-all duration-200">
                  <Calendar size={15} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkIn: e.target.value })
                    }
                    className="w-full text-sm text-white outline-none bg-transparent placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-[11px] text-white/50 uppercase tracking-wide mb-1.5 font-medium">
                  Check-out
                </label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 hover:bg-white/15 hover:border-white/30 transition-all duration-200">
                  <Calendar size={15} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={searchParams.checkOut}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkOut: e.target.value })
                    }
                    className="w-full text-sm text-white outline-none bg-transparent placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] text-white/50 uppercase tracking-wide mb-1.5 font-medium">
                  Guests
                </label>
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 hover:bg-white/15 hover:border-white/30 transition-all duration-200">
                  <Users size={15} className="text-gold shrink-0" />
                  <select
                    value={searchParams.guests}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, guests: e.target.value })
                    }
                    className="w-full text-sm text-white outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="text-gray-800">
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Link
                  to={`/rooms?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`}
                  className="w-full bg-gold hover:bg-gold-light text-white text-sm py-3 px-4 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg shadow-gold/25 hover:shadow-gold/40 hover:-translate-y-0.5"
                >
                  <span>Check Availability</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}