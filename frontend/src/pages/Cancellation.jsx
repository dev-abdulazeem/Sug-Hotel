import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AlertCircle, Clock, CreditCard, RefreshCw, XCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const policies = [
  {
    icon: Clock,
    title: 'Standard Cancellation',
    description: 'Cancellations made 48 hours or more before check-in are eligible for a full refund. No questions asked.',
  },
  {
    icon: AlertCircle,
    title: 'Late Cancellation',
    description: 'Cancellations made between 24–48 hours before check-in will incur a charge equal to one night\'s stay.',
  },
  {
    icon: XCircle,
    title: 'No-Show Policy',
    description: 'Failure to check in without prior notice will result in a full charge for the entire reservation.',
  },
  {
    icon: RefreshCw,
    title: 'Rescheduling',
    description: 'Guests may reschedule their stay once without penalty, provided the new dates are within 6 months of the original booking.',
  },
  {
    icon: CreditCard,
    title: 'Refund Processing',
    description: 'Refunds are processed within 5–10 business days to the original payment method. Processing times may vary by bank.',
  },
  {
    icon: CheckCircle,
    title: 'Special Rate Bookings',
    description: 'Non-refundable and promotional rate bookings cannot be cancelled or modified. Please review terms at checkout.',
  },
];

const faqs = [
  {
    question: 'Can I cancel my booking online?',
    answer: 'Yes. Log into your account, go to My Bookings, and select the booking you wish to cancel. Follow the prompts to complete the cancellation.',
  },
  {
    question: 'Will I receive a confirmation of my cancellation?',
    answer: 'Absolutely. Once your cancellation is processed, you will receive an email confirmation with the details of your refund or charges.',
  },
  {
    question: 'What if I need to cancel due to an emergency?',
    answer: 'We understand that emergencies happen. Contact our guest services team directly, and we will review your situation on a case-by-case basis.',
  },
  {
    question: 'Are group bookings subject to different policies?',
    answer: 'Yes. Group bookings of 5 rooms or more are subject to a separate cancellation policy. Please refer to your group reservation agreement.',
  },
];

export default function Cancellation() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Header ─── */}
      <div className="pt-28 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Booking Terms
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">
            Cancellation Policy
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            We understand plans change. Here is everything you need to know about modifying or cancelling your reservation.
          </p>
        </div>
      </div>

      {/* ─── Policy Cards ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <div
                key={policy.title}
                className="bg-white rounded-xl border border-gray-100 p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="font-serif text-lg text-charcoal mb-3">
                  {policy.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {policy.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Timeline ─── */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
              At a Glance
            </p>
            <h2 className="font-serif text-2xl text-charcoal">Cancellation Timeline</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />

            <div className="space-y-8">
              {[
                {
                  time: '48+ Hours Before',
                  result: 'Full Refund',
                  detail: 'Cancel anytime before 48 hours of check-in for a complete refund.',
                  color: 'bg-green-50 text-green-600',
                },
                {
                  time: '24–48 Hours Before',
                  result: 'One Night Charge',
                  detail: 'A fee equivalent to one night\'s stay will be deducted from your refund.',
                  color: 'bg-amber-50 text-amber-600',
                },
                {
                  time: 'Less Than 24 Hours',
                  result: 'Full Charge',
                  detail: 'The entire reservation amount will be charged. No refund available.',
                  color: 'bg-red-50 text-red-600',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-6 sm:pl-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 hidden sm:flex ${item.color}`}>
                    <span className="text-xs font-bold">{idx + 1}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 flex-1 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h4 className="font-medium text-charcoal">{item.time}</h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.color}`}>
                        {item.result}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FAQs ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
            Common Questions
          </p>
          <h2 className="font-serif text-2xl text-charcoal">Frequently Asked</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="font-medium text-charcoal mb-2 text-sm">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="bg-charcoal py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">
            Need to Modify Your Booking?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Log into your account to view, reschedule, or cancel your reservation in just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-3.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span>My Bookings</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 px-8 py-3.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}