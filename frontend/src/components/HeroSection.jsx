import { useEffect, useCallback } from 'react';
import { ArrowRight, Calendar, Users, Search } from 'lucide-react';
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
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 pb-48 sm:pb-40 lg:pb-28">
        <p className="text-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-medium">
          Welcome to
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-normal mb-6 leading-tight">
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

      {/* ─── Solid Booking Bar ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="flex flex-col lg:flex-row lg:items-end gap-3 sm:gap-4 lg:gap-5">
              
              {/* Check-in */}
              <div className="w-full lg:flex-1">
                <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2 font-semibold">
                  Check-in
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:border-gold/50 hover:bg-white transition-all duration-200">
                  <Calendar size={16} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkIn: e.target.value })
                    }
                    className="w-full text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400 font-medium min-h-[20px]"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div className="w-full lg:flex-1">
                <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2 font-semibold">
                  Check-out
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:border-gold/50 hover:bg-white transition-all duration-200">
                  <Calendar size={16} className="text-gold shrink-0" />
                  <input
                    type="date"
                    value={searchParams.checkOut}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, checkOut: e.target.value })
                    }
                    className="w-full text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400 font-medium min-h-[20px]"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="w-full lg:flex-1">
                <label className="block text-[11px] text-gray-400 uppercase tracking-wide mb-1.5 sm:mb-2 font-semibold">
                  Guests
                </label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:border-gold/50 hover:bg-white transition-all duration-200">
                  <Users size={16} className="text-gold shrink-0" />
                  <select
                    value={searchParams.guests}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, guests: e.target.value })
                    }
                    className="w-full text-sm text-gray-800 outline-none bg-transparent appearance-none cursor-pointer font-medium min-h-[20px]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="w-full lg:w-auto pt-1 lg:pt-0">
                <Link
                  to={`/rooms?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}&guests=${searchParams.guests}`}
                  className="w-full lg:w-auto bg-gold hover:bg-gold-light text-white text-sm py-3 sm:py-3.5 px-6 sm:px-8 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Search size={16} />
                  <span>Check Availability</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}