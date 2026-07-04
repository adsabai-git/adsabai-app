import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email?.trim() || !email.includes('@')) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (email.endsWith('@adsabai.local')) {
    return NextResponse.json({ error: 'Please enter a real email address.' }, { status: 400 });
  }

  // Make sure the email isn't taken by another account
  const { data: existing } = await supabaseAdmin
    .from('User')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (existing && existing.id !== payload.userId) {
    return NextResponse.json({ error: 'That email is already linked to another account.' }, { status: 400 });
  }

  const { data: updated, error } = await supabaseAdmin
    .from('User')
    .update({ email: email.trim().toLowerCase() })
    .eq('id', payload.userId)
    .select('id, name, email, phone')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That email is already linked to another account.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
    },
  });
}
