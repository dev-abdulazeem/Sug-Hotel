import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Bed,
  Users,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Droplets,
  Car,
  Check,
  ArrowLeft,
  Calendar,
  Star,
  Loader2,
} from 'lucide-react';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const amenityIcons = {
  WiFi: Wifi,
  AC: Wind,
  'Smart TV': Tv,
  'Mini Bar': Coffee,
  'City View': Star,
  'Panoramic View': Star,
  Bathtub: Droplets,
  Jacuzzi: Droplets,
  'Living Room': Bed,
  Kitchenette: Coffee,
  Parking: Car,
};

export default function RoomDetail() {
  const { id } = useParams();
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentRoom, isLoading, fetchRoomById } = useRoomStore();
  const { isAuthenticated } = useAuthStore();
  const { createBooking, initPayment } = useBookingStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isBooking, setIsBooking] = useState(false);

  const checkIn = urlParams.get('checkIn') || '';
  const checkOut = urlParams.get('checkOut') || '';
  const guests = urlParams.get('guests') || '2';

  useEffect(() => {
    fetchRoomById(id, { checkIn, checkOut });
  }, [id, checkIn, checkOut]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const totalPrice = currentRoom ? currentRoom.pricePerNight * calculateNights() : 0;

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book this room');
      navigate('/login', {
        state: {
          from: `/rooms/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
        },
      });
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setIsBooking(true);
    try {
      const result = await createBooking({
        roomId: id,
        checkIn,
        checkOut,
        guests: parseInt(guests),
      });

      if (result.success) {
        const payment = await initPayment(result.booking.id);
        if (payment.success) {
          window.location.href = payment.authorizationUrl;
        } else {
          toast.error(payment.message || 'Payment initialization failed');
        }
      } else {
        toast.error(result.message || 'Booking failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Room not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Breadcrumb ─── */}
      <div className="pt-24 pb-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Rooms</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Left Column: Images & Details ─── */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative h-[400px] sm:h-[500px] rounded-xl overflow-hidden mb-4">
              <img
                src={currentRoom.images[selectedImage] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {currentRoom.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentRoom.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`
                      flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${selectedImage === idx ? 'border-gold ring-2 ring-gold/20' : 'border-transparent hover:border-gray-200'}
                    `}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Room Info */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-serif text-3xl text-charcoal">{currentRoom.name}</h1>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-md uppercase tracking-wide">
                  {currentRoom.type}
                </span>
              </div>

              <p className="text-gray-500 leading-relaxed mb-8">{currentRoom.description}</p>

              {/* Room Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: Users, label: 'Capacity', value: `${currentRoom.capacity} Guests` },
                  { icon: Bed, label: 'Bed', value: currentRoom.bedType },
                  { icon: Calendar, label: 'Size', value: `${currentRoom.size || 'N/A'} sq ft` },
                  { icon: Star, label: 'Rating', value: '4.9 / 5.0' },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <Icon size={18} className="text-gold mb-3" />
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-medium text-charcoal">{value}</p>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="font-serif text-xl text-charcoal mb-4">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentRoom.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Check;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <Icon size={16} className="text-gold shrink-0" />
                      <span className="text-sm text-gray-600">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Right Column: Booking Card ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
              {/* Price Header */}
              <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <span className="text-3xl font-serif text-charcoal">${currentRoom.pricePerNight}</span>
                  <span className="text-gray-400 text-sm"> / night</span>
                </div>
                {currentRoom.isAvailableForDates === false && (
                  <span className="text-xs font-medium text-red-500 bg-red-50 px-3 py-1.5 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>

              {/* Date Summary */}
              {checkIn && checkOut && (
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                  {[
                    { label: 'Check-in', value: new Date(checkIn).toLocaleDateString() },
                    { label: 'Check-out', value: new Date(checkOut).toLocaleDateString() },
                    { label: 'Nights', value: calculateNights() },
                    { label: 'Guests', value: guests },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-charcoal font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    ${currentRoom.pricePerNight} x {calculateNights()} nights
                  </span>
                  <span className="text-charcoal">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taxes & fees</span>
                  <span className="text-charcoal">Included</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-3">
                  <span className="text-charcoal">Total</span>
                  <span className="text-gold text-xl font-serif">${totalPrice}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={isBooking || currentRoom.isAvailableForDates === false}
                className={`
                  w-full py-3.5 rounded-lg font-medium transition-all duration-200
                  flex items-center justify-center gap-2
                  ${currentRoom.isAvailableForDates === false
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gold hover:bg-gold-light text-white'
                  }
                `}
              >
                {isBooking ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : currentRoom.isAvailableForDates === false ? (
                  <span>Not Available</span>
                ) : (
                  <span>Book Now</span>
                )}
              </button>

              {!isAuthenticated && (
                <p className="text-xs text-gray-400 text-center mt-4">
                  You&apos;ll need to log in to complete your booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}