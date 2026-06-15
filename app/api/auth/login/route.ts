import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';
import { createToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, phone, password } = body;

  if ((!email && !phone) || !password) {
    return NextResponse.json({ error: 'Email or mobile number and password are required.' }, { status: 400 });
  }

  let userQuery;
  if (email) {
    userQuery = supabaseAdmin
      .from('User')
      .select('id,name,email,phone,password')
      .eq('email', email)
      .maybeSingle();
  } else {
    userQuery = supabaseAdmin
      .from('User')
      .select('id,name,email,phone,password')
      .eq('phone', phone)
      .maybeSingle();
  }

  const { data: user } = await userQuery;

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = createToken(user.id);

  const displayEmail = user.email?.endsWith('@adsabai.local') ? null : user.email;
  return NextResponse.json({ user: { id: user.id, name: user.name, email: displayEmail, phone: user.phone }, token });
}
