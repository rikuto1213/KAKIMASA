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
      const reservations = await prisma.reservation.findMany({
        where: { userId: payload.userId },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(reservations);
    } catch (error) {
      console.error('Get reservations error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { restaurantId, date, time, numberOfPeople, specialRequests } = req.body;

      if (!restaurantId || !date || !time || !numberOfPeople) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const reservation = await prisma.reservation.create({
        data: {
          userId: payload.userId,
          restaurantId,
          date: new Date(date),
          time,
          numberOfPeople,
          specialRequests,
          status: 'pending',
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              pointsPerVisit: true,
            },
          },
        },
      });

      return res.status(201).json(reservation);
    } catch (error) {
      console.error('Create reservation error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
