import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield size={32} className="text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl text-charcoal mb-3">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: July 20, 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-100 p-8 sm:p-10 space-y-8">
          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">1. Introduction</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              SUG Hotel (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a booking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Information We Collect</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 leading-relaxed space-y-1">
              <li><strong>Personal Information:</strong> Name, email address, phone number, billing address, and payment details.</li>
              <li><strong>Booking Information:</strong> Check-in/check-out dates, room preferences, number of guests, and special requests.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies.</li>
              <li><strong>Communication:</strong> Messages sent through our contact form or customer service channels.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. How We Use Your Information</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 leading-relaxed space-y-1">
              <li>Process and manage your bookings</li>
              <li>Communicate booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services and website experience</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Data Security</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We implement industry-standard security measures including SSL encryption, secure payment processing through Paystack, and restricted access to personal data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. Third-Party Services</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We use trusted third-party services including Paystack for payments, Cloudinary for image hosting, and Brevo for email communications. These services have their own privacy policies and adhere to strict data protection standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">6. Your Rights</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@sug-hotel.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Contact Us</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Email: privacy@sug-hotel.com<br />
              Address: 123 Luxury Lane, Cityville, ST 12345
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}