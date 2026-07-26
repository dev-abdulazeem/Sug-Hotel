import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Award, Users, Building2, Heart } from 'lucide-react';

const stats = [
  { icon: Building2, value: '25+', label: 'Years of Excellence' },
  { icon: Users, value: '50K+', label: 'Happy Guests' },
  { icon: Award, value: '15', label: 'Awards Won' },
  { icon: Heart, value: '100%', label: 'Guest Satisfaction' },
];

const team = [
  {
    name: 'Alexander Mitchell',
    role: 'General Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'With over 20 years in luxury hospitality, Alexander leads SUG Hotel with passion and vision.',
  },
  {
    name: 'Sophia Chen',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    bio: 'Michelin-starred chef Sophia brings world-class culinary artistry to every dish.',
  },
  {
    name: 'James Okonkwo',
    role: 'Head of Guest Experience',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'James ensures every guest receives personalized, unforgettable service from arrival to departure.',
  },
  {
    name: 'Isabella Rossi',
    role: 'Spa Director',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Isabella curates holistic wellness experiences that rejuvenate body, mind, and soul.',
  },
];

const values = [
  {
    title: 'Uncompromising Quality',
    description:
      'Every detail, from thread count to table setting, is meticulously curated to exceed expectations.',
  },
  {
    title: 'Genuine Hospitality',
    description:
      'We believe true luxury is making every guest feel genuinely seen, heard, and cared for.',
  },
  {
    title: 'Sustainable Luxury',
    description:
      'From solar panels to locally sourced ingredients, we are committed to responsible hospitality.',
  },
  {
    title: 'Timeless Elegance',
    description:
      'Our design philosophy blends classic sophistication with contemporary comfort.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920"
          alt="SUG Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl mb-6">A Legacy of Luxury</h1>
            <p className="text-white/80 leading-relaxed">
              Since 1999, SUG Hotel has been a beacon of refined hospitality, where timeless elegance
              meets modern comfort. What began as a boutique family-owned property has grown into
              one of the most celebrated luxury hotels in the region.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-charcoal py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon size={28} className="text-gold mx-auto mb-3" />
                  <p className="font-serif text-3xl text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Who We Are</p>
          <h2 className="font-serif text-3xl text-charcoal">Our Philosophy</h2>
        </div>
        <div className="prose prose-lg mx-auto text-gray-500 leading-relaxed text-center">
          <p className="mb-6">
            At SUG Hotel, we believe that luxury is not just about opulence — it is about the feeling
            of being truly at home, even when you are miles away from it. Every corner of our hotel
            is designed to evoke warmth, comfort, and a sense of belonging.
          </p>
          <p className="mb-6">
            Our team of dedicated professionals shares a singular vision: to create moments that
            linger long after checkout. From the aroma of freshly brewed coffee in the morning to
            the soft glow of sunset on our rooftop, every experience is crafted with intention.
          </p>
          <p>
            We are proud to be a part of your journey — whether it is a romantic getaway, a business
            trip, or a family vacation. Welcome to SUG Hotel, where every stay becomes a story worth
            telling.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">What Drives Us</p>
            <h2 className="font-serif text-3xl text-charcoal">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-cream rounded-xl p-8 text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-serif text-lg text-charcoal mb-3">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">The People</p>
          <h2 className="font-serif text-3xl text-charcoal">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg text-charcoal mb-1">{member.name}</h3>
                <p className="text-gold text-sm mb-3">{member.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}