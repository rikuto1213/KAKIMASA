import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if data already exists
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
      return res.status(400).json({ message: 'Data already seeded' });
    }

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '09012345678',
        points: 150,
      },
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '09087654321',
        points: 250,
      },
    });

    // Create sample restaurants
    const restaurant1 = await prisma.restaurant.create({
      data: {
        name: 'Sakura Sushi',
        description: '高級寿司とおまかせコース',
        address: '東京都渋谷区道玄坂1-2-3',
        latitude: 35.6595,
        longitude: 139.7004,
        imageUrl: 'https://via.placeholder.com/300x200?text=Sakura+Sushi',
        rating: 4.8,
        reviews: 128,
        phoneNumber: '03-1234-5678',
        email: 'info@sakura-sushi.jp',
        pointsPerVisit: 20,
      },
    });

    const restaurant2 = await prisma.restaurant.create({
      data: {
        name: 'Ramen Yokocho',
        description: '本格豚骨ラーメン',
        address: '東京都新宿区歌舞伎町1-2-3',
        latitude: 35.6737,
        longitude: 139.7411,
        imageUrl: 'https://via.placeholder.com/300x200?text=Ramen+Yokocho',
        rating: 4.5,
        reviews: 256,
        phoneNumber: '03-9876-5432',
        email: 'info@ramen-yokocho.jp',
        pointsPerVisit: 15,
      },
    });

    const restaurant3 = await prisma.restaurant.create({
      data: {
        name: 'Omurice Ya',
        description: 'ふわふわオムライス専門店',
        address: '東京都渋谷区神宮前1-2-3',
        latitude: 35.6654,
        longitude: 139.7297,
        imageUrl: 'https://via.placeholder.com/300x200?text=Omurice+Ya',
        rating: 4.3,
        reviews: 189,
        phoneNumber: '03-5555-1234',
        email: 'info@omurice-ya.jp',
        pointsPerVisit: 12,
      },
    });

    // Create opening hours
    await prisma.openingHours.create({
      data: {
        restaurantId: restaurant1.id,
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '23:00' },
        friday: { open: '11:00', close: '23:30' },
        saturday: { open: '11:00', close: '23:30' },
        sunday: { open: '11:00', close: '22:00' },
      },
    });

    await prisma.openingHours.create({
      data: {
        restaurantId: restaurant2.id,
        monday: { open: '11:30', close: '22:00' },
        tuesday: { open: '11:30', close: '22:00' },
        wednesday: { open: '11:30', close: '22:00' },
        thursday: { open: '11:30', close: '22:00' },
        friday: { open: '11:30', close: '23:00' },
        saturday: { open: '11:30', close: '23:00' },
        sunday: { open: '11:30', close: '21:00' },
      },
    });

    // Create sample discounts
    await prisma.discount.create({
      data: {
        restaurantId: restaurant1.id,
        name: '新規会員割引',
        description: '初回来店20%OFF',
        pointsRequired: 0,
        discount: 20,
        discountType: 'percentage',
        validUntil: new Date('2026-12-31'),
        active: true,
      },
    });

    // Create sample reservations
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    await prisma.reservation.create({
      data: {
        userId: user1.id,
        restaurantId: restaurant1.id,
        date: futureDate,
        time: '19:00',
        numberOfPeople: 2,
        specialRequests: 'お誕生日のお祝いでご利用します',
        status: 'confirmed',
        pointsEarned: 20,
      },
    });

    // Create sample reviews
    await prisma.review.create({
      data: {
        userId: user2.id,
        restaurantId: restaurant1.id,
        rating: 5,
        comment: '素晴らしいおまかせでした。ネタも新鮮で最高です！',
      },
    });

    // Create sample favorites
    await prisma.favorite.create({
      data: {
        userId: user1.id,
        restaurantId: restaurant1.id,
      },
    });

    await prisma.favorite.create({
      data: {
        userId: user1.id,
        restaurantId: restaurant2.id,
      },
    });

    // Create sample points transactions
    await prisma.pointsTransaction.create({
      data: {
        userId: user1.id,
        type: 'earned',
        amount: 20,
        restaurantId: restaurant1.id,
        description: 'Sakura Sushiでの来店ポイント',
      },
    });

    return res.status(201).json({
      message: 'Seeding completed successfully',
      data: {
        users: 2,
        restaurants: 3,
        reservations: 1,
        reviews: 1,
        favorites: 2,
      },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ error: 'Seeding failed', details: (error as any).message });
  }
}
