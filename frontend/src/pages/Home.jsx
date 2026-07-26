import { useState, useEffect } from 'react';
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": "SUG Hotel",
    "image": [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200"
    ],
    "url": "https://www.sug.name.ng",
    "telephone": "+2347054770904",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State"
    },
    "priceRange": "₦₦₦",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Swimming Pool", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Spa", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Room Types",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "HotelRoom",
            "name": "Deluxe Room",
            "description": "Spacious and elegant room with modern facilities, city view, and premium bedding.",
            "image": "https://res.cloudinary.com/dlsmx6xx2/image/upload/v1784588877/sug-hotel/rooms/d3ryd7mjskf5qbco5prr.webp",
            "bed": { "@type": "BedDetails", "typeOfBed": "King Size" },
            "occupancy": { "@type": "QuantitativeValue", "value": 2 }
          },
          "price": "120.00",
          "priceCurrency": "NGN"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "HotelRoom",
            "name": "Premium Room",
            "description": "Enjoy extra space and premium amenities with a stunning panoramic view.",
            "image": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
            "bed": { "@type": "BedDetails", "typeOfBed": "King Size" },
            "occupancy": { "@type": "QuantitativeValue", "value": 2 }
          },
          "price": "160.00",
          "priceCurrency": "NGN"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "HotelRoom",
            "name": "Executive Suite",
            "description": "Luxury suite with separate living area and exclusive perks.",
            "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
            "bed": { "@type": "BedDetails", "typeOfBed": "King Size + Sofa Bed" },
            "occupancy": { "@type": "QuantitativeValue", "value": 3 }
          },
          "price": "220.00",
          "priceCurrency": "NGN"
        }
      ]
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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