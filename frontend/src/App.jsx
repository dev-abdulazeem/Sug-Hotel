import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Public Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Contact from './pages/Contact';
import Amenities from './pages/Amenities';
import Dining from './pages/Dining';
import Gallery from './pages/Gallery';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import PaymentVerify from './pages/PaymentVerify';
import Cancellation from './pages/cancellation';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRooms from './pages/admin/AdminRooms';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminReservations from './pages/admin/AdminReservations';
import AdminGallery from './pages/admin/AdminGallery';
import AdminHero from './pages/admin/AdminHero';
import AdminMessages from './pages/admin/AdminMessages';

// Receptionist Pages
import ReceptionistLayout from './pages/receptionist/ReceptionistLayout';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistBookings from './pages/receptionist/ReceptionistBookings';
import ReceptionistReservations from './pages/receptionist/ReceptionistReservations';

// Shared Export Component
import Exports from './components/exports/Exports';

// Route Guards
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')
    return <Navigate to="/" replace />;
  return children;
}

function ReceptionistRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (
    user?.role !== 'RECEPTIONIST' &&
    user?.role !== 'ADMIN' &&
    user?.role !== 'SUPER_ADMIN'
  ) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function UserRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  if (isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN')) {
    return <Navigate to="/admin" replace />;
  }
  if (isAuthenticated && user?.role === 'RECEPTIONIST') {
    return <Navigate to="/receptionist" replace />;
  }
  return children;
}

function App() {
  const { user, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '14px', borderRadius: '8px' },
          success: {
            style: { background: '#fafafa', border: '1px solid #e5e5e5', color: '#1a1a1a' },
            iconTheme: { primary: '#c9a96e', secondary: '#fff' },
          },
          error: {
            style: { background: '#fafafa', border: '1px solid #e5e5e5', color: '#1a1a1a' },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserRoute><Home /></UserRoute>} />
        <Route path="/rooms" element={<UserRoute><Rooms /></UserRoute>} />
        <Route path="/rooms/:id" element={<UserRoute><RoomDetail /></UserRoute>} />
        <Route path="/my-bookings" element={<UserRoute><MyBookings /></UserRoute>} />
        <Route path="/contact" element={<UserRoute><Contact /></UserRoute>} />
        <Route path="/amenities" element={<UserRoute><Amenities /></UserRoute>} />
        <Route path="/dining" element={<UserRoute><Dining /></UserRoute>} />
        <Route path="/gallery" element={<UserRoute><Gallery /></UserRoute>} />
        <Route path="/about" element={<UserRoute><About /></UserRoute>} />
        <Route path="/faq" element={<UserRoute><FAQ /></UserRoute>} />
        <Route path="/privacy" element={<UserRoute><Privacy /></UserRoute>} />
        <Route path="/terms" element={<UserRoute><Terms /></UserRoute>} />
        <Route path="/payment/verify" element={<UserRoute><PaymentVerify /></UserRoute>} />
        <Route path="/cancellation" element={<UserRoute><Cancellation /></UserRoute>} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="hero" element={<AdminHero />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="exports" element={<Exports allowDelete={true} />} />
        </Route>

        {/* Receptionist Routes */}
        <Route path="/receptionist" element={<ReceptionistRoute><ReceptionistLayout /></ReceptionistRoute>}>
          <Route index element={<ReceptionistDashboard />} />
          <Route path="bookings" element={<ReceptionistBookings />} />
          <Route path="reservations" element={<ReceptionistReservations />} />
          <Route path="exports" element={<Exports allowDelete={false} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;