import { extractTokenFromHeader, generateToken, verifyToken } from '@/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
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

    // Generate a fresh token for QR code (valid for 5 minutes)
    const qrToken = generateToken({ userId: payload.userId, email: payload.email, qr: true });

    return res.status(200).json({
      token: qrToken,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
  } catch (error) {
    console.error('Get current token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
