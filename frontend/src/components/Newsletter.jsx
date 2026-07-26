import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    try {
      // You can create a newsletter endpoint later, for now just simulate
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center">
                  <Mail size={24} className="text-gold" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Subscribe to our newsletter for exclusive offers and updates.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <div>
              {isSubscribed ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 py-3">
                  <Check size={20} />
                  <span className="text-sm font-medium">You&apos;re subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
                    {!isSubmitting && <ArrowRight size={14} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}