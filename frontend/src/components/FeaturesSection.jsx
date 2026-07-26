import { Bed, UtensilsCrossed, Wifi, Headphones } from 'lucide-react';

const features = [
  {
    icon: Bed,
    title: 'Comfortable Rooms',
    description: 'Relax in stylish rooms designed for your comfort.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Delicious Dining',
    description: 'A variety of cuisines crafted to perfection.',
  },
  {
    icon: Wifi,
    title: 'Modern Amenities',
    description: 'Everything you need for a seamless stay.',
  },
  {
    icon: Headphones,
    title: '24/7 Service',
    description: 'Our dedicated team is always here for you.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group cursor-default"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gray-200 mb-5 group-hover:border-gold group-hover:bg-gold/5 transition-all duration-300">
                <feature.icon
                  size={24}
                  className="text-gray-400 group-hover:text-gold transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-serif text-lg text-charcoal mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}