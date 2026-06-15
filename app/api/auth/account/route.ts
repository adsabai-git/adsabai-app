import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (payload as { userId: number }).userId;

  // 1. Delete notifications (no FK constraint)
  await supabaseAdmin.from('Notification').delete().eq('userId', userId);

  // 2. Delete ads — cascades: Payments (by adId), Inquiries (by adId), Ratings (by adId)
  await supabaseAdmin.from('Ad').delete().eq('userId', userId);

  // 3. Delete any remaining payments directly on userId (safety net)
  await supabaseAdmin.from('Payment').delete().eq('userId', userId);

  // 4. Delete the user account
  const { error } = await supabaseAdmin.from('User').delete().eq('id', userId);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
