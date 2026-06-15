import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET ?raterId=xxx  — returns the existing rating for this browser/user
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const raterId = new URL(request.url).searchParams.get('raterId');
  if (!raterId) return NextResponse.json({ rating: null });

  const { data } = await supabaseAdmin
    .from('Rating')
    .select('value')
    .eq('adId', Number(id))
    .eq('raterId', raterId)
    .maybeSingle();

  return NextResponse.json({ rating: data ? (data as any).value : null });
}

// POST { value, raterId }  — no auth required
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const adId = Number(id);
  if (Number.isNaN(adId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const body = await request.json();
  const { value, raterId } = body;

  if (!raterId) return NextResponse.json({ error: 'raterId required' }, { status: 400 });
  const v = Number(value);
  if (!v || v < 1 || v > 5) return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 });

  // Check if this user has rated before (needed to adjust aggregate correctly)
  const [{ data: existing }, { data: adRow }] = await Promise.all([
    supabaseAdmin.from('Rating').select('value').eq('adId', adId).eq('raterId', raterId).maybeSingle(),
    supabaseAdmin.from('Ad').select('ratingAvg, ratingCount').eq('id', adId).single(),
  ]);

  const oldCount: number = (adRow as any)?.ratingCount ?? 0;
  const oldAvg: number   = (adRow as any)?.ratingAvg   ?? 0;
  const oldValue: number | null = existing ? (existing as any).value : null;

  let newCount: number;
  let newAvg: number;

  if (oldValue !== null) {
    // User is changing an existing rating — count stays the same, swap old value for new
    const total = Math.round(oldAvg * oldCount * 100) / 100;
    newCount = oldCount;
    newAvg   = newCount > 0 ? Math.round(((total - oldValue + v) / newCount) * 100) / 100 : v;
  } else {
    // Brand new rating — add to the existing aggregate (preserves pre-seeded counts)
    const total = Math.round(oldAvg * oldCount * 100) / 100;
    newCount = oldCount + 1;
    newAvg   = Math.round(((total + v) / newCount) * 100) / 100;
  }

  // Clamp avg to [1, 5]
  newAvg = Math.min(5, Math.max(newCount > 0 ? 1 : 0, newAvg));

  const { error: upsertErr } = await supabaseAdmin
    .from('Rating')
    .upsert({ adId, raterId, value: v }, { onConflict: 'adId,raterId' });

  if (upsertErr) {
    console.error('Rating upsert error:', upsertErr);
    return NextResponse.json({ error: upsertErr.message || 'Failed to save rating' }, { status: 500 });
  }

  await supabaseAdmin.from('Ad').update({ ratingAvg: newAvg, ratingCount: newCount }).eq('id', adId);

  return NextResponse.json({ ratingAvg: newAvg, ratingCount: newCount, userRating: v });
}
