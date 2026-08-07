import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight, Home, Calendar } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

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

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full shadow-sm">
          <Loader2 size={48} className="animate-spin text-gold mx-auto mb-6" />
          <h2 className="font-serif text-2xl text-charcoal mb-3">Verifying Payment</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Please wait while we confirm your transaction...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="font-serif text-2xl text-charcoal mb-3">Payment Successful</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Your booking has been confirmed. Redirecting you shortly...
          </p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Calendar size={16} />
            <span>View My Bookings</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md w-full shadow-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h2 className="font-serif text-2xl text-charcoal mb-3">Payment Failed</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          We could not verify your payment. Please try again or contact support.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Calendar size={16} />
            <span>My Bookings</span>
          </button>
        </div>
      </div>
    </div>
  );
}