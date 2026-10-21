import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email?: string | null;
        name?: string | null;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'development-secret';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing bearer token' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: number; email?: string; name?: string };

    req.user = {
      id: decoded.sub,
      email: decoded.email ?? null,
      name: decoded.name ?? null,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

export function signToken(user: { id: number; email: string; name?: string | null }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name ?? null,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
