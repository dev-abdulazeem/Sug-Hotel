import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800"
              alt="SUG Hotel Lobby"
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-medium">
              About Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-6 leading-tight">
              Hospitality Redefined
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              At SUG Hotel, we blend modern luxury with warm hospitality to create a relaxing and memorable stay for every guest. Whether you&apos;re here for business or leisure, we ensure an experience that feels like home.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Our dedicated team works tirelessly to provide personalized service, ensuring every detail of your stay exceeds expectations. From the moment you arrive until your departure, comfort and elegance surround you.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-light text-white px-6 py-3 text-sm tracking-wide transition-all duration-300 group rounded"
            >
              <span>Learn More</span>
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}