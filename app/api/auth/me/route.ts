import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: user } = await supabaseAdmin
    .from('User')
    .select('id,name,email,phone')
    .eq('id', payload.userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const displayEmail = user.email?.endsWith('@adsabai.local') ? null : user.email;
  return NextResponse.json({ user: { id: user.id, name: user.name, email: displayEmail, phone: user.phone } });
}
