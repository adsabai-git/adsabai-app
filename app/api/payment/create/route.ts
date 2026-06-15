import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

const OMISE_API = 'https://api.omise.co';

function authHeader() {
  const key = process.env.OMISE_SECRET_KEY ?? '';
  return 'Basic ' + Buffer.from(`${key}:`).toString('base64');
}

async function omisePost(path: string, params: Record<string, string>) {
  const res = await fetch(`${OMISE_API}${path}`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  return res.json();
}

export async function POST(request: Request) {
  const bearer = (request.headers.get('Authorization') ?? '').replace('Bearer ', '');
  if (!verifyToken(bearer)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { type?: string; token?: string; amount?: number };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, token, amount } = body;
  const satang = String(Math.round(Number(amount ?? 0) * 100));

  try {
    if (type === 'promptpay') {
      const source = await omisePost('/sources', { type: 'promptpay', amount: satang, currency: 'thb' });
      if (source.object === 'error') return NextResponse.json({ error: source.message }, { status: 400 });

      const charge = await omisePost('/charges', { amount: satang, currency: 'thb', source: source.id });
      if (charge.object === 'error') return NextResponse.json({ error: charge.message }, { status: 400 });

      return NextResponse.json({
        chargeId: charge.id,
        qrCodeUrl: charge.source?.scannable_code?.image?.download_uri ?? '',
        status: charge.status,
      });
    }

    if (type === 'card') {
      if (!token) return NextResponse.json({ error: 'Card token required' }, { status: 400 });
      const charge = await omisePost('/charges', { amount: satang, currency: 'thb', card: token });
      if (charge.object === 'error') return NextResponse.json({ error: charge.message }, { status: 400 });
      return NextResponse.json({ chargeId: charge.id, status: charge.status, paid: charge.paid });
    }

    return NextResponse.json({ error: 'Invalid payment type' }, { status: 400 });
  } catch (err) {
    console.error('Omise error:', err);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
