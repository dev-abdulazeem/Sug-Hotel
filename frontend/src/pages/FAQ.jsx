import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is available from 2:00 PM, and check-out is at 12:00 PM. Early check-in and late check-out can be arranged upon request, subject to availability and may incur additional charges.',
  },
  {
    question: 'Is parking available at the hotel?',
    answer: 'Yes, we offer complimentary valet parking for all registered guests. Our secure underground parking facility is monitored 24/7 for your peace of mind.',
  },
  {
    question: 'Do you allow pets?',
    answer: 'We welcome pets in select rooms. A pet fee of $50 per night applies. Please inform us in advance so we can prepare a pet-friendly room with amenities for your furry companion.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Reservations can be cancelled free of charge up to 48 hours before the scheduled check-in date. Cancellations made within 48 hours will be charged the full amount of the first night.',
  },
  {
    question: 'Is WiFi included in the room rate?',
    answer: 'Yes, complimentary high-speed fiber-optic WiFi is available throughout the entire hotel, including all guest rooms, restaurants, and public areas.',
  },
  {
    question: 'Do you offer airport transfers?',
    answer: 'Yes, we provide luxury airport transfer services. Please contact our concierge at least 24 hours in advance to arrange pickup. Charges apply based on distance.',
  },
  {
    question: 'Are there facilities for business meetings?',
    answer: 'Absolutely. We have 5 fully equipped meeting rooms and a grand ballroom that can accommodate up to 500 guests. Our business center is also available 24/7.',
  },
  {
    question: 'What dining options are available?',
    answer: 'SUG Hotel features 4 dining venues: The Golden Plate (fine dining), Sakura Garden (Asian fusion), Café Lumière (all-day dining), and Skyline Bar (rooftop lounge). Room service is available 24/7.',
  },
  {
    question: 'Is the pool heated?',
    answer: 'Yes, our rooftop infinity pool is heated year-round to a comfortable 28°C (82°F), allowing you to enjoy a swim regardless of the season.',
  },
  {
    question: 'How do I modify my booking?',
    answer: 'You can modify your booking by logging into your account and visiting the "My Bookings" section. Alternatively, contact our reservations team at +1 234 567 8900.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle size={32} className="text-gold mx-auto mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500">
            Find answers to common questions about your stay at SUG Hotel.
          </p>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white rounded-xl border transition-colors ${
                  isOpen ? 'border-gold/30' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-medium text-sm ${isOpen ? 'text-gold' : 'text-charcoal'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-gold flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-white rounded-xl border border-gray-100 p-8">
          <h3 className="font-serif text-lg text-charcoal mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Our team is here to help. Reach out and we will get back to you within 24 hours.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-light text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}