import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '../../../../lib/supabase';
import { createToken } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, password } = body;

  if (!name || (!email && !phone) || !password) {
    return NextResponse.json({ error: 'Name, password and either email or mobile number are required.' }, { status: 400 });
  }

  // Check for duplicate email
  if (email) {
    const { data: existing } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }
  }

  // Check for duplicate phone
  if (phone) {
    const { data: existing } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Mobile number already registered.' }, { status: 409 });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // email column is NOT NULL in DB — use synthetic email for phone-only users
  const effectiveEmail = email || `phone_${phone!.replace(/[^0-9]/g, '')}@adsabai.local`;

  const { data: user, error } = await supabaseAdmin
    .from('User')
    .insert({ name, email: effectiveEmail, password: hashedPassword, ...(phone ? { phone } : {}) })
    .select('id,name,email,phone')
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }

  const token = createToken(user.id);

  const displayEmail = user.email.endsWith('@adsabai.local') ? null : user.email;
  return NextResponse.json({ user: { id: user.id, name: user.name, email: displayEmail, phone: user.phone }, token });
}
