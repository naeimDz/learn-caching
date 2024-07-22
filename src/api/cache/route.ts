import { NextResponse } from 'next/server';
import { invalidateTag, writeThroughCache, writeBehindCache } from '../../lib/cache';

export async function POST(req: Request) {
  const { action, key, data } = await req.json();

  switch (action) {
    case 'invalidate':
      invalidateTag(key);
      return NextResponse.json({ message: 'Cache invalidated' });
    case 'writeThrough':
      writeThroughCache(key, data);
      return NextResponse.json({ message: 'Data written through cache' });
    case 'writeBehind':
      writeBehindCache(key, data);
      return NextResponse.json({ message: 'Data queued for write-behind' });
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}