import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { latitude, longitude, radius: radiusParam } = req.query as {
      latitude?: string;
      longitude?: string;
      radius?: string;
    };
    const radius = parseInt(radiusParam || '50', 10);

    let restaurants;

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);

      // Simple distance calculation (you can improve this with PostGIS)
      restaurants = await prisma.restaurant.findMany({
        take: 50,
        include: {
          openingHours: true,
          discounts: {
            where: { active: true },
          },
        },
      });

      // Filter by distance in application layer
      restaurants = restaurants.filter((r) => {
        const distance = calculateDistance(lat, lon, r.latitude, r.longitude);
        return distance <= radius;
      });
    } else {
      restaurants = await prisma.restaurant.findMany({
        take: 50,
        include: {
          openingHours: true,
          discounts: {
            where: { active: true },
          },
        },
      });
    }

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
