import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const adId = Number(id);
  if (Number.isNaN(adId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  // Try atomic RPC first; fall back to read-increment-write
  const { data: rpcData, error: rpcError } = await supabaseAdmin
    .rpc('increment_ad_views', { ad_id: adId });

  if (!rpcError && rpcData !== null) {
    return NextResponse.json({ views: rpcData });
  }

  // Fallback
  const { data: ad } = await supabaseAdmin
    .from('Ad').select('views').eq('id', adId).single();

  if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });

  const newViews = ((ad as any).views || 0) + 1;
  await supabaseAdmin.from('Ad').update({ views: newViews }).eq('id', adId);
  return NextResponse.json({ views: newViews });
}
