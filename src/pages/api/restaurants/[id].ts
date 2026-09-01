import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query as { id: string };

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        openingHours: true,
        discounts: {
          where: { active: true },
        },
        reviews_relation: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    return res.status(200).json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
