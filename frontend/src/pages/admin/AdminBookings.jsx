import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Hotel,
  Clock,
  Loader2,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusOptions = ['ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

const statusConfig = {
  PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  CHECKED_IN: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Hotel },
  CHECKED_OUT: { color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', 10);

      const { data } = await api.get(`/bookings/all?${params}`);
      setBookings(data.bookings);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatuses = (currentStatus) => {
    const transitions = {
      PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
      CHECKED_IN: ['CHECKED_OUT'],
      CHECKED_OUT: [],
      CANCELLED: [],
    };
    return transitions[currentStatus] || [];
  };

  const filteredBookings = bookings.filter((b) =>
    b.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-1">Bookings</h1>
        <p className="text-sm text-gray-500">Manage all reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, email, or room..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Room</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Dates</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const StatusIcon = statusConfig[booking.status]?.icon || Clock;
                const nextStatuses = getNextStatuses(booking.status);

                return (
                  <tr key={booking.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-charcoal">
                        {booking.user.firstName} {booking.user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{booking.user.email}</p>
                      {booking.user.phone && (
                        <p className="text-xs text-gray-400">{booking.user.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{booking.room.name}</p>
                      <p className="text-xs text-gray-400">{booking.guests} guests</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                      <p className="text-gray-400">to {new Date(booking.checkOut).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 mt-1">{booking.nights} nights</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-charcoal">
                        ${Number(booking.totalAmount).toLocaleString()}
                      </p>
                      <span className={`text-xs ${
                        booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full ${statusConfig[booking.status]?.bg}`}>
                        <StatusIcon size={12} className={statusConfig[booking.status]?.color} />
                        <span className={`text-xs font-medium ${statusConfig[booking.status]?.color}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {updatingId === booking.id ? (
                        <Loader2 size={16} className="animate-spin text-gold" />
                      ) : nextStatuses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {nextStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStatus(booking.id, status)}
                              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                                status === 'CANCELLED'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                  : status === 'CHECKED_OUT'
                                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  : 'bg-gold/10 text-gold hover:bg-gold/20'
                              }`}
                            >
                              {status.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}