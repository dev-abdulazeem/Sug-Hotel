import { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import RoomsSection from '../components/RoomsSection';
import AboutSection from '../components/AboutSection';
import GallerySection from '../components/GallerySection';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

export default function Home() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    checkIn: formatDate(today),
    checkOut: formatDate(tomorrow),
    guests: '2',
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <FeaturesSection />
      <RoomsSection />
      <AboutSection />
      <GallerySection />
      <Newsletter />
      <Footer />
    </div>
  );
}