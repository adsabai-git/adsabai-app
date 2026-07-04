import { createHmac } from 'crypto';

function stripBOM(s: string) {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}
const SECRET = stripBOM(process.env.JWT_SECRET || 'DEV_SECRET');

const EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a password-reset token.
 * The HMAC includes the current password hash so the token self-invalidates
 * the moment the password is changed — no DB column needed.
 */
export function generateResetToken(userId: number, passwordHash: string): string {
  const payload = JSON.stringify({ userId, exp: Date.now() + EXPIRY_MS });
  const data = Buffer.from(payload).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data + passwordHash).digest('hex');
  return `${data}.${sig}`;
}

/**
 * Verify a reset token. Returns userId on success, null on failure.
 * Caller must pass the *current* password hash from DB so the HMAC can be checked.
 */
export function verifyResetToken(token: string, passwordHash: string): number | null {
  try {
    const dotIdx = token.indexOf('.');
    if (dotIdx === -1) return null;
    const data = token.slice(0, dotIdx);
    const sig  = token.slice(dotIdx + 1);
    const payload: { userId: number; exp: number } = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    );
    if (Date.now() > payload.exp) return null;
    const expected = createHmac('sha256', SECRET).update(data + passwordHash).digest('hex');
    if (sig !== expected) return null;
    return payload.userId;
  } catch {
    return null;
  }
}
