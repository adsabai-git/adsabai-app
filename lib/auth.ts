import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'DEV_SECRET';

export function createToken(userId: number) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { userId: number };
  } catch {
    return null;
  }
}
