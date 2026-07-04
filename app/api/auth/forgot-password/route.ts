import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '../../../../lib/supabase';
import { generateResetToken } from '../../../../lib/reset-token';

export async function POST(request: Request) {
  const { identifier } = await request.json();
  if (!identifier?.trim()) {
    return NextResponse.json({ error: 'Please enter your email or mobile number.' }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from('User')
    .select('id, name, email, phone, password')
    .eq('email', identifier.trim().toLowerCase())
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const emailAddr = user.email?.endsWith('@adsabai.local') ? null : user.email;
  if (!emailAddr) {
    return NextResponse.json({ phone_only: true });
  }

  const stripBOM = (s: string) => s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
  const gmailUser = stripBOM(process.env.GMAIL_USER ?? '');
  const gmailPass = stripBOM(process.env.GMAIL_APP_PASSWORD ?? '');
  if (!gmailUser || !gmailPass || gmailUser.length < 5 || gmailPass.length < 16) {
    console.error('[forgot-password] Gmail credentials not configured');
    return NextResponse.json(
      { error: 'Email service is not configured. Please contact support@adsabai.com.' },
      { status: 503 }
    );
  }

  const token = generateResetToken(user.id, user.password);
  const resetUrl = `https://adsabai.com/auth/reset-password?token=${encodeURIComponent(token)}&uid=${user.id}`;

  console.log('[forgot-password] Sending to:', emailAddr, '| Gmail user:', gmailUser, '| Pass length:', gmailPass.length);

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"AdSabai" <${gmailUser}>`,
      to: emailAddr,
      subject: 'Reset your AdSabai password',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#0f1623;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#C9A84C,#a8802e);padding:28px 32px;">
            <h1 style="color:#0f1623;font-size:24px;font-weight:800;margin:0;">AdSabai</h1>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 12px;">Reset your password</h2>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
              Hi ${user.name}, we received a request to reset the password for your AdSabai account.
              Click the button below to choose a new password. This link expires in <strong style="color:#C9A84C;">1 hour</strong>.
            </p>
            <a href="${resetUrl}"
               style="display:inline-block;background:linear-gradient(135deg,#C9A84C,#a8802e);color:#0f1623;
                      font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">
              Reset Password →
            </a>
            <p style="color:#64748b;font-size:13px;margin:28px 0 0;line-height:1.6;">
              If you didn't request this, you can safely ignore this email — your password won't change.
            </p>
          </div>
          <div style="padding:16px 32px;border-top:1px solid #1e2d42;text-align:center;">
            <span style="color:#475569;font-size:12px;">© AdSabai · adsabai.com</span>
          </div>
        </div>
      `,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[forgot-password] Gmail send error:', msg);
    return NextResponse.json(
      { error: `Email failed: ${msg} | user=${gmailUser} | passLen=${gmailPass.length} | passStart=${gmailPass.slice(0,4)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
