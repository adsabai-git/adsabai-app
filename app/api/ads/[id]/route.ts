import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';
import { getExpiresAt } from '../../../../lib/ad-packages';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const adId = Number(id);

  if (Number.isNaN(adId)) {
    return NextResponse.json({ error: 'Invalid ad id.' }, { status: 400 });
  }

  const { data: ad } = await supabaseAdmin
    .from('Ad')
    .select('*, User(id,name,email)')
    .eq('id', adId)
    .single();

  if (!ad) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }

  const { User: user, ...rest } = ad as any;

  return NextResponse.json({
    ...rest,
    user,
    imageUrls: typeof rest.imageUrls === 'string' ? JSON.parse(rest.imageUrls || '[]') : rest.imageUrls || [],
    expiresAt: getExpiresAt(rest.createdAt, rest.packageType).toISOString(),
  });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adId = Number(id);
  if (Number.isNaN(adId)) {
    return NextResponse.json({ error: 'Invalid ad id.' }, { status: 400 });
  }

  const { data: existingAd } = await supabaseAdmin.from('Ad').select('userId').eq('id', adId).single();
  if (!existingAd) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }

  if ((existingAd as any).userId !== payload.userId) {
    return NextResponse.json({ error: 'You do not have permission to edit this ad.' }, { status: 403 });
  }

  const body = await request.json();
  const { title, description, category, location, price, packageType, phone, website, imageUrls } = body;

  if (!title || !description || !category || !packageType) {
    return NextResponse.json({ error: 'Title, description, category, and package type are required.' }, { status: 400 });
  }

  const { data: updatedAd, error } = await supabaseAdmin
    .from('Ad')
    .update({
      title,
      description,
      category,
      location: location || null,
      price:    price    || null,
      packageType,
      phone:    phone    || null,
      website:  website  || null,
      imageUrls: JSON.stringify(imageUrls || []),
    })
    .eq('id', adId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update ad.' }, { status: 500 });
  }

  return NextResponse.json(updatedAd);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adId = Number(id);
  if (Number.isNaN(adId)) {
    return NextResponse.json({ error: 'Invalid ad id.' }, { status: 400 });
  }

  const { data: existingAd } = await supabaseAdmin.from('Ad').select('userId').eq('id', adId).single();
  if (!existingAd) {
    return NextResponse.json({ error: 'Ad not found.' }, { status: 404 });
  }

  if ((existingAd as any).userId !== payload.userId) {
    return NextResponse.json({ error: 'You do not have permission to delete this ad.' }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from('Ad').delete().eq('id', adId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete ad.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
