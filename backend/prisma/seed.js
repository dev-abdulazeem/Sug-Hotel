const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // ── Create admin user ─────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sug-hotel.com' },
    update: {},
    create: {
      email: 'admin@sug-hotel.com',
      password: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Admin created:', admin.email);

  // ── Create receptionist user ────────────────────────────────
  const receptionistPassword = await bcrypt.hash('reception123', 12);
  const receptionist = await prisma.user.upsert({
    where: { email: 'reception@sug-hotel.com' },
    update: {},
    create: {
      email: 'reception@sug-hotel.com',
      password: receptionistPassword,
      firstName: 'Front',
      lastName: 'Desk',
      role: 'RECEPTIONIST',
    },
  });

  console.log('✅ Receptionist created:', receptionist.email);

  // ── Create sample rooms ─────────────────────────────────────
  const rooms = [
    {
      id: 'room-deluxe-001',
      name: 'Deluxe Room',
      description: 'Spacious and elegant room with modern facilities, city view, and premium bedding.',
      type: 'DELUXE',
      pricePerNight: 120,
      capacity: 2,
      size: 350,
      bedType: 'King Size',
      amenities: ['WiFi', 'AC', 'Mini Bar', 'Smart TV', 'City View'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
      featured: true,
    },
    {
      id: 'room-premium-002',
      name: 'Premium Room',
      description: 'Enjoy extra space and premium amenities with a stunning panoramic view.',
      type: 'PREMIUM',
      pricePerNight: 160,
      capacity: 2,
      size: 450,
      bedType: 'King Size',
      amenities: ['WiFi', 'AC', 'Mini Bar', 'Smart TV', 'Panoramic View', 'Bathtub'],
      images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'],
      featured: true,
    },
    {
      id: 'room-executive-003',
      name: 'Executive Suite',
      description: 'Luxury suite with separate living area and exclusive perks for the discerning traveler.',
      type: 'SUITE',
      pricePerNight: 220,
      capacity: 3,
      size: 650,
      bedType: 'King Size + Sofa Bed',
      amenities: ['WiFi', 'AC', 'Mini Bar', 'Smart TV', 'Panoramic View', 'Jacuzzi', 'Living Room', 'Kitchenette'],
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],
      featured: true,
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: {},
      create: room,
    });
  }

  console.log('✅ Sample rooms created');

  // ── Create hero images ──────────────────────────────────────
  const heroImages = [
    {
      id: 'hero-welcome-001',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
      title: 'Welcome to SUG Hotel',
      subtitle: 'Experience comfort, elegance and unforgettable moments.',
      isActive: true,
      order: 0,
    },
    {
      id: 'hero-luxury-002',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920',
      title: 'Luxury Redefined',
      subtitle: 'Where every detail is crafted for your comfort.',
      isActive: true,
      order: 1,
    },
  ];

  for (const img of heroImages) {
    await prisma.heroImage.upsert({
      where: { id: img.id },
      update: {},
      create: img,
    });
  }

  console.log('✅ Hero images created');

  // ── Create restaurants ────────────────────────────────────────
  const restaurants = [
    {
      id: 'rest-golden-001',
      name: 'The Golden Plate',
      type: 'Fine Dining',
      description: 'An exquisite fine dining experience featuring contemporary international cuisine crafted by our Michelin-starred executive chef. Seasonal menus, wine pairings, and impeccable service.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      hours: '6:00 PM - 11:00 PM',
      location: 'Ground Floor',
      phone: '+1 234 567 8901',
      rating: 4.9,
      specialties: ['Wagyu Beef', 'Lobster Thermidor', 'Truffle Risotto'],
      isActive: true,
      order: 0,
    },
    {
      id: 'rest-sakura-002',
      name: 'Sakura Garden',
      type: 'Asian Fusion',
      description: 'Authentic Asian flavors with a modern twist. From sushi and sashimi to teppanyaki and dim sum, experience the best of East Asian cuisine in an elegant setting.',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      hours: '12:00 PM - 10:00 PM',
      location: '2nd Floor',
      phone: '+1 234 567 8902',
      rating: 4.8,
      specialties: ['Omakase Sushi', 'Peking Duck', 'Ramen Bowl'],
      isActive: true,
      order: 1,
    },
    {
      id: 'rest-cafe-003',
      name: 'Café Lumière',
      type: 'All-Day Dining',
      description: 'A bright and airy café serving artisan coffee, fresh pastries, healthy salads, and light meals throughout the day. Perfect for breakfast meetings or afternoon tea.',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      hours: '6:00 AM - 10:00 PM',
      location: 'Lobby Level',
      phone: '+1 234 567 8903',
      rating: 4.7,
      specialties: ['Eggs Benedict', 'Avocado Toast', 'French Pastries'],
      isActive: true,
      order: 2,
    },
    {
      id: 'rest-skyline-004',
      name: 'Skyline Bar',
      type: 'Rooftop Lounge',
      description: 'Rooftop bar with breathtaking city views. Expert mixologists craft signature cocktails while you enjoy tapas, live music, and the sunset.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
      hours: '4:00 PM - 2:00 AM',
      location: 'Rooftop',
      phone: '+1 234 567 8904',
      rating: 4.9,
      specialties: ['Signature Cocktails', 'Tapas Platter', 'Champagne Selection'],
      isActive: true,
      order: 3,
    },
  ];

  for (const r of restaurants) {
    await prisma.restaurant.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    });
  }

  console.log('✅ Restaurants created');

  // ── Create gallery albums ───────────────────────────────────
  const albums = [
    {
      id: 'album-exterior-001',
      name: 'Exterior',
      slug: 'exterior',
      description: 'Stunning views of SUG Hotel from the outside.',
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      isActive: true,
      order: 0,
    },
    {
      id: 'album-rooms-002',
      name: 'Rooms & Suites',
      slug: 'rooms-suites',
      description: 'Luxurious accommodations designed for comfort.',
      coverImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      isActive: true,
      order: 1,
    },
    {
      id: 'album-dining-003',
      name: 'Dining',
      slug: 'dining',
      description: 'Culinary excellence in every dish.',
      coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      isActive: true,
      order: 2,
    },
    {
      id: 'album-pool-004',
      name: 'Pool & Spa',
      slug: 'pool-spa',
      description: 'Relaxation and rejuvenation at its finest.',
      coverImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      isActive: true,
      order: 3,
    },
  ];

  for (const album of albums) {
    await prisma.galleryAlbum.upsert({
      where: { id: album.id },
      update: {},
      create: album,
    });
  }

  console.log('✅ Gallery albums created');

  // ── Create gallery photos ───────────────────────────────────
  const photos = [
    // Exterior
    { albumId: 'album-exterior-001', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', caption: 'Hotel Facade', order: 0 },
    { albumId: 'album-exterior-001', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Night View', order: 1 },
    { albumId: 'album-exterior-001', imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', caption: 'Grand Entrance', order: 2 },
    // Rooms
    { albumId: 'album-rooms-002', imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', caption: 'Deluxe Room', order: 0 },
    { albumId: 'album-rooms-002', imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', caption: 'Premium Suite', order: 1 },
    { albumId: 'album-rooms-002', imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', caption: 'Executive Suite', order: 2 },
    { albumId: 'album-rooms-002', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', caption: 'Penthouse', order: 3 },
    // Dining
    { albumId: 'album-dining-003', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', caption: 'The Golden Plate', order: 0 },
    { albumId: 'album-dining-003', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', caption: 'Sakura Garden', order: 1 },
    { albumId: 'album-dining-003', imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', caption: 'Café Lumière', order: 2 },
    // Pool & Spa
    { albumId: 'album-pool-004', imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Infinity Pool', order: 0 },
    { albumId: 'album-pool-004', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800', caption: 'Luxury Spa', order: 1 },
    { albumId: 'album-pool-004', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', caption: 'Fitness Center', order: 2 },
  ];

  for (const photo of photos) {
    await prisma.galleryPhoto.create({ data: photo });
  }

  console.log('✅ Gallery photos created');

   // ── Create sample table reservations ────────────────────────
  const reservations = [
    {
      restaurant: { connect: { id: 'rest-golden-001' } },
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      date: new Date('2026-07-25'),
      time: '7:00 PM',
      guests: 4,
      status: 'CONFIRMED',
      specialRequests: 'Window table preferred',
    },
    {
      restaurant: { connect: { id: 'rest-sakura-002' } },
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 234 567 8901',
      date: new Date('2026-07-26'),
      time: '8:00 PM',
      guests: 2,
      status: 'PENDING',
      specialRequests: 'Anniversary dinner',
    },
    {
      restaurant: { connect: { id: 'rest-skyline-004' } },
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 234 567 8902',
      date: new Date('2026-07-24'),
      time: '6:30 PM',
      guests: 6,
      status: 'COMPLETED',
      specialRequests: 'Birthday celebration',
    },
  ];

  for (const res of reservations) {
    await prisma.tableReservation.create({ data: res });
  }

  console.log('✅ Sample reservations created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });