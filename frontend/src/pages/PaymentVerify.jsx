import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, failed

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const verify = async () => {
      try {
        const ref = reference || trxref;
        if (!ref) {
          setStatus('failed');
          toast.error('No payment reference found');
          return;
        }

        const { data } = await api.get(`/payments/verify?reference=${ref}`);

        if (data.booking) {
          setStatus('success');
          toast.success(data.message);
          setTimeout(() => {
            navigate('/my-bookings');
          }, 3000);
        } else {
          setStatus('failed');
          toast.error(data.message || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('failed');
        toast.error(error.response?.data?.message || 'Payment verification failed');
      }
    };

    verify();
  }, [searchParams, navigate]);

  const statusConfig = {
    verifying: {
      icon: <Loader2 size={48} className="animate-spin text-gold mx-auto mb-5" />,
      title: 'Verifying Payment',
      message: 'Please wait while we confirm your transaction...',
      actions: null,
    },
    success: {
      icon: <CheckCircle size={48} className="text-green-500 mx-auto mb-5" />,
      title: 'Payment Successful',
      message: 'Your booking has been confirmed. Redirecting you shortly...',
      actions: (
        <button
          onClick={() => navigate('/my-bookings')}
          className="bg-gold hover:bg-gold-light text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          View My Bookings
        </button>
      ),
    },
    failed: {
      icon: <XCircle size={48} className="text-red-500 mx-auto mb-5" />,
      title: 'Payment Failed',
      message: 'We could not verify your payment. Please try again or contact support.',
      actions: (
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/rooms')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Browse Rooms
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            My Bookings
          </button>
        </div>
      ),
    },
  };

  const current = statusConfig[status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full shadow-sm">
        {current.icon}
        <h2 className="font-serif text-2xl text-charcoal mb-3">{current.title}</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">{current.message}</p>
        {current.actions}
      </div>
    </div>
  );
}