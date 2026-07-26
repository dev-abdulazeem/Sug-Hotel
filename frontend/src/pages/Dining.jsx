import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Clock,
  MapPin,
  Phone,
  Star,
  ChevronRight,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Dining() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservingRestaurant, setReservingRestaurant] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequests: '',
  });

  useEffect(() => {
    fetchRestaurants();
    if (user) {
      setReservationForm((prev) => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data.restaurants);
    } catch (err) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/reservations', {
        ...reservationForm,
        restaurantId: reservingRestaurant.id,
        guests: parseInt(reservationForm.guests),
      });
      toast.success('Reservation request submitted! Check your email.');
      setReservingRestaurant(null);
      setReservationForm({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        phone: user?.phone || '',
        date: '',
        time: '',
        guests: '2',
        specialRequests: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM',
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Hero Header ─── */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920"
          alt="SUG Hotel Dining"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
              Culinary Excellence
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4">
              Dining at SUG Hotel
            </h1>
            <p className="text-white/60 max-w-lg mx-auto leading-relaxed">
              A world of flavors awaits. From fine dining to casual bites, every meal is a masterpiece.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Restaurants ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Our Venues
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal">
            Restaurants & Bars
          </h2>
        </div>

        <div className="space-y-20">
          {restaurants.map((restaurant, idx) => (
            <div
              key={restaurant.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            >
              {/* Image */}
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative h-80 rounded-xl overflow-hidden group">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                      {restaurant.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg">
                    <Star size={13} className="text-gold fill-gold" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                <h3 className="font-serif text-2xl text-charcoal mb-3">
                  {restaurant.name}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {restaurant.description}
                </p>

                <div className="space-y-3 mb-6">
                  {[
                    { icon: Clock, text: restaurant.hours },
                    { icon: MapPin, text: restaurant.location },
                    { icon: Phone, text: restaurant.phone },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-gray-500">
                      <Icon size={16} className="text-gold shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {restaurant.specialties?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-2.5 font-medium">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setReservingRestaurant(restaurant)}
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-dark text-sm font-medium transition-colors group"
                >
                  <span>Reserve a Table</span>
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Reservation Modal ─── */}
      {reservingRestaurant && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReservingRestaurant(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="font-serif text-xl text-charcoal">
                  Reserve a Table
                </h2>
                <p className="text-sm text-gray-400">{reservingRestaurant.name}</p>
              </div>
              <button
                onClick={() => setReservingRestaurant(null)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleReservation} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Full Name *</label>
                <input
                  required
                  value={reservationForm.name}
                  onChange={(e) =>
                    setReservationForm({ ...reservationForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={reservationForm.email}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Phone</label>
                  <input
                    type="tel"
                    value={reservationForm.phone}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={reservationForm.date}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Time *</label>
                  <select
                    required
                    value={reservationForm.time}
                    onChange={(e) =>
                      setReservationForm({ ...reservationForm, time: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors bg-white"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Guests *</label>
                <select
                  required
                  value={reservationForm.guests}
                  onChange={(e) =>
                    setReservationForm({ ...reservationForm, guests: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                  Special Requests
                </label>
                <textarea
                  rows={2}
                  value={reservationForm.specialRequests}
                  onChange={(e) =>
                    setReservationForm({
                      ...reservationForm,
                      specialRequests: e.target.value,
                    })
                  }
                  placeholder="Allergies, special occasions, seating preferences..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold hover:border-gray-300 transition-colors resize-none placeholder:text-gray-300"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                <CheckCircle size={14} className="text-green-500 shrink-0" />
                <span>You will receive a confirmation email once approved.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold hover:bg-gold-light disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Request Reservation</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}