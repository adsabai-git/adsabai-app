import jwt from 'jsonwebtoken';

// Strip UTF-8 BOM (0xFEFF) that PowerShell pipe encoding can prepend to env vars on Windows
const _rawSecret = process.env.JWT_SECRET || 'DEV_SECRET';
const SECRET = _rawSecret.charCodeAt(0) === 0xFEFF ? _rawSecret.slice(1) : _rawSecret;

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
