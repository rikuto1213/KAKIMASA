import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { id } = req.query as { id: string };

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: payload.userId,
        restaurantId: id,
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return res.status(200).json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
