import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  User,
  LogOut,
  CalendarDays,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const allNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Dining', path: '/dining' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const navLinks = allNavLinks.filter((link) => link.path !== location.pathname);

  const handleNavClick = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* ─── Logo ─── */}
          <Link to="/" className="flex flex-col items-start shrink-0" onClick={handleNavClick}>
            <span className="font-serif text-2xl font-bold tracking-widest text-charcoal">
              SUG
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 -mt-1">
              Hotel
            </span>
          </Link>

          {/* ─── Desktop Nav ─── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-3 py-2 text-sm tracking-wide text-gray-500 hover:text-charcoal hover:bg-gray-50 rounded-md transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ─── Desktop Auth ─── */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-charcoal hover:bg-gray-50 rounded-md transition-all duration-200"
                >
                  <CalendarDays size={16} />
                  <span>My Bookings</span>
                </Link>

                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-charcoal hover:bg-charcoal-light rounded-md transition-colors duration-200"
                  >
                    <LayoutDashboard size={15} />
                    <span>Dashboard</span>
                  </Link>
                )}

                <div className="w-px h-6 bg-gray-200" />

                <button
                  onClick={logout}
                  className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
                  title="Log Out"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-charcoal hover:bg-charcoal-light rounded-md transition-colors duration-200"
              >
                <User size={16} />
                <span>Log In</span>
              </Link>
            )}
          </div>

          {/* ─── Mobile Menu Button ─── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      <div
        className={`
          md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg shadow-gray-100/50
          transition-all duration-300 ease-out overflow-hidden
          ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleNavClick}
              className="flex items-center px-4 py-3 text-sm text-gray-500 hover:text-charcoal hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}

          <div className="my-2 border-t border-gray-100" />

          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                onClick={handleNavClick}
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-charcoal hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <CalendarDays size={18} />
                <span>My Bookings</span>
              </Link>

              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Link
                  to="/admin"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white bg-charcoal hover:bg-charcoal-light rounded-lg transition-colors duration-200"
                >
                  <LayoutDashboard size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={handleNavClick}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-charcoal hover:bg-charcoal-light rounded-lg transition-colors duration-200"
            >
              <User size={18} />
              <span>Log In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}