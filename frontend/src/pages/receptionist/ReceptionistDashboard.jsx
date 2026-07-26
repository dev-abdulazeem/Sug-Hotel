import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import api from '../../utils/api';

export default function ReceptionistDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickCards = [
    {
      title: 'Pending Bookings',
      value: stats?.pendingBookings || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      link: '/receptionist/bookings',
    },
    {
      title: 'Checked In',
      value: stats?.checkedInBookings || 0,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      link: '/receptionist/bookings',
    },
    {
      title: 'Pending Reservations',
      value: stats?.pendingReservations || 0,
      icon: CalendarDays,
      color: 'bg-rose-50 text-rose-600',
      link: '/receptionist/reservations',
    },
    {
      title: 'Export Files',
      value: 'View',
      icon: FileSpreadsheet,
      color: 'bg-blue-50 text-blue-600',
      link: '/receptionist/exports',
    },
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
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-1">Reception Desk</h1>
        <p className="text-sm text-gray-500">Manage bookings, reservations, and exports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickCards.map((card) => {
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
              </div>
              <p className="text-2xl font-serif text-charcoal mb-1">{card.value}</p>
              <p className="text-xs text-gray-500">{card.title}</p>
            </Link>
          );
        })}
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4">Booking Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Total Bookings</span>
              <span className="text-sm font-medium text-charcoal">{stats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Confirmed</span>
              <span className="text-sm font-medium text-green-600">{stats?.confirmedBookings || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Checked Out</span>
              <span className="text-sm font-medium text-gray-600">{stats?.checkedOutBookings || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Cancelled</span>
              <span className="text-sm font-medium text-red-600">{stats?.cancelledBookings || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4">Reservation Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Total Reservations</span>
              <span className="text-sm font-medium text-charcoal">{stats?.totalReservations || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Confirmed</span>
              <span className="text-sm font-medium text-green-600">{stats?.confirmedReservations || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Completed</span>
              <span className="text-sm font-medium text-gray-600">{stats?.completedReservations || 0}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Cancelled</span>
              <span className="text-sm font-medium text-red-600">{stats?.cancelledReservations || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}