import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { qrToken, amount } = req.body;

    if (!qrToken || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Verify QR token (backend verification)
    const payload = verifyToken(qrToken);
    if (!payload || !payload.qr) {
      return res.status(401).json({ error: 'Invalid QR token' });
    }

    const userId = payload.userId;

    // Calculate points to award (1% of amount, e.g., 3000 yen = 30 points)
    const pointsToAward = Math.floor(amount / 100);

    // Create transaction record
    const transaction = await prisma.pointsTransaction.create({
      data: {
        userId,
        type: 'earned',
        amount: pointsToAward,
        description: `¥${amount.toLocaleString('ja-JP')}の会計でポイント獲得`,
      },
    });

    // Update user points
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: pointsToAward,
        },
      },
      select: {
        id: true,
        points: true,
        name: true,
      },
    });

    return res.status(200).json({
      success: true,
      pointsAwarded: pointsToAward,
      totalPoints: user.points,
      transaction,
    });
  } catch (error) {
    console.error('Award points error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
