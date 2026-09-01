import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: payload.userId },
        include: {
          restaurant: true,
        },
      });

      return res.status(200).json(favorites.map((f: { restaurant: unknown }) => f.restaurant));
    } catch (error) {
      console.error('Get favorites error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { restaurantId } = req.body;

      if (!restaurantId) {
        return res.status(400).json({ error: 'restaurantId is required' });
      }

      const favorite = await prisma.favorite.create({
        data: {
          userId: payload.userId,
          restaurantId,
        },
        include: {
          restaurant: true,
        },
      });

      return res.status(201).json(favorite);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Already in favorites' });
      }

      console.error('Add favorite error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
