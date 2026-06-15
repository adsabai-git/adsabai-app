import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const chargeId = new URL(request.url).searchParams.get('chargeId');
  if (!chargeId) return NextResponse.json({ error: 'chargeId required' }, { status: 400 });

  const key = process.env.OMISE_SECRET_KEY ?? '';
  const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');

  try {
    const res = await fetch(`https://api.omise.co/charges/${chargeId}`, {
      headers: { Authorization: auth },
    });
    const charge = await res.json();
    return NextResponse.json({ status: charge.status, paid: charge.paid });
  } catch {
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
