import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabase';
import { verifyToken } from '../../../lib/auth';

function userId(request: Request): string | null {
  const token = (request.headers.get('authorization') ?? '').replace('Bearer ', '');
  const payload = verifyToken(token);
  return payload ? String((payload as any).userId) : null;
}

// GET /api/notifications — list current user's notifications, newest first
export async function GET(request: Request) {
  const uid = userId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('Notification')
    .select('*')
    .eq('userId', uid)
    .order('createdAt', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH /api/notifications — mark all as read
export async function PATCH(request: Request) {
  const uid = userId(request);
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabaseAdmin
    .from('Notification')
    .update({ read: true })
    .eq('userId', uid)
    .eq('read', false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
