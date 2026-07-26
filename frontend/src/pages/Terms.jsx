import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText size={32} className="text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-charcoal mb-3">Terms & Conditions</h1>
          <p className="text-gray-500">Last updated: July 20, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-100 p-8 sm:p-10 space-y-8">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              By accessing or using the SUG Hotel website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Booking and Reservations</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              All bookings are subject to availability and confirmation. A valid payment method is required to secure your reservation. Room rates are quoted per night and do not include applicable taxes unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. Payment</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We accept payments via Paystack. All transactions are processed securely. By providing your payment information, you authorize us to charge the total booking amount to your selected payment method.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Cancellation Policy</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Cancellations made more than 48 hours before check-in are eligible for a full refund. Cancellations within 48 hours will be charged the full amount of the first night. No-shows will be charged the full booking amount.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. Check-in and Check-out</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges. Valid identification is required at check-in.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">6. Guest Responsibilities</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Guests are responsible for any damage caused to hotel property during their stay. Smoking is only permitted in designated areas. The hotel reserves the right to refuse service or terminate stays for violations of hotel policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Limitation of Liability</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              SUG Hotel shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or facilities. Our total liability shall not exceed the amount paid for your booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">8. Governing Law</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which SUG Hotel operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">9. Contact Information</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Email: legal@sug-hotel.com<br />
              Address: 123 Luxury Lane, Cityville, ST 12345
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}