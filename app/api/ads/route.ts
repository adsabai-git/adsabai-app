import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyToken } from '../../../lib/auth';
import { isExpired, getExpiresAt, getPackage } from '../../../lib/ad-packages';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const featured = url.searchParams.get('featured') === 'true';

  let query = supabaseAdmin
    .from('Ad')
    .select('*, User(id,name,email)')
    .eq('status', 'active')
    .order('createdAt', { ascending: false });

  if (featured) query = (query as any).eq('packageType', 'premium');

  const { data: ads, error } = await query;
  if (error || !ads) return NextResponse.json([]);

  const parsed = (ads as any[]).map((ad) => {
    const { User: user, ...rest } = ad;
    return {
      ...rest,
      user,
      imageUrls: typeof rest.imageUrls === 'string' ? JSON.parse(rest.imageUrls || '[]') : rest.imageUrls || [],
      expiresAt: getExpiresAt(rest.createdAt, rest.packageType).toISOString(),
    };
  });

  const active = parsed.filter((ad) => !isExpired(ad.createdAt, ad.packageType));

  return NextResponse.json([
    ...active.filter((ad) => ad.packageType === 'premium'),
    ...active.filter((ad) => ad.packageType !== 'premium'),
  ]);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, category, location, price, packageType, phone, website, imageUrls } = body;

  if (!title || !description || !category || !packageType) {
    return NextResponse.json({ error: 'Title, description, category, and package type are required.' }, { status: 400 });
  }

  const pkg       = getPackage(packageType);
  const now       = new Date();
  const expiresAt = new Date(now.getTime() + pkg.durationDays * 24 * 60 * 60 * 1000);

  const { data: ad, error } = await supabaseAdmin
    .from('Ad')
    .insert({
      title,
      description,
      category,
      location:    location    || null,
      price:       price       || null,
      packageType,
      phone:       phone       || null,
      website:     website     || null,
      imageUrls:   JSON.stringify(imageUrls || []),
      status:      'active',
      expiresAt:   expiresAt.toISOString(),
      publishedAt: now.toISOString(),
      userId:      payload.userId,
    })
    .select()
    .single();

  if (error || !ad) {
    console.error('Create ad error:', error);
    // Notify user of failure
    await supabaseAdmin.from('Notification').insert({
      userId: payload.userId,
      type: 'payment_failed',
      title: 'Ad Submission Failed',
      message: `We could not publish your ad "${title}". Please try again or contact support.`,
    }).then(() => {});
    return NextResponse.json({ error: 'Failed to create ad.' }, { status: 500 });
  }

  // Notify user of success
  await supabaseAdmin.from('Notification').insert({
    userId: payload.userId,
    type: 'payment_success',
    title: 'Ad Published Successfully',
    message: `Your "${packageType}" ad "${title}" is now live for ${pkg.durationDays} days. Amount charged: ฿${pkg.price}.`,
    adId: (ad as any).id,
  }).then(() => {});

  return NextResponse.json(ad);
}
