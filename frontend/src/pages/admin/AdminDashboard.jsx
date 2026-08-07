import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Bed,
  CalendarDays,
  DollarSign,
  UtensilsCrossed,
  Image,
  Clock,
  Loader2,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Hotel,
  ChefHat,
  Camera,
} from 'lucide-react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [occupancy, setOccupancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, occupancyRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/occupancy'),
      ]);
      setStats(statsRes.data.stats);
      setOccupancy(occupancyRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mainStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      link: null,
    },
    {
      title: 'Total Rooms',
      value: stats?.totalRooms || 0,
      icon: Bed,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/admin/rooms',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: CalendarDays,
      color: 'bg-violet-50 text-violet-600',
      link: '/admin/bookings',
    },
    {
      title: 'Total Revenue',
      value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      link: null,
    },
  ];

  const diningGalleryStats = [
    {
      title: 'Restaurants',
      value: stats?.totalRestaurants || 0,
      icon: ChefHat,
      color: 'bg-orange-50 text-orange-600',
      link: '/admin/restaurants',
    },
    {
      title: 'Table Reservations',
      value: stats?.totalReservations || 0,
      icon: Clock,
      color: 'bg-rose-50 text-rose-600',
      link: '/admin/reservations',
    },
    {
      title: 'Gallery Albums',
      value: stats?.totalGalleryAlbums || 0,
      icon: Camera,
      color: 'bg-teal-50 text-teal-600',
      link: '/admin/gallery',
    },
    {
      title: 'Gallery Photos',
      value: stats?.totalGalleryPhotos || 0,
      icon: Image,
      color: 'bg-cyan-50 text-cyan-600',
      link: '/admin/gallery',
    },
  ];

  const bookingBreakdown = [
    { label: 'Pending', value: stats?.pendingBookings || 0, color: 'bg-amber-500' },
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, color: 'bg-emerald-500' },
    { label: 'Checked In', value: stats?.checkedInBookings || 0, color: 'bg-blue-500' },
    { label: 'Checked Out', value: stats?.checkedOutBookings || 0, color: 'bg-gray-500' },
    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-500' },
  ];

  const reservationBreakdown = [
    { label: 'Pending', value: stats?.pendingReservations || 0, color: 'bg-amber-500' },
    { label: 'Confirmed', value: stats?.confirmedReservations || 0, color: 'bg-emerald-500' },
    { label: 'Completed', value: stats?.completedReservations || 0, color: 'bg-gray-500' },
    { label: 'Cancelled', value: stats?.cancelledReservations || 0, color: 'bg-red-500' },
  ];

  const getStatusBadge = (status, type = 'booking') => {
    const styles = {
      CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      CHECKED_IN: 'bg-blue-50 text-blue-700 border-blue-200',
      CHECKED_OUT: 'bg-gray-50 text-gray-700 border-gray-200',
      COMPLETED: 'bg-gray-50 text-gray-700 border-gray-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* ─── Header ─── */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your hotel performance</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Last updated</p>
          <p className="text-sm text-gray-600 font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* ─── Main Stats ─── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mainStats.map((card) => {
            const Icon = card.icon;
            const CardWrapper = card.link ? Link : 'div';
            return (
              <CardWrapper
                key={card.title}
                to={card.link || ''}
                className={`group bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-200 ${
                  card.link ? 'hover:shadow-lg hover:border-gray-200 cursor-pointer' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  {card.link && (
                    <ArrowUpRight
                      size={18}
                      className="text-gray-300 group-hover:text-gold transition-colors"
                    />
                  )}
                </div>
                <p className="text-2xl font-serif text-charcoal tracking-tight">{card.value}</p>
                <p className="text-sm text-gray-400 mt-1">{card.title}</p>
              </CardWrapper>
            );
          })}
        </div>
      </section>

      {/* ─── Revenue & Occupancy ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-serif text-xl text-charcoal">Revenue Overview</h3>
              <p className="text-sm text-gray-400 mt-0.5">Financial performance summary</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-medium">
              <TrendingUp size={14} />
              <span>Live</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">This Month</p>
                <p className="text-xl font-serif text-charcoal mt-0.5">
                  ${Number(stats?.monthlyRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-gray-50/80 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">This Year</p>
                <p className="text-xl font-serif text-charcoal mt-0.5">
                  ${Number(stats?.yearlyRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="mb-6">
            <h3 className="font-serif text-xl text-charcoal">Room Occupancy</h3>
            <p className="text-sm text-gray-400 mt-0.5">Current availability status</p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="76" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                <circle
                  cx="88" cy="88" r="76" fill="none" stroke="#c9a96e" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(parseFloat(occupancy?.occupancyRate || 0) / 100) * 478} 478`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-serif text-charcoal">{occupancy?.occupancyRate || '0%'}</span>
                <span className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Occupied</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-lg font-medium text-charcoal">{occupancy?.totalRooms || 0}</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">Total</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50">
              <p className="text-lg font-medium text-emerald-600">{occupancy?.availableRooms || 0}</p>
              <p className="text-[11px] text-emerald-600/60 uppercase tracking-wide mt-0.5">Available</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50">
              <p className="text-lg font-medium text-amber-600">{occupancy?.currentlyOccupied || 0}</p>
              <p className="text-[11px] text-amber-600/60 uppercase tracking-wide mt-0.5">Occupied</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dining & Gallery ─── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-xl text-charcoal">Dining & Gallery</h3>
            <p className="text-sm text-gray-400 mt-0.5">Restaurant and media management</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {diningGalleryStats.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-gray-300 group-hover:text-gold transition-colors"
                  />
                </div>
                <p className="text-2xl font-serif text-charcoal tracking-tight">{card.value}</p>
                <p className="text-sm text-gray-400 mt-1">{card.title}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Status Breakdowns ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg text-charcoal">Booking Status</h3>
              <p className="text-sm text-gray-400 mt-0.5">Room booking distribution</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-sm text-gold hover:text-gold-dark flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {bookingBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal ml-auto pl-3">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg text-charcoal">Reservation Status</h3>
              <p className="text-sm text-gray-400 mt-0.5">Table reservation distribution</p>
            </div>
            <Link
              to="/admin/reservations"
              className="text-sm text-gold hover:text-gold-dark flex items-center gap-1 font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {reservationBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-charcoal ml-auto pl-3">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent Bookings ─── */}
      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-charcoal">Recent Bookings</h3>
            <p className="text-sm text-gray-400 mt-0.5">Latest room reservations</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-sm text-gold hover:text-gold-dark flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Guest</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Room</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Dates</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Amount</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats?.recentBookings || []).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-charcoal">
                      {booking.user.firstName} {booking.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{booking.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.room.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-charcoal">
                    ${Number(booking.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {(stats?.recentBookings || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    No recent bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── Recent Reservations ─── */}
      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-charcoal">Recent Table Reservations</h3>
            <p className="text-sm text-gray-400 mt-0.5">Latest dining reservations</p>
          </div>
          <Link
            to="/admin/reservations"
            className="text-sm text-gold hover:text-gold-dark flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Guest</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Restaurant</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Date/Time</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Guests</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats?.recentReservations || []).map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-charcoal">{res.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{res.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{res.restaurant.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(res.date).toLocaleDateString()} at {res.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{res.guests}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(res.status, 'reservation')}`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(stats?.recentReservations || []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                    No recent reservations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}