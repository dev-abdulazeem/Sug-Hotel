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
  CheckCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
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
      color: 'bg-green-50 text-green-600',
      link: '/admin/rooms',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: CalendarDays,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/bookings',
    },
    {
      title: 'Total Revenue',
      value: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-gold/10 text-gold',
      link: null,
    },
  ];

  // NEW: Dining & Gallery stats cards
  const diningGalleryStats = [
    {
      title: 'Restaurants',
      value: stats?.totalRestaurants || 0,
      icon: UtensilsCrossed,
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
      icon: Image,
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
    { label: 'Confirmed', value: stats?.confirmedBookings || 0, color: 'bg-green-500' },
    { label: 'Checked In', value: stats?.checkedInBookings || 0, color: 'bg-blue-500' },
    { label: 'Checked Out', value: stats?.checkedOutBookings || 0, color: 'bg-gray-500' },
    { label: 'Cancelled', value: stats?.cancelledBookings || 0, color: 'bg-red-500' },
  ];

  // NEW: Reservation breakdown
  const reservationBreakdown = [
    { label: 'Pending', value: stats?.pendingReservations || 0, color: 'bg-amber-500' },
    { label: 'Confirmed', value: stats?.confirmedReservations || 0, color: 'bg-green-500' },
    { label: 'Completed', value: stats?.completedReservations || 0, color: 'bg-gray-500' },
    { label: 'Cancelled', value: stats?.cancelledReservations || 0, color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your hotel performance</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((card) => {
          const Icon = card.icon;
          const CardWrapper = card.link ? Link : 'div';
          return (
            <CardWrapper
              key={card.title}
              to={card.link || ''}
              className={`bg-white rounded-xl border border-gray-100 p-6 ${
                card.link ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon size={20} />
                </div>
                {card.link && <ArrowRight size={16} className="text-gray-300" />}
              </div>
              <p className="text-2xl font-serif text-charcoal mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
            </CardWrapper>
          );
        })}
      </div>

      {/* NEW: Dining & Gallery Stats */}
      <div>
        <h3 className="font-serif text-lg text-charcoal mb-4">Dining & Gallery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {diningGalleryStats.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.link}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={16} className="text-gray-300" />
                </div>
                <p className="text-2xl font-serif text-charcoal mb-1">{card.value}</p>
                <p className="text-xs text-gray-500">{card.title}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Revenue & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-charcoal mb-6">Revenue Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-lg font-medium text-charcoal">
                    ${Number(stats?.monthlyRevenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Year</p>
                  <p className="text-lg font-medium text-charcoal">
                    ${Number(stats?.yearlyRevenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupancy Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-charcoal mb-6">Room Occupancy</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="70" fill="none" stroke="#c9a96e" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(parseFloat(occupancy?.occupancyRate || 0) / 100) * 440} 440`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-serif text-charcoal">{occupancy?.occupancyRate || '0%'}</span>
                <span className="text-xs text-gray-400">Occupied</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-medium text-charcoal">{occupancy?.totalRooms || 0}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-lg font-medium text-green-600">{occupancy?.availableRooms || 0}</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
            <div>
              <p className="text-lg font-medium text-gold">{occupancy?.currentlyOccupied || 0}</p>
              <p className="text-xs text-gray-500">Occupied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-serif text-lg text-charcoal mb-6">Booking Status Breakdown</h3>
        <div className="flex flex-wrap gap-3">
          {bookingBreakdown.map((item) => (
            <div key={item.label} className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-charcoal ml-1">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Reservation Status Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg text-charcoal">Reservation Status Breakdown</h3>
          <Link to="/admin/reservations" className="text-sm text-gold hover:text-gold-dark flex items-center">
            <span>View All</span><ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {reservationBreakdown.map((item) => (
            <div key={item.label} className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-charcoal ml-1">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg text-charcoal">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-gold hover:text-gold-dark flex items-center">
            <span>View All</span><ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Room</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Dates</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(stats?.recentBookings || []).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-charcoal">{booking.user.firstName} {booking.user.lastName}</p>
                    <p className="text-xs text-gray-400">{booking.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.room.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-charcoal">${Number(booking.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                      booking.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                      booking.status === 'CHECKED_IN' ? 'bg-blue-50 text-blue-700' :
                      booking.status === 'CHECKED_OUT' ? 'bg-gray-50 text-gray-700' :
                      'bg-red-50 text-red-700'
                    }`}>{booking.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW: Recent Reservations */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg text-charcoal">Recent Table Reservations</h3>
          <Link to="/admin/reservations" className="text-sm text-gold hover:text-gold-dark flex items-center">
            <span>View All</span><ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Restaurant</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date/Time</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guests</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(stats?.recentReservations || []).map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-charcoal">{res.name}</p>
                    <p className="text-xs text-gray-400">{res.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{res.restaurant.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(res.date).toLocaleDateString()} at {res.time}
                  </td>
                  <td className="px-6 py-4 text-sm">{res.guests}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      res.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' :
                      res.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                      res.status === 'COMPLETED' ? 'bg-gray-50 text-gray-700' :
                      'bg-red-50 text-red-700'
                    }`}>{res.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}