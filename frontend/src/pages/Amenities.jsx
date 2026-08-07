import Navbar from '../components/Navbar';
import {
  Waves,
  Dumbbell,
  Wifi,
  Car,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  ConciergeBell,
  Baby,
  Briefcase,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';

const amenities = [
  {
    category: 'Wellness & Recreation',
    items: [
      {
        icon: Waves,
        title: 'Infinity Pool',
        description: 'Rooftop infinity pool with panoramic city views, heated year-round for your comfort.',
      },
      {
        icon: Sparkles,
        title: 'Luxury Spa',
        description: 'Full-service spa offering massages, facials, body treatments, and aromatherapy sessions.',
      },
      {
        icon: Dumbbell,
        title: 'Fitness Center',
        description: 'State-of-the-art gym with personal trainers, yoga classes, and modern cardio equipment.',
      },
    ],
  },
  {
    category: 'Dining & Drinks',
    items: [
      {
        icon: UtensilsCrossed,
        title: 'Fine Dining Restaurant',
        description: 'Award-winning restaurant serving international cuisine crafted by world-class chefs.',
      },
      {
        icon: Coffee,
        title: 'Lobby Café',
        description: 'Artisan coffee, fresh pastries, and light bites in an elegant setting.',
      },
      {
        icon: ConciergeBell,
        title: '24/7 Room Service',
        description: 'Gourmet dining delivered to your room any time of day or night.',
      },
    ],
  },
  {
    category: 'Services & Convenience',
    items: [
      {
        icon: Wifi,
        title: 'High-Speed WiFi',
        description: 'Complimentary fiber-optic internet throughout the entire property.',
      },
      {
        icon: Car,
        title: 'Valet Parking',
        description: 'Secure underground parking with complimentary valet service for all guests.',
      },
      {
        icon: Briefcase,
        title: 'Business Center',
        description: 'Fully equipped business lounge with meeting rooms, printing, and secretarial services.',
      },
    ],
  },
  {
    category: 'Family & Safety',
    items: [
      {
        icon: Baby,
        title: 'Kids Club',
        description: 'Supervised activities, games, and entertainment for children of all ages.',
      },
      {
        icon: Shield,
        title: '24/7 Security',
        description: 'Round-the-clock security personnel and CCTV surveillance for your peace of mind.',
      },
      {
        icon: Clock,
        title: 'Concierge Service',
        description: 'Dedicated concierge team to assist with reservations, tours, and special requests.',
      },
    ],
  },
];

export default function Amenities() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ─── Hero Header ─── */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920"
          alt="SUG Hotel Amenities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">
              Our Facilities
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl mb-4">World-Class Amenities</h1>
            <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
              Every detail designed for your comfort, relaxation, and unforgettable experiences.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Amenities Grid ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {amenities.map((section) => (
          <div key={section.category} className="mb-16 last:mb-0">
            <h2 className="font-serif text-2xl text-charcoal mb-8 text-center">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300 group"
                  >
                    <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                      <Icon size={24} className="text-gold" />
                    </div>
                    <h3 className="font-serif text-lg text-charcoal mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── CTA Section ─── */}
      <div className="bg-charcoal py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl text-white mb-4">
            Ready to Experience It All?
          </h2>
          <p className="text-gray-400 mb-8">
            Book your stay today and enjoy unlimited access to all our premium amenities.
          </p>
          <a
            href="/rooms"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-white px-8 py-3.5 rounded-lg text-sm tracking-wide transition-colors"
          >
            <span>Book Your Stay</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}