import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Rooms', path: '/rooms' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Dining', path: '/dining' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const supportLinks = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Cancellation Policy', path: '/cancellation' },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ─── Brand ─── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <span className="font-serif text-3xl font-bold tracking-widest text-white">
                SUG
              </span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-white/40 mt-1">
                Hotel
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Experience comfort, elegance and unforgettable moments at SUG Hotel.
            </p>
          </div>

          {/* ─── Quick Links ─── */}
          <div>
            <h4 className="text-[11px] font-medium mb-5 text-white/50 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-1 text-sm text-white/40 hover:text-gold transition-colors duration-200"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Support ─── */}
          <div>
            <h4 className="text-[11px] font-medium mb-5 text-white/50 uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-1 text-sm text-white/40 hover:text-gold transition-colors duration-200"
                  >
                    {link.name}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Contact ─── */}
          <div>
            <h4 className="text-[11px] font-medium mb-5 text-white/50 uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Phone, text: '+1 234 567 8900' },
                { icon: Mail, text: 'info@sug-hotel.com' },
                { icon: MapPin, text: '123 Luxury Lane, Cityville, ST 12345' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-gold" />
                  </div>
                  <span className="text-sm text-white/40 leading-relaxed pt-1.5">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar (Glass) ─── */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} SUG Hotel. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-white/30 hover:text-gold transition-colors duration-200"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}