import Navbar from '../components/Navbar';
import { Award, Users, Building2, Heart } from 'lucide-react';

const team = [
  {
    name: 'Marcus Whitfield',
    role: 'General Manager',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    bio: 'With over 20 years in luxury hospitality, Marcus leads SUG Hotel with passion and an unwavering commitment to excellence.',
  },
  {
    name: 'Elena Vasquez',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400',
    bio: 'Elena brings two Michelin stars worth of culinary artistry to every plate, blending local flavors with global techniques.',
  },
  {
    name: 'David Okafor',
    role: 'Head of Guest Experience',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    bio: 'David ensures every guest receives personalized, white-glove service from the moment they arrive until departure.',
  },
  {
    name: 'Amara Diallo',
    role: 'Spa & Wellness Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    bio: 'Amara curates holistic wellness experiences that rejuvenate the body, calm the mind, and restore the spirit.',
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

      {/* ─── Hero ─── */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920"
          alt="SUG Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-3xl px-4">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">Our Story</p>
            <h1 className="font-serif text-4xl sm:text-5xl mb-6">A Legacy of Luxury</h1>
            <p className="text-white/80 leading-relaxed">
              Since 1999, SUG Hotel has been a beacon of refined hospitality, where timeless elegance
              meets modern comfort. What began as a boutique family-owned property has grown into
              one of the most celebrated luxury hotels in the region.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Our Story ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">Who We Are</p>
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

      {/* ─── Values ─── */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">What Drives Us</p>
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

      {/* ─── Team ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-medium">The People</p>
          <h2 className="font-serif text-3xl text-charcoal">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
    </div>
  );
}