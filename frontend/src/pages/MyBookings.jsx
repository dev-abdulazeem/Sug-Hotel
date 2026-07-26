import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Hotel,
} from 'lucide-react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock, label: 'Pending' },
  CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, label: 'Confirmed' },
  CHECKED_IN: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Hotel, label: 'Checked In' },
  CHECKED_OUT: { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: CheckCircle, label: 'Checked Out' },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle, label: 'Cancelled' },
};

const paymentConfig = {
  UNPAID: { color: 'text-amber-600', label: 'Unpaid' },
  PAID: { color: 'text-green-600', label: 'Paid' },
  REFUNDED: { color: 'text-gray-600', label: 'Refunded' },
};

export default function MyBookings() {
  const { bookings, isLoading, fetchMyBookings, checkout, cancelBooking, initPayment } = useBookingStore();
  const { isAuthenticated } = useAuthStore();
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBookings();
    }
  }, [isAuthenticated]);

  const handleCheckout = async (bookingId) => {
    setProcessingId(bookingId);
    const result = await checkout(bookingId);
    if (result.success) {
      toast.success(result.message);
      fetchMyBookings();
    } else {
      toast.error(result.message);
    }
    setProcessingId(null);
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setProcessingId(bookingId);
    const result = await cancelBooking(bookingId);
    if (result.success) {
      toast.success(result.message);
      fetchMyBookings();
    } else {
      toast.error(result.message);
    }
    setProcessingId(null);
  };

  const handlePay = async (bookingId) => {
    setProcessingId(bookingId);
    const result = await initPayment(bookingId);
    if (result.success) {
      window.location.href = result.authorizationUrl;
    } else {
      toast.error(result.message);
    }
    setProcessingId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-sm w-full shadow-sm">
          <Hotel size={40} className="text-gray-300 mx-auto mb-5" />
          <h3 className="font-serif text-xl text-charcoal mb-2">Sign In Required</h3>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Please log in to view and manage your bookings.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <span>Sign In</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-28 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Reservations
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-2">
            My Bookings
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your reservations and upcoming stays
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Calendar size={48} className="text-gray-300 mx-auto mb-5" />
            <h3 className="font-serif text-xl text-charcoal mb-2">No bookings yet</h3>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Start exploring our rooms and book your perfect stay.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Browse Rooms</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const StatusIcon = statusConfig[booking.status]?.icon || Clock;
              const isProcessing = processingId === booking.id;
              const status = statusConfig[booking.status];

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Room Image */}
                    <div className="md:w-72 h-52 md:h-auto flex-shrink-0 relative">
                      <img
                        src={booking.room.images[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'}
                        alt={booking.room.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${status?.bg} ${status?.color} ${status?.border}`}>
                          <StatusIcon size={13} />
                          {status?.label}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Room Name & Type */}
                        <div className="mb-5">
                          <h3 className="font-serif text-xl text-charcoal mb-1">
                            {booking.room.name}
                          </h3>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            {booking.room.type}
                          </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                          {[
                            { icon: Calendar, label: 'Check-in', value: new Date(booking.checkIn).toLocaleDateString() },
                            { icon: Calendar, label: 'Check-out', value: new Date(booking.checkOut).toLocaleDateString() },
                            { icon: MapPin, label: 'Duration', value: `${booking.nights} nights` },
                            { icon: CreditCard, label: 'Payment', value: paymentConfig[booking.paymentStatus]?.label, valueColor: paymentConfig[booking.paymentStatus]?.color },
                          ].map(({ icon: Icon, label, value, valueColor }) => (
                            <div key={label}>
                              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                              <div className="flex items-center gap-1.5">
                                <Icon size={13} className="text-gold shrink-0" />
                                <span className={`text-sm font-medium ${valueColor || 'text-charcoal'}`}>
                                  {value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-gray-100">
                        <div>
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Total Amount</p>
                          <span className="text-2xl font-serif text-charcoal">
                            ${Number(booking.totalAmount).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {booking.status === 'PENDING' && booking.paymentStatus === 'UNPAID' && (
                            <button
                              onClick={() => handlePay(booking.id)}
                              disabled={isProcessing}
                              className="px-5 py-2.5 bg-gold hover:bg-gold-light text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isProcessing ? 'Processing...' : 'Pay Now'}
                            </button>
                          )}

                          {booking.status === 'CHECKED_IN' && (
                            <button
                              onClick={() => handleCheckout(booking.id)}
                              disabled={isProcessing}
                              className="px-5 py-2.5 bg-charcoal hover:bg-charcoal-light text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isProcessing ? 'Processing...' : 'Checkout'}
                            </button>
                          )}

                          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              disabled={isProcessing}
                              className="px-5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}