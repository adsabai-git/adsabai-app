import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { verifyToken } from '../../../../../lib/auth';
import { getPackage } from '../../../../../lib/ad-packages';

const BETA_FREE_BASIC = false; // renewals always charge, even during beta

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization') || '';
  const payload = verifyToken(authHeader.replace('Bearer ', ''));
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { packageType, chargeId } = body as { packageType: string; chargeId?: string };

  if (!['basic', 'standard', 'premium'].includes(packageType))
    return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });

  const pkg = getPackage(packageType);
  const isFree = BETA_FREE_BASIC && packageType === 'basic';
  const requiresPayment = pkg.price > 0 && !isFree;

  if (requiresPayment && !chargeId)
    return NextResponse.json({ error: 'Payment required for this package' }, { status: 400 });

  // Verify ownership
  const { data: existing } = await supabaseAdmin
    .from('Ad')
    .select('id, userId, title')
    .eq('id', Number(id))
    .single();

  if (!existing || (existing as any).userId !== payload.userId)
    return NextResponse.json({ error: 'Ad not found' }, { status: 404 });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

  const { error: updateError } = await supabaseAdmin
    .from('Ad')
    .update({
      packageType,
      publishedAt: now.toISOString(),
      expiresAt:   expiresAt.toISOString(),
      createdAt:   now.toISOString(), // reset listing date so ad sorts as newest
      status:      'active',
    })
    .eq('id', Number(id));

  if (updateError) return NextResponse.json({ error: 'Renewal failed' }, { status: 500 });

  const priceText = isFree ? 'Free (beta)' : `฿${pkg.price}`;
  await supabaseAdmin.from('Notification').insert({
    userId:  payload.userId,
    type:    'payment_success',
    title:   'Ad Renewed Successfully',
    message: `Your ${packageType} ad "${(existing as any).title}" is now live for ${pkg.durationDays} days. ${priceText}.`,
    adId:    Number(id),
  }).then(() => {});

  return NextResponse.json({ success: true, expiresAt: expiresAt.toISOString() });
}
