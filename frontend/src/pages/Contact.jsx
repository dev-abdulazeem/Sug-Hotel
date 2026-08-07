import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/contact', formData);
      setIsSent(true);
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Get in Touch
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">
            Contact Us
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-1">Phone</h3>
                <p className="text-sm text-gray-500">+1 234 567 8900</p>
                <p className="text-sm text-gray-400">Mon - Sun, 24/7</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-1">Email</h3>
                <p className="text-sm text-gray-500">info@sug-hotel.com</p>
                <p className="text-sm text-gray-400">We reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-1">Address</h3>
                <p className="text-sm text-gray-500">123 Luxury Lane</p>
                <p className="text-sm text-gray-500">Cityville, ST 12345</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {isSent ? (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-charcoal mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setIsSent(false)}
                  className="bg-gold hover:bg-gold-light text-white px-6 py-3 rounded-lg text-sm transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-gray-500 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light disabled:bg-gray-300 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}