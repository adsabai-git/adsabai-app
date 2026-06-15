import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

export async function PATCH(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, email, phone, password } = body;

  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: 'Name and either email or mobile number are required.' }, { status: 400 });
  }

  const updateData: Record<string, string> = { name };

  if (email) {
    updateData.email = email;
  } else {
    // phone-only: keep the synthetic email, just update phone
    updateData.phone = phone;
  }

  if (password) {
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    updateData.password = await bcrypt.hash(password, 10);
  }

  const { data: updatedUser, error } = await supabaseAdmin
    .from('User')
    .update(updateData)
    .eq('id', payload.userId)
    .select('id,name,email,phone')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'That email or mobile number is already in use.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unable to update account.' }, { status: 500 });
  }

  const displayEmail = updatedUser.email?.endsWith('@adsabai.local') ? null : updatedUser.email;
  return NextResponse.json({ user: { id: updatedUser.id, name: updatedUser.name, email: displayEmail, phone: updatedUser.phone } });
}
