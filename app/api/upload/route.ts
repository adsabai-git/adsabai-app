import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../../../lib/supabase';

const BUCKET = 'ads';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('image') as File | null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
  }

  const ext      = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const bytes    = Buffer.from(await file.arrayBuffer());

  let { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, bytes, { contentType: file.type || 'application/octet-stream' });

  // First run: bucket doesn't exist yet — create as public and retry
  if (error?.message?.includes('Bucket not found')) {
    const { error: ce } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
    if (ce && ce.message !== 'Bucket already exists') {
      return NextResponse.json({ error: ce.message }, { status: 500 });
    }
    ({ error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, bytes, { contentType: file.type || 'application/octet-stream' }));
  }

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Public URL — permanent, no expiry
  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: publicUrl });
}
