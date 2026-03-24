import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'SafePark/1.0 (smart-city-parking-app)',
      'Accept-Language': 'en',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await res.json();
  const results = data.map((item) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    display_name: item.display_name as string,
  }));

  return NextResponse.json(results);
}
