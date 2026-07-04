import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyResetToken } from '../../../../lib/reset-token';

export async function POST(request: Request) {
  const { token, uid, password } = await request.json();

  if (!token || !uid || !password) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  // Fetch current password hash so we can validate the HMAC
  const { data: user } = await supabaseAdmin
    .from('User')
    .select('id, password')
    .eq('id', Number(uid))
    .single();

  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired link.' }, { status: 400 });
  }

  const userId = verifyResetToken(token, user.password);
  if (!userId || userId !== user.id) {
    return NextResponse.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const { error } = await supabaseAdmin
    .from('User')
    .update({ password: hashed })
    .eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to update password. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
