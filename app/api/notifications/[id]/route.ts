import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = (request.headers.get('authorization') ?? '').replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = String((payload as any).userId);

  const { error } = await supabaseAdmin
    .from('Notification')
    .delete()
    .eq('id', Number(id))
    .eq('userId', uid); // ensure users can only delete their own

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
