import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Calendar,
  Users,
  Phone,
  Mail,
  FileSpreadsheet,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, label: 'Confirmed' },
  COMPLETED: { color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle, label: 'Completed' },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Cancelled' },
};

export default function ReceptionistReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, page]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('page', page);
      params.append('limit', rowsPerPage);

      const { data } = await api.get(`/reservations/all?${params}`);
      setReservations(data.reservations);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      toast.success(`Reservation ${status.toLowerCase()}`);
      fetchReservations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReservations = reservations.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-charcoal mb-1">Table Reservations</h1>
          <p className="text-sm text-gray-500">Manage dining reservations</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FileSpreadsheet size={16} className="text-green-600" />
          <span>Auto-exported to Excel</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, email, or restaurant..."
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
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guest</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Restaurant</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Date & Time</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Guests</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReservations.map((reservation) => {
                const StatusIcon = statusConfig[reservation.status]?.icon || Clock;

                return (
                  <tr key={reservation.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-charcoal">{reservation.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="flex items-center text-xs text-gray-400">
                          <Mail size={10} className="mr-1" />{reservation.email}
                        </span>
                        <span className="flex items-center text-xs text-gray-400">
                          <Phone size={10} className="mr-1" />{reservation.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <UtensilsCrossed size={14} className="text-gold" />
                        <span className="text-sm text-gray-600">{reservation.restaurant?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar size={14} className="text-gold" />
                        <span>{new Date(reservation.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">at {reservation.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users size={14} className="text-gold" />
                        <span>{reservation.guests}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full ${statusConfig[reservation.status]?.bg}`}>
                        <StatusIcon size={12} className={statusConfig[reservation.status]?.color} />
                        <span className={`text-xs font-medium ${statusConfig[reservation.status]?.color}`}>
                          {statusConfig[reservation.status]?.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {updatingId === reservation.id ? (
                        <Loader2 size={16} className="animate-spin text-gold" />
                      ) : (
                        <div className="flex space-x-2">
                          {reservation.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => updateStatus(reservation.id, 'CONFIRMED')}
                                className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(reservation.id, 'CANCELLED')}
                                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {reservation.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateStatus(reservation.id, 'COMPLETED')}
                              className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reservations found.</p>
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
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}